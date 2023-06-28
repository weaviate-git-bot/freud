import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
      return {
        message: chatCompletion.data.choices[0].message.content,
      };
    }),
});
