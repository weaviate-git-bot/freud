import { z } from "zod";

export const Source = z.object({
  title: z.string(),
  author: z.string(),
  location: z.object({
    pageNr: z.optional(z.number()),
    lineFrom: z.number(),
    lineTo: z.number(),
  }),
  content: z.string(),
  filename: z.string(),
  filetype: z.string(),
  category: z.string(),
});

export type Source = z.infer<typeof Source>;
