import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { z } from "zod";
import { Message, Role } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { client } from "~/utils/weaviate/client";
import { embeddings } from "~/utils/weaviate/embeddings";
import { Configuration, OpenAIApi } from "openai";
import { Categories } from "~/pages";
import { Source } from "~/interfaces/source";
import { env } from "~/env.mjs";
import { getRetrieverFromIndex } from "~/utils/weaviate/getRetriever";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { Content } from "@radix-ui/react-popover";

const metadataKeys: string[] = [
    "author",
    "title",
    "pageNumber",
    "loc_lines_from",
    "loc_lines_to",
];




const configuration = new Configuration({
    apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;


export const sourceRouter = createTRPCRouter({
    ask: publicProcedure
        .input(z.object({ messages: z.array(Message), categories: Categories }))
        .mutation(async ({ input }) => {
            const question = input.messages[input.messages.length - 1]?.content;


            if (!question) {
                throw new Error("Question is undefined")
            }


            const arrayOfActiveCategories: string[] = [];
            for (const key in input.categories) {
                if (input.categories[key]) {
                    arrayOfActiveCategories.push(key);
                }
            }

            const useAllCategories: boolean = arrayOfActiveCategories.length == 0;

            const arrayOfVectorStores: WeaviateStore[] = [];
            for (const key in input.categories) {
                if (input.categories[key] || useAllCategories) {
                    arrayOfVectorStores.push(await getRetrieverFromIndex(key));
                }
            }

            const retriever = new MergerRetriever(
                arrayOfVectorStores,
                NUM_SOURCES,
                SIMILARITY_THRESHOLD
            );

            const documents = await retriever.getRelevantDocuments(question)

            // Sort documents for later grouping
            documents.sort((a, b) => { return a.metadata.title.localeCompare(b.metadata.title) })


            let stuffString = "";

            documents.map(((doc, index) => {
                stuffString += "Source " + (index + 1) + ":\n---\n" + doc.pageContent + "\n---\n\n"
            }))

            const formatedmessages = input.messages.map((message) => {
                return {
                    role: message.role,
                    content: message.content
                }
            })

            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: `You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${documents.length} sources below to answer the question, and if the question can't be answered based on the sources, say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${stuffString}` },
                ...formatedmessages],
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
                        content: source.pageContent,
                        author: source.metadata.author,
                        category: source.metadata.category,
                        filename: source.metadata.filename,
                        filetype: source.metadata.filetype,
                        title: source.metadata.title,
                        location: {
                            chapter: source.metadata.chapter,
                            href: source.metadata.href,
                            pageNr: source.metadata.pageNumber,
                            lineFrom: source.metadata.loc_lines_from
                                ? source.metadata.loc_lines_from
                                : 0,
                            lineTo: source.metadata.loc_lines_to
                                ? source.metadata.loc_lines_to
                                : 0,
                        },
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