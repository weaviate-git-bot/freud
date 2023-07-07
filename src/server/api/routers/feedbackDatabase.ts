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
  createNewChat: publicProcedure // good
    .mutation(async () => {
        const chatID = await prisma.chat.create({
            data: {}, 
        });
        return chatID;
    }),
  addMessage: publicProcedure
    .input(z.object({message:Message,chatId:z.number()}))
    .mutation(async ( {input} ) => {
        console.log(input.message.sources);
        try{
            const messageID = await prisma.message.create({
                data: {
                    content:input.message.content,
                    role:input.message.role,
                    sources: ,
                    chat: {
                        connect: {
                            id: input.chatId,
                        }
                    }
                },
            });
            return messageID;
        }
        catch(e){
            console.log(e);
        }
    }),

  getAllData: publicProcedure
    .query(async () => {
        const users = await prisma.chat.findMany(); 
        console.log(users);
        return users;
    }),
  sendValues: publicProcedure
    .mutation(async () => {
        await prisma.testTable.create({ 
            data: {
                name: "David",
                email: "davidmail",
            }
        })
    }),
});



// Husk å legge til i root.ts