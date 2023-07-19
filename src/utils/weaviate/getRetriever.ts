import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { MergerRetriever } from "./MergerRetriever";
import { client } from "./client";
import { embeddings } from "./embeddings";

const indexes: string[] = ["CBT", "ISTDP"];

const metadataKeys: string[] = [
  "author",
  "filename",
  "title",
  "pageNumber",
  "loc_lines_from",
  "loc_lines_to",
];

export function getRetrieverFromIndex(indexName: string) {
  return WeaviateStore.fromExistingIndex(embeddings, {
    client,
    indexName,
    metadataKeys,
  });
}

export async function getFullRetriever(
  numSources: number,
  similarityThreshold: number
) {
  const vectorStores = await Promise.all(
    indexes.map((indexName) => getRetrieverFromIndex(indexName))
  );

  return new MergerRetriever(vectorStores, numSources, similarityThreshold);
}
