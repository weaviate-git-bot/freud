import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const openAIRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ question: z.string() }))
    .query(async ({ input }) => {
      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input.question }],
      });
      console.log(chatCompletion.data.choices[0].message);
      return {
        message: chatCompletion.data.choices[0].message.content,
      };
    }),
});
