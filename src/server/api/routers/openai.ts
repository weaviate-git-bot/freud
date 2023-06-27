import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const openAIRouter = createTRPCRouter({
  chat: publicProcedure
    .input(z.object({ content: z.string() }))
    .query(async ({ input }) => {
      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input.content }],
      });
      return {
        message: chatCompletion.data.choices[0].message.content,
      };
    }),
});
