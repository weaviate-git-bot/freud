import { type WeaviateStore } from "langchain/vectorstores/weaviate";
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { env } from "~/env.mjs";
import { Message, Role } from "~/interfaces/message";
import { type Source } from "~/interfaces/source";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Categories } from "~/types/categories";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { getRetrieverFromIndex } from "~/utils/weaviate/getRetriever";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;

export const sourceRouter = createTRPCRouter({
  ask: publicProcedure
    .input(z.object({ messages: z.array(Message), categories: Categories }))
    .mutation(async ({ input }) => {
      const question = input.messages[input.messages.length - 1]?.content;

      if (!question) {
        throw new Error("Question is undefined");
      }

      const arrayOfActiveCategories: string[] = [];
      for (const key in input.categories) {
        if (input.categories[key]) {
          arrayOfActiveCategories.push(key);
        }
      }

      const useAllCategories: boolean = arrayOfActiveCategories.length == 0;

      const arrayOfVectorStores: WeaviateStore[] = [];
      for (const key in input.categories) {
        if (input.categories[key] || useAllCategories) {
          arrayOfVectorStores.push(await getRetrieverFromIndex(key));
        }
      }

      const retriever = new MergerRetriever(
        arrayOfVectorStores,
        NUM_SOURCES,
        SIMILARITY_THRESHOLD
      );

      const formatedmessages = input.messages.map((message) => {
        return {
          role: message.role,
          content: message.content,
        };
      });

      // make standalone question to get better sources
      const standalone = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, if the follow up question is already a standalone question, just return the follow up question.`,
          },
          ...formatedmessages,
        ],
        temperature: 0,
      });

      console.log(standalone.data.choices[0]?.message?.content)


      const documentswithscores = await retriever.getRelevantDocumentsWithScore(
        standalone.data.choices[0]?.message?.content!
      );

      documentswithscores.sort((a, b) => {
        return a[0].metadata.title.localeCompare(b[0].metadata.title);
      });

      const documents = documentswithscores.map(([doc, _]) => doc);

      // Sort documents for later grouping

      let stuffString = "";

      documents.map((doc, index) => {
        stuffString +=
          "Source " + (index + 1) + ":\n---\n" + doc.pageContent + "\n---\n\n";
      });


      // Can either use chat (...formatedmessages) or standalone question in completion below. Chat is more robust, costs more, and reaches input-limit quicker.
      // Standalone is not as robust, but can save money and hinder reaching input-limit.
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${documents.length} sources below to answer the question. If the question can't be answered based on the sources, just say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${stuffString}`,
          },
          ...formatedmessages,
        ],
        temperature: 0,
        // stream: true, For streaming: https://github.com/openai/openai-node/discussions/182
      });

      const response = completion.data.choices[0]?.message?.content;

      if (!response) {
        throw new Error("Reply is not defined");
      }

      const sources: Source[] = documentswithscores.map(([doc, score]) => {
        return {
          content: doc.pageContent,
          author: doc.metadata.author,
          category: doc.metadata.category,
          filename: doc.metadata.filename,
          filetype: doc.metadata.filetype,
          title: doc.metadata.title,
          location: {
            chapter: doc.metadata.chapter,
            href: doc.metadata.href,
            pageNr: doc.metadata.pageNumber,
            lineFrom: doc.metadata.loc_lines_from
              ? doc.metadata.loc_lines_from
              : 0,
            lineTo: doc.metadata.loc_lines_to ? doc.metadata.loc_lines_to : 0,
          },
          score: score,
        };
      });

      const reply: Message = {
        role: Role.Assistant,
        content: response,
        sources: sources,
      };

      return reply;
    }),
});
