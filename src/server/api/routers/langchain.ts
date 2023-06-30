import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Message, Role } from "~/interfaces/message";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import path from "path";

// Initialize the LLM to use to answer the question
const model = new OpenAI({});

// Load the vectorStore from disk
const databaseDirectoryPath = path.join(process.cwd(), "db");
const loadedVectorStore = await HNSWLib.load(
  databaseDirectoryPath,
  new OpenAIEmbeddings()
);

// Create the chain
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  loadedVectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history", // Must be set to "chat_history"
      inputKey: "memoryKey",
      outputKey: "text",
    }),
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
