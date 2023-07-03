import { z } from "zod";

// Defines an enum with the same values as the OpenAI API
// https://platform.openai.com/docs/guides/gpt/chat-completions-api
export enum Role {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

// Type for a source that is used by Freud when replying to a question
export const Source = z.object({
  file: z.string(),
  title: z.string(),
  author: z.string(),
  location: z.object({
    pageNr: z.optional(z.number()),
    lineFrom: z.number(),
    lineTo: z.number(),
  }),
  content: z.string(),
});

export type Source = z.infer<typeof Source>;

export const Message = z.object({
  role: z.nativeEnum(Role),
  content: z.string(),
  sources: z.optional(z.array(Source)),
});

export type Message = z.infer<typeof Message>;
