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

// Initialize the LLM to use to answer the question
const model = new OpenAI({});

// Load the vectorStore from disk
const databaseDirectoryPath = path.join(process.cwd(), "db");
const loadedVectorStore = await HNSWLib.load(
  databaseDirectoryPath,
  new OpenAIEmbeddings()
);

const THRESHOLD = 0.15
const NUM_LOADED = 10

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
      const filteredDocuments = documentsWithScore.filter((doc) => doc[1] >= THRESHOLD).map((doc, i) => { console.log(i, doc[0].metadata.info, 'score: ', doc[1]); return doc[0] })
      const retriever = (await MemoryVectorStore.fromDocuments(filteredDocuments, new OpenAIEmbeddings)).asRetriever(NUM_LOADED)

      // Create the chain
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
          //map_reduce is used because:
          //This chain incorporates a preprocessing step to select relevant sections from each document until the total number of tokens is less than the maximum number of tokens allowed by the model. It then uses the transformed documents as context to answer the question. It is suitable for QA tasks over larger documents and can run the preprocessing step in parallel, reducing the running time.
          // Other possibilities are https://js.langchain.com/docs/api/chains/types/QAChainParams
          qaChainOptions: { type: 'map_reduce' }
        }
      );
      try {
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
