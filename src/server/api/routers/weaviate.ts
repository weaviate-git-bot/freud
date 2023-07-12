import { readdirSync } from "fs";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { EPubLoader } from "langchain/document_loaders/fs/epub";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import path from "path";
import weaviate from "weaviate-ts-client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type weaviateClass,
  type weaviateClassProperties,
} from "~/types/vectorStore";

// Define manual metadata for books
const metadataDictionary: { [key: string]: metadataType } = {
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

type metadataType = {
  title: string;
  author: string;
  isbn: number;
};

// Define metadata for vetor store indexes
const indexDescriptions = {
  ISTDP: "Initial batch of ISTDP works for Freud",
  Test: "Testing...",
};

// Root directory containing source documents
const rootDirectoryPath = path.join(process.cwd(), "documents");

// Setup weaviate client
const client = (weaviate as any).client({
  scheme: process.env.WEAVIATE_SCHEME,
  host: process.env.WEAVIATE_HOST,
  apiKey: new (weaviate as any).ApiKey(process.env.WEAVIATE_API_KEY),
});

// Use OpenAI embeddings
const embeddings = new OpenAIEmbeddings();

/* tRPC router

- createSchema
- listSchemas
- deleteSchema
- listObjectsFromSchema
- generateVectorStoreFromDisk

*/
export const weaviateRouter = createTRPCRouter({
  /* Create schema */
  createSchema: publicProcedure

    //
    .input(z.string())

    //
    .mutation(async ({ input }) => createIndex(input)),

  /* List all schemas */
  listSchemas: publicProcedure.query(async () => {
    // The final response is an array with weaviateClass objects
    const response: weaviateClass[] = [];

    // Make request
    return client.schema
      .getter()
      .do()
      .then((res: any) => {
        // Iterate through classes
        res.classes.map((c: any) => {
          const weaviateClass: weaviateClass = {
            classname: c.class,
            description: c.description,
            vectorIndexType: c.vectorIndexType,
            distanceMetric: c.vectorIndexConfig.distance,
            properties: [],
          };

          // Array with properties of data in weaviate class
          const classProperties: weaviateClassProperties[] = [];

          // Get properties of each data type in weaviate class
          c.properties.map((p: any) => {
            const classProperty: weaviateClassProperties = {
              dataType: p.dataType,
              description: p.description,
              indexFilterable: p.indexFilterable,
              indexSearchable: p.indexSearchable,
              name: p.name,
            };

            // Push properties of data type to array
            classProperties.push(classProperty);
          });

          // Append array of properties to weaviate class object
          weaviateClass.properties = classProperties;

          // Append weaviate class object to array
          response.push(weaviateClass);
        });
        return response;
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }),

  /* Delete a schema */
  deleteSchema: publicProcedure

    // Input validation
    .input(z.string())

    // Delete schema
    .mutation(({ input }) => {
      console.debug("Deleting " + input);
      return client.schema
        .classDeleter()
        .withClassName(input)
        .do()
        .then((res: any) => {
          console.debug(res);
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }),

  /* List objects contained in given schema, grouped by title */
  listObjectsFromSchema: publicProcedure

    // Input validation
    .input(z.string())

    // Get and return objects
    .mutation(({ input }) => {
      console.debug("Getting objects in: " + input);
      return client.graphql
        .aggregate()
        .withClassName(input)
        .withGroupBy(["title"])
        .withFields("groupedBy { value }")
        .do()
        .then((res: any) => {
          const titles: string[] = res.data.Aggregate[input].map(
            (data: any) => {
              return data.groupedBy.value;
            }
          );
          return {
            index: input,
            titles: titles,
          };
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }),

  generateVectorStoreFromDisk: publicProcedure

    //
    .mutation(async () => {
      console.debug("Called create vector store procedure");

      // Find existing classes
      const existingSchemas: string[] = await getExistingSchemas();

      // Iterate through directories on disk
      // Each directory represents an index
      const indexesFromDirectories: string[] = readdirSync(rootDirectoryPath, {
        withFileTypes: true,
      })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      indexesFromDirectories.forEach(async (indexName) => {
        if (existingSchemas.includes(indexName)) {
          console.debug(`Index ${indexName} already exists`);

          // Load document
          const docs = await loadDocuments(indexName);

          // Return early if no new documents
          if (docs?.length === 0) {
            return;
          }

          // Create vector store from documents
          return createVectorStoreFromDocuments(indexName, docs, embeddings);
        } else {
          console.debug(`Creating index ${indexName}`);
          createIndex(indexName)
            .then(async () => {
              // Load document
              const docs = await loadDocuments(indexName);

              // Return early if no new documents
              if (docs?.length === 0) {
                return;
              }

              // Add documents to vector store
              return createVectorStoreFromDocuments(
                indexName,
                docs,
                embeddings
              );
            })
            .catch((error: Error) => {
              console.error(`Failed to create index: ${indexName}`);
              console.error(error);
            });
        }
      });
    }),
});

/* Helper functions

- createIndex()
- loadDocuments()
- createVectorStoreFromDocuments()
- addDocumentsToVectorStore()
*/

async function createIndex(indexName: string) {
  const weaviateClassObj = {
    class: indexName,
    description: indexDescriptions[indexName],
    vectorIndexType: "hnsw",
    vectorizeClassName: true,
    properties: [
      {
        name: "title",
        dataType: ["string"],
        description: "Book title",
        vectorizePropertyName: true,
        index: true,
      },
      {
        name: "author",
        dataType: ["string"],
        description: "Author of book",
      },
      {
        name: "source",
        dataType: ["string"],
        description: "Filename of source data",
      },
      {
        name: "text",
        dataType: ["text"],
        description: "Text split",
      },
      {
        name: "pageNumber",
        dataType: ["int"],
        description: "Page number of text split",
      },
      {
        name: "loc_lines_from",
        dataType: ["int"],
        description: "Text split beginning",
      },
      {
        name: "loc_lines_to",
        dataType: ["int"],
        description: "Text split end",
      },
    ],
  };

  return await client.schema.classCreator().withClass(weaviateClassObj).do();
}

async function getExistingSchemas() {
  const existingSchemas: string[] = [];

  return await client.schema
    .getter()
    .do()
    .then((res: any) => {
      res.classes.map((c: any) => {
        existingSchemas.push(c.class);
      });
    })
    .then(() => {
      return existingSchemas;
    });
}

async function loadDocuments(indexName: string) {
  try {
    // Load documents
    // See https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/directory
    console.debug(`- Load documents (${indexName})`);
    const sourceDirectoryPath = path.join(rootDirectoryPath, indexName);
    const loader = new DirectoryLoader(path.join(sourceDirectoryPath), {
      ".pdf": (sourceDirectoryPath) =>
        new PDFLoader(sourceDirectoryPath, {
          splitPages: true,
        }),
      ".epub": (sourceDirectoryPath) =>
        new EPubLoader(sourceDirectoryPath, {
          splitChapters: true,
        }),
    });
    const allDocs = await loader.load();

    // Add custom metadata
    console.debug(`- Clean document list and add metadata (${indexName})`);

    const validKeys = ["author", "title", "source", "pageNumber"];
    const docs = [];

    // allDocs.forEach((document) => {
    await Promise.all(
      allDocs.map(async (document) => {
        const filename = document.metadata.source
          .split("/")
          .pop()
          .split(".")[0];
        const title = metadataDictionary[filename].title;

        const objectExists = await isObjectInIndex(indexName, title);
        if (objectExists) {
          // console.debug(`-> ${title} already exists in ${indexName}`);
          return;
        }

        // console.debug(`-> Added ${filename} to ${indexName}`);

        // Add metadata to document
        document.metadata.author = metadataDictionary[filename].author;
        document.metadata.title = title;
        document.metadata.pageNumber =
          document.metadata.loc && document.metadata.loc.pageNumber
            ? document.metadata.loc.pageNumber
            : 0;

        // Remove remainding metadata
        Object.keys(document.metadata).forEach(
          (key) => validKeys.includes(key) || delete document.metadata[key]
        );

        // Push to cleaned document array
        docs.push(document);
      })
    );

    // Return early if there are no new documents
    if (docs.length === 0) {
      console.debug("-> No new documents in " + indexName);
      return [];
    }

    // Split the text into chunks
    console.debug(`- Split documents into chunks (${indexName})`);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1536,
      chunkOverlap: 200,
    });

    const splits = await splitter.splitDocuments(docs);
    return splits;
  } catch (error) {
    console.error(error);
  }
}

async function isObjectInIndex(indexName: string, title: string) {
  const exists = await client.graphql
    .get()
    .withClassName(indexName)
    .withFields("title")
    // .withConsistencyLevel("ONE")
    .withWhere({
      operator: "Equal",
      path: ["title"],
      valueText: title,
    })
    .do()
    .then((res: any) => {
      return res.data.Get[indexName].length > 0;
    })
    .catch((error) => {
      console.error(error);
    });

  return exists;
}

async function createVectorStoreFromDocuments(
  indexName: string,
  splits: Array<Document<Record<string, any>>>,
  embeddings: OpenAIEmbeddings
) {
  // Create the vector store
  console.debug(
    `- Create vector store (this may take a while...) (${indexName})`
  );
  await WeaviateStore.fromDocuments(splits, embeddings, {
    client,
    indexName: indexName,
    metadataKeys: [
      "title",
      "author",
      "source",
      "pageNumber",
      "loc_lines_from",
      "loc_lines_to",
    ],
  });

  console.debug(`- Vector store created (${indexName})`);
}

function addDocumentsToVectorStore(
  indexName: string,
  splits: Array<Document<Record<string, any>>>,
  embeddings: OpenAIEmbeddings
) {
  return;
}
