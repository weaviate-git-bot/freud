import { z } from "zod";
import { Source } from "./source";

// Defines an enum with the same values as the OpenAI API
// https://platform.openai.com/docs/guides/gpt/chat-completions-api
export enum Role {
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export const Message = z.object({
  role: z.nativeEnum(Role),
  content: z.string(),
  sources: z.optional(z.array(Source)),
});

export type Message = z.infer<typeof Message>;
