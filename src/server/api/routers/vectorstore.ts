import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import path from "path";

const metadataDictionary = {
  a_revolutionary_method_of_dynamic_psychotherapy: {
    title: "Lives Transformed: A Revolutionary Method of Dynamic Psychotherapy",
    author: "David H. Malan, David Malan, and Patricia Coughlin Della Selva",
    isbn: 1855753782,
  },
  attachment_in_psychotherapy: {
    title: "Attachment in Psychotherapy",
    author: "David J. Wallin",
    isbn: 1593854560,
  },
  co_creating_creating_change_effective_dynamic_therapy_techniques: {
    title: "Co-Creating Change: Effective Dynamic Therapy Techniques",
    author: "Jon Frederickson",
    isbn: 9780988378841,
  },
  istd_psychotherapy_theory_and_technique: {
    title:
      "Intensive Short Term Dynamic Psychotherapy: Theory and Technique Synopsis",
    author: "Patricia Coughlin Della Selva",
    isbn: 1855753022,
  },
  its_not_always_depression: {
    title: "It's Not Always Depression",
    author: "Hilary Jacobs Hendel",
    isbn: 399588140,
  },
  maximizing_effectiveness_in_dynamic_psychotherapy: {
    title: "Maximizing Effectiveness in Dynamic Psychotherapy",
    author: "Patricia Coughlin",
    isbn: 9781138824966,
  },
  psychoanalytic_case_formulation: {
    title: "Psychoanalytic Case Formulation",
    author: "Nancy McWilliams",
    isbn: 1572304626,
  },
  psychoanalytic_psychotherapy_a_practitioners_guide: {
    title: "Psychoanalytic Psychotherapy: A Practitioner's Guide",
    author: "Nancy McWilliams",
    isbn: 9781606235829,
  },
  reaching_through_resistance_advanced_psyc: {
    title: "Reaching Through Resistance: Advanced Psychotherapy Techniques",
    author: "Allan Abbass",
    isbn: 988378868,
  },
  understanding_personality_structure_in_the_clinical_process: {
    title:
      "Psychoanalytic Diagnosis: Understanding Personality Structure in the Clinical Process",
    author: "Nancy McWilliams",
    isbn: 1609184947,
  },
};

export const vectorRouter = createTRPCRouter({
  create: publicProcedure.input(z.string()).mutation(async () => {
    try {
      // Load documents
      // See https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/directory
      const sourceDirectoryPath = path.join(process.cwd(), "documents");
      const loader = new DirectoryLoader(path.join(sourceDirectoryPath), {
        ".pdf": (sourceDirectoryPath) =>
          new PDFLoader(sourceDirectoryPath, { splitPages: false }),
        ".txt": (sourceDirectoryPath) => new TextLoader(sourceDirectoryPath),
        ".epub": (sourceDirectoryPath) =>
          new EPubLoader(sourceDirectoryPath, {
            splitChapters: false,
          }),
      });

      const docs = await loader.load();

      docs.forEach((document) => {
        // Extract file name
        const file = document.metadata.source.split("/").pop().split(".")[0];

        // Get metadata from dictionary
        const metadata = metadataDictionary[file];

        // Overwrite document metadata
        document.metadata = metadata;
      });

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

      console.info("Vector store created");

      // Save the vectorStore to disk
      const databaseDirectoryPath = path.join(process.cwd(), "db");
      await vectorStore.save(databaseDirectoryPath);

      console.info("Vector store saved to disk");

      return;
    } catch (error) {
      console.error(error);
    }
  }),
});
