/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Message, Role, type Source } from "~/interfaces/message";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import path from "path";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ConsoleCallbackHandler } from "langchain/callbacks";

// Initialize the LLM to use to answer the question
const model = new OpenAI({
  callbacks: [new ConsoleCallbackHandler()]
});

// Load the vectorStore from disk
const databaseDirectoryPath = path.join(process.cwd(), "db");
const loadedVectorStore = await HNSWLib.load(
  databaseDirectoryPath,
  new OpenAIEmbeddings()
);

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

const THRESHOLD = 0.2
const NUM_LOADED = 5


export const langchainRouter = createTRPCRouter({
  conversation: publicProcedure

    // Validate input
    .input(z.array(Message))

    // Query langchain
    .mutation(async ({ input }) => {
      const question = input[input.length - 1]?.content;

      if (!question) {
        console.error('No question recieved')
        return
      }

      const documentsWithScore = await loadedVectorStore.similaritySearchWithScore(question, NUM_LOADED)
      //doc[0] is the Document. doc[1] is the score. Line below filters on threshold and maps from tuple to list.
      const filteredDocuments = documentsWithScore.filter((doc) => doc[1] <= THRESHOLD).map((doc, i) => {
        // console.log(i, doc[0].metadata.info.title, 'score: ', doc[1]);
        return doc[0]
      })

      const retriever = (await MemoryVectorStore.fromDocuments(filteredDocuments, new OpenAIEmbeddings)).asRetriever(NUM_LOADED)

      const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        retriever,
        // loadedVectorStore.asRetriever(),
        {
          memory: new BufferMemory({
            memoryKey: "chat_history", // Must be set to "chat_history"
            inputKey: "memoryKey",
            outputKey: "text",
          }),
          returnSourceDocuments: true,
          qaTemplate: QA_PROMPT,
          questionGeneratorTemplate: CONDENSE_PROMPT,
          //map_reduce is used because:
          //This chain incorporates a preprocessing step to select relevant sections from each document until the total number of tokens is less than the maximum number of tokens allowed by the model. It then uses the transformed documents as context to answer the question. It is suitable for QA tasks over larger documents and can run the preprocessing step in parallel, reducing the running time.
          // Other possibilities are https://js.langchain.com/docs/api/chains/types/QAChainParams
          // qaChainOptions: { type: 'map_reduce' }
        }
      );
      try {
        const res = await chain.call({ question });
        // Sources used for answering
        //@ts-ignore Because there is little use for defineng the elem-type // I have ignored eslinter for this whole file
        const sources: Source[] = res.sourceDocuments.map((elem) => {
          return {
            title: elem.metadata.info.title,
            author: elem.metadata.info.author,
            location: {
              pageNr: elem.metadata.loc.pageNumber
                ? elem.metadata.loc.pageNumber
                : 0,
              lineFrom: elem.metadata.loc.lines.from,
              lineTo: elem.metadata.loc.lines.to,
            },
            content: elem.pageContent,
          };
        });
        // Construct final reply to question
        const reply: Message = {
          role: Role.Assistant,
          content: res.text,
          sources: sources,
        };
        // Return reply
        return reply;
      } catch (error) {
        console.log(error);
      }
    }),
});
