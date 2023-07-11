import weaviate from "weaviate-ts-client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type weaviateClass,
  type weaviateClassProperties,
} from "~/types/vectorStore";
import { z } from "zod";

// Setup weaviate client
const client = (weaviate as any).client({
  scheme: process.env.WEAVIATE_SCHEME,
  host: process.env.WEAVIATE_HOST,
  apiKey: new (weaviate as any).ApiKey(process.env.WEAVIATE_API_KEY),
});

export const weaviateRouter = createTRPCRouter({
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
            properties: []
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

  /* List objects contained in given schema */
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
        .then((res) => {
          const titles: string[] = res.data.Aggregate[input].map((data) => {
            return data.groupedBy.value;
          });
          return titles;
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }),
});
