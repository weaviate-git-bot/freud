/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConsoleCallbackHandler } from "langchain/callbacks";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { z } from "zod";
import { Message, Role, type Source } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getFullRetriever } from "~/utils/weaviate/getRetriever";

import { Categories } from "~/pages";

// Specify language model, embeddings and prompts
const model = new OpenAI({
  callbacks: [new ConsoleCallbackHandler()], // TODO: Change model and maybe use verbose instead of this "ConsoleCallbackHandler"
});

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are an expert psychologist who are helping a colleague. They have a work-related question. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}:

Helpful answer:`;

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;

// Connect to weaviate vector store

// Define TRPCRouter endpoint
export const langchainRouter = createTRPCRouter({
  conversation: publicProcedure

    // Validate input
    .input(z.object({messages: z.array(Message), categories: Categories })) // TODO: 

    .mutation(async ({ input }) => {
      const question = input.messages[input.messages.length - 1]?.content;

      console.log(input.categories);

      const retriever = await getFullRetriever(
        NUM_SOURCES,
        SIMILARITY_THRESHOLD
      );

      try {
        // Call to langchain Conversational Retriever QA
        // For filtering, see https://weaviate.io/developers/weaviate/api/graphql/filters
        const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
          memory: new BufferMemory({
            memoryKey: "chat_history", // Must be set to "chat_history"
            inputKey: "memoryKey",
            outputKey: "text",
          }),
          returnSourceDocuments: true,
          qaTemplate: QA_PROMPT,
          questionGeneratorTemplate: CONDENSE_PROMPT,
        });

        const res = await chain.call({ question });

        // Sources used for answering
        const sources: Source[] = res.sourceDocuments.map(
          (source: {
            metadata: {
              author: any;
              title: any;
              pageNumber: any;
              loc_lines_from: any;
              loc_lines_to: any;
            };
            pageContent: any;
          }) => {
            return {
              author: source.metadata.author,
              title: source.metadata.title,
              location: {
                pageNr: source.metadata.pageNumber,
                lineFrom: source.metadata.loc_lines_from
                  ? source.metadata.loc_lines_from
                  : 0,
                lineTo: source.metadata.loc_lines_to
                  ? source.metadata.loc_lines_to
                  : 0,
              },
              content: source.pageContent,
            };
          }
        );

        // Reply
        const reply: Message = {
          role: Role.Assistant,
          content: res.text,
          sources: sources,
        };

        return reply;
      } catch (error) {
        console.error(error);
      }
    }),
});
