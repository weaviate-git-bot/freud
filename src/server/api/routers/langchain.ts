import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Message, Role, type Source } from "~/interfaces/message";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import path from "path";
import { ConsoleCallbackHandler } from "langchain/callbacks";

// Initialize the LLM to use to answer the question
const model = new OpenAI({ callbacks: [new ConsoleCallbackHandler()] });

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

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  loadedVectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history", // Must be set to "chat_history"
      inputKey: "memoryKey",
      outputKey: "text",
    }),
    qaTemplate: QA_PROMPT,
    questionGeneratorTemplate: CONDENSE_PROMPT,
    returnSourceDocuments: true,
  }
);

export const langchainRouter = createTRPCRouter({
  conversation: publicProcedure

    // Validate input
    .input(z.array(Message))

    // Query langchain
    .mutation(async ({ input }) => {
      try {
        const question = input[input.length - 1]?.content;
        const res = await chain.call({ question });

        // Sources used for answering
        //@ts-ignore Because there is little use for defineng the elem-type
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
