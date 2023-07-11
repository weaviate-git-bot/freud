import { z } from "zod";

export const weaviateClassProperties = z.object({
  dataType: z.array(z.string()),
  description: z.string(),
  indexFilterable: z.boolean(),
  indexSearchable: z.boolean(),
  name: z.string(),
});

export type weaviateClassProperties = z.infer<typeof weaviateClassProperties>;

export const weaviateClass = z.object({
  classname: z.string(),
  description: z.string(),
  vectorIndexType: z.string(),
  distanceMetric: z.string(),
  properties: z.array(weaviateClassProperties),
});

export type weaviateClass = z.infer<typeof weaviateClass>;
