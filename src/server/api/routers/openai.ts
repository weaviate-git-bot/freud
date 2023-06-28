import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Role, Message } from "~/interfaces/chat";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  type BaseChatMessage,
  HumanChatMessage,
  AIChatMessage,
  SystemChatMessage,
} from "langchain/schema";

const chat = new ChatOpenAI({ temperature: 0 });

export const openAIRouter = createTRPCRouter({
  chat: publicProcedure
    // using zod schema to validate and infer input values
    .input(z.array(Message))
    .mutation(async ({ input }) => {
      try {
        const messageArray: BaseChatMessage[] = input.map((message) => {
          if (message.role === Role.User) {
            return new HumanChatMessage(message.content);
          } else if (message.role === Role.System) {
            return new SystemChatMessage(message.content);
          } else {
            return new AIChatMessage(message.content);
          }
        });

        const response = await chat.call(messageArray);
        return {
          role: Role.Assistant,
          content: response.text,
        };
      } catch (error) {
        console.error(error);
      }
    }),
});
