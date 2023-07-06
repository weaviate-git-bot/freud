import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import path from "path";
import weaviate from "weaviate-ts-client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Define manual metadata
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

// Setup weaviate client
const client = (weaviate as any).client({
  scheme: process.env.WEAVIATE_SCHEME,
  host: process.env.WEAVIATE_HOST,
  apiKey: new (weaviate as any).ApiKey(process.env.WEAVIATE_API_KEY),
});

const embeddings = new OpenAIEmbeddings();

export const vectorRouter = createTRPCRouter({
  create: publicProcedure.input(z.string()).mutation(async () => {
    console.debug("Called create vector store procedure");

    try {
      // Load documents
      // See https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/directory
      console.debug("Load documents");
      const sourceDirectoryPath = path.join(process.cwd(), "documents");
      const loader = new DirectoryLoader(path.join(sourceDirectoryPath), {
        ".pdf": (sourceDirectoryPath) =>
          new PDFLoader(sourceDirectoryPath, { splitPages: true }),
        ".txt": (sourceDirectoryPath) => new TextLoader(sourceDirectoryPath),
        ".epub": (sourceDirectoryPath) =>
          new EPubLoader(sourceDirectoryPath, {
            splitChapters: false,
          }),
      });
      const docs = await loader.load();

      // Add custom metadata
      console.debug("Add custom metadata to documents");
      docs.forEach((document) => {
        const filename = document.metadata.source
          .split("/")
          .pop()
          .split(".")[0];

        // Add metadata to document
        document.metadata.author = metadataDictionary[filename].author;
        document.metadata.title = metadataDictionary[filename].title;
        document.metadata.pageNumber =
          document.metadata.loc && document.metadata.loc.pageNumber
            ? document.metadata.loc.pageNumber
            : 0;
      });

      // // Split the text into chunks
      console.debug("Split documents into chunks");
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1536,
        chunkOverlap: 200,
      });
      const splits = await splitter.splitDocuments(docs);

      // Create the vector store
      console.debug("Create vector store (this may take a while...)");
      await WeaviateStore.fromDocuments(splits, embeddings, {
        client,
        indexName: "ISTDP_initial",
        textKey: "text",
        metadataKeys: ["source", "author", "title", "info"],
      });

      console.debug("Vector store created");

      return;
    } catch (error) {
      console.error(error);
    }
  }),
});
