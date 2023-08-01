import { type WeaviateStore } from "langchain/vectorstores/weaviate";
import { Configuration, OpenAIApi } from "openai";
import { boolean, string, z } from "zod";
import { env } from "~/env.mjs";
import { Message, Role } from "~/interfaces/message";
import { Source } from "~/interfaces/source";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Categories } from "~/types/categories";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { calcPrice } from "~/utils/usagecalc";
import { getRetrieverFromIndex } from "~/utils/weaviate/getRetriever";
import fsPromises from 'fs/promises';
import { type Document } from "langchain/dist/document";
import path from "path";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;

const defaultStandAlonePrompt = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, if the follow up question is already a standalone question, just return the follow up question.`
const defaultQAPrompt = "You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${0} sources below to answer the question. If the question can't be answered based on the sources, just say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${1}"


const getStandAlone = async (messages: { role: Role, content: string }[], prompt: string) => {



  // make standalone question to get better sources
  const standaloneCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      ...messages,
    ],
    temperature: 0,
  });

  return standaloneCompletion
}

const getDocuments = async (standalone: string, categories: Categories) => {

  const arrayOfActiveCategories: string[] = [];
  for (const key in categories) {
    if (categories[key]) {
      arrayOfActiveCategories.push(key);
    }
  }

  const useAllCategories: boolean = arrayOfActiveCategories.length == 0;

  const arrayOfVectorStores: WeaviateStore[] = [];
  for (const key in categories) {
    if (categories[key] || useAllCategories) {
      arrayOfVectorStores.push(await getRetrieverFromIndex(key));
    }
  }

  const retriever = new MergerRetriever(
    arrayOfVectorStores,
    NUM_SOURCES,
    SIMILARITY_THRESHOLD
  );

  const documentsWithScores = await retriever.getRelevantDocumentsWithScore(
    standalone
  );

  documentsWithScores.sort((a, b) => {
    return a[0].metadata.title.localeCompare(b[0].metadata.title);
  });

  return documentsWithScores;
}

const formatPrompt = (text: string, ...usedvariables: any) => {
  Object.keys(usedvariables).forEach((idx) => {
    text = text.replace(`\$\{${idx}\}`, usedvariables[idx])
  }
  )
  return text
}


const getResponse = async (documents: Document[], messages: { role: Role, content: string }[], prompt: string) => {

  let stuffString = "";

  documents.map((doc, index) => {
    stuffString +=
      "Source " + (index + 1) + ":\n---\n" + doc.pageContent + "\n---\n\n";
  });

  const formattedPrompt = formatPrompt(prompt, documents.length, stuffString)


  // Can either use chat (...formatedmessages) or standalone question in completion below. Chat is more robust, costs more, and reaches input-limit quicker.
  // Standalone is not as robust, but can save money and hinder reaching input-limit.
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: formattedPrompt,
      },
      ...messages,
    ],
    temperature: 0,
    // stream: true, For streaming: https://github.com/openai/openai-node/discussions/182
  });


  return completion;

}



export const sourceRouter = createTRPCRouter({

  getStandAlone: publicProcedure.input(z.array(Message)).mutation(async ({ input }) => {

    const formatedmessages = input.map((message) => {
      return {
        role: message.role,
        content: message.content,
      };
    });

    // make standalone question to get better sources
    const standaloneCompletion = await openai.createChatCompletion({
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

    return standaloneCompletion

  }),



  getSources: publicProcedure.input(z.object({
    standalone: z.string(),
    categories: Categories

  })

  ).mutation(
    async ({ input }) => {

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

      const documentswithscores = await retriever.getRelevantDocumentsWithScore(
        input.standalone
      );

      // Sort documents for later grouping in SourceGroup
      documentswithscores.sort((a, b) => {
        return a[0].metadata.title.localeCompare(b[0].metadata.title);
      });

      const documents = documentswithscores.map(([doc, _]) => doc);

      return documents;

    }
  ),


  getAnswer: publicProcedure.input(z.object({ chat: z.array(Message), documents: z.array(z.object({ pageContent: z.string(), metadata: z.object({}) })) })).mutation(async ({ input }) => {

    let stuffString = "";

    input.documents.map((doc, index) => {
      stuffString +=
        "Source " + (index + 1) + ":\n---\n" + doc.pageContent + "\n---\n\n";
    });

    const qaprompt = `You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${input.documents.length} sources below to answer the question. If the question can't be answered based on the sources, just say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${stuffString}`

    const formatedmessages = input.chat.map((message) => {
      return {
        role: message.role,
        content: message.content,
      };
    });

    // Can either use chat (...formatedmessages) or standalone question in completion below. Chat is more robust, costs more, and reaches input-limit quicker.
    // Standalone is not as robust, but can save money and hinder reaching input-limit.
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: qaprompt,
        },
        ...formatedmessages,
      ],
      temperature: 0,
      // stream: true, For streaming: https://github.com/openai/openai-node/discussions/182
    });

    const response = completion.data.choices[0]?.message?.content;

    return response;

  }),

  ask: publicProcedure
    //TODO Maybe move prompts and so on to an options object.
    .input(z.object({ messages: z.array(Message), categories: Categories, standalonePrompt: z.string().optional(), qaPrompt: z.string().optional() }))
    .mutation(async ({ input }) => {
      const question = input.messages[input.messages.length - 1]?.content;

      console.log("mutation")
      if (!question) {
        throw new Error("Question is undefined");
      }


      const formatedmessages = input.messages.map((message) => {
        return {
          role: message.role,
          content: message.content,
        };
      });

      const startStandAlone = performance.now()
      const standaloneCompletion = await getStandAlone(formatedmessages, input.standalonePrompt ?? defaultStandAlonePrompt)
      const standalone = standaloneCompletion.data.choices[0]?.message?.content;
      if (!standalone) {
        throw new Error("Standalone is not defined");
      }
      const timeTakenStandAlone = performance.now() - startStandAlone;

      console.log(standalone)

      const documentswithscores = await getDocuments(standalone, input.categories)

      const documents = documentswithscores.map(([doc, _]) => doc);

      const documentsString = documents.reduce((accumulator, currentValue, currentIndex) => {
        return accumulator + "Source " + (currentIndex + 1) + ":\n---\n" + currentValue.pageContent + "\n---\n\n";
      }, "");


      const qaPrompt = formatPrompt(input.qaPrompt ?? defaultQAPrompt, documents.length, documentsString)

      let startQA = performance.now();
      const completion = await getResponse(documents, formatedmessages, qaPrompt)
      let timeTakenQA = performance.now() - startQA;

      const response = completion.data.choices[0]?.message?.content;

      console.log(response?.substring(0, 10))

      if (!response) {
        throw new Error("Response is not defined");
      }

      console.log("QA: " + calcPrice(completion.data.usage!).toPrecision(3) + "$")

      const sources: Source[] = documentswithscores.map(
        ([doc, score]) => {
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
              lineTo: doc.metadata.loc_lines_to
                ? doc.metadata.loc_lines_to
                : 0,
            },
            score: score,
          };
        }
      );

      const reply: Message = {
        role: Role.Assistant,
        content: response,
        sources: sources,
      };


      // if (true) {
      //   const dataFilePath = path.join(process.cwd(), "src/server/api/json/testData.json");

      //   const jsonData = await fsPromises.readFile(dataFilePath, "utf8");
      //   const objectData = JSON.parse(jsonData);

      //   const toSave = { question: input.messages[input.messages.length - 1], reply: { role: reply.role, content: reply.content }, qaPrompt, standalone, timeTakenQA, timeTakenStandAlone, usage: { qa: completion.data.usage, standalone: standaloneCompletion.data.usage } };

      //   objectData.push(toSave)

      //   await fsPromises.writeFile(dataFilePath, (JSON.stringify(objectData)));
      // }



      return reply;
    }),
})
