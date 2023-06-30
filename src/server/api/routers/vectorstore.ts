import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import path from "path";

export const vectorRouter = createTRPCRouter({
  create: publicProcedure.input(z.string()).mutation(async () => {
    try {
      // Load documents
      // See https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/directory
      const sourceDirectoryPath = path.join(process.cwd(), "documents");
      const loader = new DirectoryLoader(path.join(sourceDirectoryPath), 
      {
        ".pdf": (sourceDirectoryPath) => new PDFLoader(sourceDirectoryPath, {splitPages: true}),
        ".txt": (sourceDirectoryPath) => new TextLoader(sourceDirectoryPath),
      });

      const docs = await loader.load();

      // // Split the text into chunks
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1536,
        chunkOverlap: 200,
      });

      const splits = await splitter.splitDocuments(docs);

      // Create the vectorStore
      const vectorStore = await HNSWLib.fromDocuments(
        splits,
        new OpenAIEmbeddings()
      );

      // Save the vectorStore to disk
      const databaseDirectoryPath = path.join(process.cwd(), "db");
      await vectorStore.save(databaseDirectoryPath);

      return;
    } catch (error) {
      console.error(error);
    }
  }),
});
