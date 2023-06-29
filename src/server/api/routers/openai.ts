import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Role, Message } from "~/interfaces/chat";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain, loadQAMapReduceChain } from "langchain/chains";
import { Document } from "langchain/document";

import {
  type BaseChatMessage,
  HumanChatMessage,
  AIChatMessage,
  SystemChatMessage,
} from "langchain/schema";

const chat = new ChatOpenAI({ temperature: 0 });

const doc = new Document({ pageContent: "Psychotherapy (also psychological therapy, talk therapy, or talking therapy) is the use of psychological methods, particularly when based on regular personal interaction, to help a person change behavior, increase happiness, and overcome problems. Psychotherapy aims to improve an individual's well-being and mental health, to resolve or mitigate troublesome behaviors, beliefs, compulsions, thoughts, or emotions, and to improve relationships and social skills.[1] Numerous types of psychotherapy have been designed either for individual adults, families, or children and adolescents. Certain types of psychotherapy are considered evidence-based for treating some diagnosed mental disorders; other types have been criticized as pseudoscience.[2]", metadata: { source: "1" } });

export const openAIRouter = createTRPCRouter({
  chat: publicProcedure
    // using zod schema to validate and infer input values
    .input(z.array(Message))
    .mutation(async ({ input }) => {
      try {
        // const messageArray: BaseChatMessage[] = input.map((message) => {
        //   if (message.role === Role.User) {
        //     return new HumanChatMessage(message.content);
        //   } else if (message.role === Role.System) {
        //     return new SystemChatMessage(message.content);
        //   } else {
        //     return new AIChatMessage(message.content);
        //   }
        // });

        const llmA = new OpenAI({});
        const chainA = loadQAStuffChain(llmA);
        const docs = [
          new Document({ pageContent: "Psychotherapy (also psychological therapy, talk therapy, or talking therapy) is the use of psychological methods, particularly when based on regular personal interaction, to help a person change behavior, increase happiness, and overcome problems. Psychotherapy aims to improve an individual's well-being and mental health, to resolve or mitigate troublesome behaviors, beliefs, compulsions, thoughts, or emotions, and to improve relationships and social skills.[1] Numerous types of psychotherapy have been designed either for individual adults, families, or children and adolescents. Certain types of psychotherapy are considered evidence-based for treating some diagnosed mental disorders; other types have been criticized as pseudoscience.[2]", metadata: { source: "1" } }),
          new Document({ pageContent: "Ankush went to Princeton.", metadata: { source: "2" } }),
        ];
        console.log(input[-1]?.content)
        const resA = await chainA.call({
          input_documents: docs,
          question: input[input.length - 1]?.content,
        });

        console.log(resA)
        return {
          role: Role.Assistant,
          content: resA.text,
        };
      } catch (error) {
        console.error(error);
      }
    }),
});
