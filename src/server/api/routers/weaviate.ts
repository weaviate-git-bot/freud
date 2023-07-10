import weaviate from "weaviate-ts-client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type weaviateClass,
  type weaviateClassProperties,
} from "~/types/vectorStore";

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

  listSchemas: publicProcedure.query(async () => {
    // The final response is an array with weaviateClass objects
    const response: weaviateClass[] = [];

    // Make request
    client.schema
      .getter()
      .do()
      .then((res: any) => {
        // Iterate through classes
        res.classes.map((c) => {
          const weaviateClass: weaviateClass = {
            classname: c.class,
            description: c.description,
            vectorIndexType: c.vectorIndexType,
            distanceMetric: c.vectorIndexConfig.distance,
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
      })
      .catch((error: Error) => {
        console.error(error);
      });
    return response;
  }),

  schema: publicProcedure.query(async () => {
    return await client.schema
      .getter()
      // .classGetter()
      // .withClassName("ISTDP_initial")
      .do();
  }),
});
