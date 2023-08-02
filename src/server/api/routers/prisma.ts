import { ThumbState } from "@prisma/client";
import { z } from "zod";
import { prisma } from "~/../lib/prisma";
import { Message } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const prismaRouter = createTRPCRouter({
  /* Submit messages to be logged
   * - Generate new ChatId for new chats
   * - Otherwise append messages to existing ChatId
   * */
  logChat: publicProcedure
    .input(
      z.object({
        chatId: z.union([z.null(), z.string()]),
        messages: z.array(Message),
      })
    )

    .mutation(async ({ input }) => {
      const { chatId, messages } = input;
      if (chatId === null) {
        return await createChatLog(messages);
      } else {
        return await updateChatLog(chatId, messages);
      }
    }),

  submitFeedback: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
        messageId: z.number(),
        thumb: z.nativeEnum(ThumbState),
        name: z.optional(z.string()),
        email: z.optional(z.string()),
        comment: z.optional(z.string()),
      })
    )

    .mutation(async ({ input }) => {
      const { chatId, messageId } = input;
      return await prisma.feedback.upsert({
        where: {
          chatId_messageId: {
            chatId,
            messageId,
          },
        },
        create: input,
        update: input,
      });
    }),

  deleteFeedback: publicProcedure
    .input(
      z.object({
        chatId: z.string(),
        messageId: z.number(),
      })
    )

    .mutation(async ({ input }) => {
      const { chatId, messageId } = input;
      return await prisma.feedback.delete({
        where: {
          chatId_messageId: {
            chatId,
            messageId,
          },
        },
      });
    }),
});

async function createChatLog(messages: Message[]) {
  return await prisma.chat.create({
    data: {
      messages: {
        create: messages.map((message, id) => {
          const { role, content } = message;
          return {
            id,
            role,
            content,
            sources: {
              create: message?.sources?.map((source, sid) => {
                const { author, content, title } = source;
                return {
                  id: sid,
                  author,
                  content,
                  title,
                };
              }),
            },
          };
        }),
      },
    },
  });
}

async function updateChatLog(chatId: string, messages: Message[]) {
  try {
    let messageId = 0;
    for (const message of messages) {
      const { role, content, sources } = message;
      await prisma.message.upsert({
        where: {
          chatId_id: {
            chatId,
            id: messageId,
          },
        },
        update: {},
        create: {
          id: messageId,
          chat: {
            connect: {
              id: chatId,
            },
          },
          role,
          content,
          sources: {
            create: [], // We use an empty array to prevent direct creation of sources during message upsert
          },
        },
        include: {
          sources: true,
        },
      });

      // Now, handle the sources separately using nested upserts
      if (Array.isArray(sources)) {
        let sourceId = 0;
        for (const source of sources) {
          const { author, content, title } = source;
          await prisma.source.upsert({
            where: {
              chatId_messageId_id: {
                chatId,
                messageId,
                id: sourceId,
              },
            },
            update: {},
            create: {
              id: sourceId,
              message: {
                connect: {
                  chatId_id: {
                    chatId,
                    id: messageId,
                  },
                },
              },
              author,
              content,
              title,
            },
          });
        }
        sourceId++;
      }
      messageId++;
    }
  } catch (error) {
    console.error(error);
  }
}

// async function updateChat(chatId: string, messages) {
//   console.debug("update chatid: " + chatId);
//
//   try {
//     let messageId = 0;
//     for (const message of messages) {
//       const { role, content, sources } = message;
//       await prisma.message.upsert({
//         where: {
//           chatId_id: {
//             chatId,
//             id: messageId,
//           },
//         },
//         update: {},
//         create: {
//           id: messageId, // Use the unique field as the id
//           chat: {
//             connect: {
//               id: chatId,
//             },
//           },
//           role,
//           content,
//           sources: {
//             // Use nested upsert to upsert the sources for the message
//             upsert:
//               sources?.map((source, sid) => ({
//                 where: {
//                   chatId_messageId_id: {
//                     chatId,
//                     messageId,
//                     id: sid,
//                   },
//                 },
//                 update: {},
//                 create: {
//                   id: sid,
//                   message: {
//                     connect: {
//                       chatId_id: {
//                         chatId,
//                         id: messageId,
//                       },
//                     },
//                   },
//                   author: source.author,
//                   content: source.content,
//                   title: source.title,
//                 },
//               })) ?? [],
//           },
//         },
//         include: {
//           sources: true,
//         },
//       });
//     }
//
//     messageId++;
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function updateChat(chatId: string, messages: Message[]) {
//   console.debug("update chatid: " + chatId);
//
//   try {
//     let id = 0;
//
//     for (const message of messages) {
//       const { role, content, sources } = message;
//       await prisma.message.upsert({
//         where: {
//           chatId_id: {
//             chatId,
//             id,
//           },
//         },
//         update: {},
//         create: {
//           id,
//           chat: {
//             connect: {
//               id: chatId,
//             },
//           },
//           role,
//           content,
//           sources: {
//             create:
//               sources?.map((source) => ({
//                 ...source,
//                 chatId,
//                 messageId: id,
//               })) ?? [],
//           },
//         },
//         include: {
//           sources: true,
//         },
//       });
//     }
//
//     id++;
//   } catch (error) {
//     console.error(error);
//   }
//
//   // const payload = messages.map((message, i) => {
//   //   const sources =
//   //     message?.sources?.map((source, j) => {
//   //       return {
//   //         chatId: chatId,
//   //         messageId: i,
//   //         id: j,
//   //         author: source?.author,
//   //         content: source.content,
//   //         title: source?.title,
//   //       };
//   //     }) ?? [];
//   //
//   //   return {
//   //     chatId: chatId,
//   //     id: i,
//   //     role: message.role,
//   //     content: message.content,
//   //     sources: {
//   //       upsert: {
//   //         create: sources.map((s) => s),
//   //         update: sources.map((s) => s),
//   //       },
//   //     },
//   //   };
//   // });
//   //
//   // return await prisma.chat.update({
//   //   where: {
//   //     id: chatId,
//   //   },
//   //   data: {
//   //     messages: {
//   //       upsert: {
//   //         create: payload.map((p) => p),
//   //         update: payload.map((p) => p),
//   //         where: {
//   //           chatId_id: {
//   //             chatId: chatId,
//   //           },
//   //         },
//   //       },
//   //     },
//   //   },
//   //   include: {
//   //     messages: {
//   //       include: {
//   //         sources: true,
//   //       },
//   //     },
//   //   },
//   // });
// }
