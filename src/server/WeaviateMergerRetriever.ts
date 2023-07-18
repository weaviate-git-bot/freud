import { type Document } from "langchain/dist/document";
import { BaseRetriever } from "langchain/schema";
import { type WeaviateStore } from "langchain/vectorstores/weaviate";

export class WeaviateMergerRetriever extends BaseRetriever {
  vectorStores: WeaviateStore[];

  similarityK: number;

  constructor(vectorStores: WeaviateStore[], k: number) {
    super();
    this.vectorStores = vectorStores;
    this.similarityK = k;
  }

  async getRelevantDocuments(query: string): Promise<Document[]> {
    let results: Promise<Document[]> = [];

    await Promise.all(
      this.vectorStores.map(async (vectorStore) => {
        console.debug(query);
        try {
          await vectorStore
            .asRetriever()
            .getRelevantDocuments(query)
            .then((result) => {
              results = [...results, ...result];
            });
        } catch (error) {
          console.error(error);
        }
      })
    );

    return results;
  }
}
