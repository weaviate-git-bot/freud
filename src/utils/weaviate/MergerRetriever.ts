import { type Document } from "langchain/dist/document";
import { BaseRetriever } from "langchain/schema";
import {
  type WeaviateFilter,
  type WeaviateStore,
} from "langchain/vectorstores/weaviate";

export class MergerRetriever extends BaseRetriever {
  vectorStores: WeaviateStore[];

  k: number;

  threshold: number;

  filter: WeaviateFilter | undefined;

  constructor(
    vectorStores: WeaviateStore[],
    k?: number,
    threshold?: number,
    filter?: WeaviateFilter
  ) {
    super();
    this.vectorStores = vectorStores;
    this.k = k ? k : 5;
    this.filter = filter;
    this.threshold = threshold ? threshold : 1;
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    const results = await Promise.all(
      this.vectorStores.map(async (vectorStore) => {
        try {
          return await vectorStore.similaritySearchWithScore(
            query,
            this.k,
            this.filter
          );
        } catch (error) {
          console.error(error);
          return []; // Return an empty array if an error occurs
        }
      })
    );

    return (
      results
        // Combine results from all vector stores
        .flat(1)
        // Filter out bad results
        .filter(([_, score]) => score <= this.threshold)
        // Sort documents ascendingly by score
        .sort(([, doc1], [, doc2]) => doc1 - doc2)
        // Convert to array of documents (i.e. exclude score values)
        .map(([document, _]) => document)
        // Keep at most the best k results
        .slice(0, this.k)
    );
  }
}
