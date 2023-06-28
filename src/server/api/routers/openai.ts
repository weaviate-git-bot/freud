import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Role, type Message } from "~/interfaces/chat";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const openAIRouter = createTRPCRouter({
  chat: publicProcedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        query: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input.query }],
      });
      const message: Message = {
        role: Role.Assistant,
        content: chatCompletion.data.choices[0].message.content!, //TODO linter complains about possibly undefined value
      };
      return {
        message,
      };
    }),
});
