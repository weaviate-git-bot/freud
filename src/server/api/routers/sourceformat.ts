import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { z } from "zod";
import { Message, Role } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { client } from "~/utils/weaviate/client";
import { embeddings } from "~/utils/weaviate/embeddings";
import { Configuration, OpenAIApi } from "openai";
import { Categories } from "~/pages";
import { Source } from "~/interfaces/source";

const metadataKeys: string[] = [
    "author",
    "title",
    "pageNumber",
    "loc_lines_from",
    "loc_lines_to",
];




const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const weaviateStore = await WeaviateStore.fromExistingIndex(embeddings, {
    client,
    indexName: "ISTDP",
    metadataKeys,
});


export const sourceRouter = createTRPCRouter({
    ask: publicProcedure
        .input(z.object({ messages: z.array(Message), categories: Categories }))
        .mutation(async ({ input }) => {
            const question = input.messages[input.messages.length - 1]?.content;


            if (!question) {
                throw new Error("Question is undefined")
            }

            const documents = await weaviateStore.similaritySearchWithScore(question, 5)

            documents.map((doc) => {
                console.log(doc[0].metadata, doc[1])
            })

            let stuffString = "";

            documents.map(((doc, index) => {
                stuffString += "---\nSource " + (index + 1) + ": \n" + doc[0].pageContent + "\n---\n\n"
            }))

            console.log(stuffString)

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "system", "content": `You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${documents.length} sources below to answer the question, and if the question can't be answered based on the sources, say \"I don't know\". Show usage of each source with in-text citations. Do this by including square brackets with only the number of the source. \n\n${stuffString}` },
                { role: "user", content: question }],
                temperature: 0,
                // stream: true, For streaming: https://github.com/openai/openai-node/discussions/182
            });

            const response = completion.data.choices[0]?.message?.content


            if (!response) {
                throw new Error("Reply is not defined")
            }

            const sources: Source[] = documents.map(
                (source) => {
                    return {
                        author: source[0].metadata.author,
                        title: source[0].metadata.title,
                        location: {
                            pageNr: source[0].metadata.pageNumber,
                            lineFrom: source[0].metadata.loc_lines_from
                                ? source[0].metadata.loc_lines_from
                                : 0,
                            lineTo: source[0].metadata.loc_lines_to
                                ? source[0].metadata.loc_lines_to
                                : 0,
                        },
                        content: source[0].pageContent,
                    };
                }
            );

            const reply: Message = {
                role: Role.Assistant,
                content: response,
                sources: sources,
            };



            return reply;
        }),
})