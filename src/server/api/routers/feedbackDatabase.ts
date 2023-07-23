import { z } from "zod";
import { prisma } from "~/../lib/prisma";
import { Feedback } from "~/interfaces/feedback";
import { Message } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { type Feedback } from ".prisma/client"; //TODO: import type from Prisma client
import { ThumbState } from ".prisma/client";

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure.input(Feedback).mutation(async ({ input }) => {
    const feedbackID = await prisma.feedback.create({
      data: {
        name: input.name,
        email: input.email,
        thumb: input.thumb,
        messages: {
          create: input.messages.map((message) => message),
        },
      },
    });
    return feedbackID;
  }),

  setComment: publicProcedure
    .input(z.object({ feedbackID: z.number(), comment: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.feedback.update({
        where: {
          id: input.feedbackID,
        },
        data: {
          comment: input.comment,
        },
      });
    }),

  setThumb: publicProcedure
    .input(
      z.object({ feedbackID: z.number(), thumb: z.nativeEnum(ThumbState) })
    )
    .mutation(async ({ input }) => {
      await prisma.feedback.update({
        where: {
          id: input.feedbackID,
        },
        data: {
          thumb: input.thumb,
        },
      });
    }),

  addMessage: publicProcedure
    .input(z.object({ message: Message, feedbackId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const messageID = await prisma.message.create({
          data: {
            content: input.message.content,
            role: input.message.role,
            feedback: {
              connect: {
                id: input.feedbackId,
              },
            },
          },
        });
        return messageID;
      } catch (e) {
        console.log(e);
      }
    }),

  getAllData: publicProcedure.query(async () => {
    const output = await prisma.feedback.findMany();
    return output;
  }),
});
