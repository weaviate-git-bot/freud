import weaviate from "weaviate-ts-client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Setup weaviate client
const client = (weaviate as any).client({
  scheme: process.env.WEAVIATE_SCHEME || "http",
  host: process.env.WEAVIATE_HOST || "localhost:8080",
  apiKey: new (weaviate as any).ApiKey(
    process.env.WEAVIATE_API_KEY || "default-api-key"
  ),
});

export const weaviateRouter = createTRPCRouter({
  stats: publicProcedure.query(async () => {
    return await client.graphql
      .aggregate()
      .withClassName("ISTDP_initial")
      .withGroupBy(["title"])
      .withFields("groupedBy { value } meta { count }")
      .do()
      .then((res) => {
        const reply = res.data.Aggregate.ISTDP_initial.map((data) => {
          return {
            author: data.groupedBy.value,
            count: data.meta.count,
          };
        });
        return reply;
      })
      .catch((err) => {
        console.error(err);
      });
  }),
});
