import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { initTRPC } from "@trpc/server";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const t = initTRPC.create();
export const openAIRouter = t.router({
  chat: t.procedure
    // using zod schema to validate and infer input values
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input.query }],
      });
      console.log(chatCompletion.data.choices[0].message.content)
      return {
        message: chatCompletion.data.choices[0].message.content,
      };
    }),
});