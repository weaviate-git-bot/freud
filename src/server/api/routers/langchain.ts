import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Message, Role } from "~/interfaces/message";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "langchain/document";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
import fs from "fs";
import path from "path";

// Following template from:
// https://js.langchain.com/docs/modules/chains/index_related_chains/document_qa

const llmA = new OpenAI({});
const chainA = loadQAStuffChain(llmA);
const docs = [
  new Document({
    pageContent:
      "Psychotherapy (also psychological therapy, talk therapy, or talking therapy) is the use of psychological methods, particularly when based on regular personal interaction, to help a person change behavior, increase happiness, and overcome problems. Psychotherapy aims to improve an individual's well-being and mental health, to resolve or mitigate troublesome behaviors, beliefs, compulsions, thoughts, or emotions, and to improve relationships and social skills.[1] Numerous types of psychotherapy have been designed either for individual adults, families, or children and adolescents. Certain types of psychotherapy are considered evidence-based for treating some diagnosed mental disorders; other types have been criticized as pseudoscience.[2]",
    metadata: { source: "1" },
  }),
  new Document({
    pageContent: "Ankush went to Princeton.",
    metadata: { source: "2" },
  }),
];

// Template: https://js.langchain.com/docs/modules/chains/index_related_chains/conversational_retrieval
/* Initialize the LLM to use to answer the question */
const model = new OpenAI({});
/* Load in the file we want to do question answering over */
const sourceDirectoryPath = path.join(process.cwd(), "documents");
const text = fs.readFileSync(
  path.join(sourceDirectoryPath, "state_of_the_union.txt"),
  "utf8"
);
/* Split the text into chunks */
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
const docs2 = await textSplitter.createDocuments([text]);
/* Create the vectorstore */
const vectorStore = await HNSWLib.fromDocuments(docs2, new OpenAIEmbeddings());
/* Create the chain */
const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history", // Must be set to "chat_history"
    }),
  }
);

export const langchainRouter = createTRPCRouter({
  // Define publice procedure for QA
  qa: publicProcedure

    // Validate input using zod
    .input(z.array(Message))

    // Query langchain
    .mutation(async ({ input }) => {
      //
      try {
        const resA = await chainA.call({
          input_documents: docs,
          question: input[input.length - 1]?.content,
        });
        return {
          role: Role.Assistant,
          content: resA.text,
        };
      } catch (error) {
        console.error(error);
      }
    }),
  conversation: publicProcedure

    // Validate input
    .input(z.array(Message))

    // Query langchain
    .mutation(async ({ input }) => {
      try {
        const question = input[input.length - 1]?.content;
        const res = await chain.call({ question });
        const reply: Message = {
          role: Role.Assistant,
          content: res.text,
        };
        return reply;
      } catch (error) {
        console.log(error);
      }
    }),
});
