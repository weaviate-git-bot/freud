/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import prisma from "db";
import { Feedback } from "~/interfaces/feedback";
import { Message } from "~/interfaces/message";


export const feedbackRouter = createTRPCRouter({
    createNewFeedback: publicProcedure
        .input(Feedback)
        .mutation(async ({ input }) => {
            const feedbackID = await prisma.feedback.create({
                data: {
                    name: input.name,
                    email: input.email,
                    comment: input.comment,
                    messages: {
                        create: input.messages.map((message) => {
                            return {
                                role: message.role,
                                content: message.content,
                                sources: message.sources
                            }
                        })
                    }
                },
            });
            return feedbackID;
        }),
    addMessage: publicProcedure
        .input(z.object({ message: Message, feedbackId: z.number() }))
        .mutation(async ({ input }) => {
            console.log(input.message.sources);
            try {
                const messageID = await prisma.message.create({
                    data: {
                        content: input.message.content,
                        role: input.message.role,
                        feedback: {
                            connect: {
                                id: input.feedbackId,
                            }
                        }
                    },
                });
                return messageID;
            }
            catch (e) {
                console.log(e);
            }
        }),

    getAllData: publicProcedure
        .query(async () => {
            const output = await prisma.feedback.findMany();
            // console.log(users);
            return output;
        }),
    sendValues: publicProcedure
        .mutation(async () => {
            // await prisma.testTable.create({
            //     data: {
            //         name: "David",
            //         email: "davidmail",
            //     }
            // })
        }),
});



// Husk å legge til i root.ts