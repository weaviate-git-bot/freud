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

const weaviateStore = await WeaviateStore.fromExistingIndex(embeddings, {
    client,
    indexName: "ISTDP",
    metadataKeys,
});

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
                if (input.categories[key]?.active) {
                    arrayOfActiveCategories.push(key);
                }
            }
            const useAllCategories: boolean = arrayOfActiveCategories.length == 0;

            const arrayOfVectorStores: WeaviateStore[] = [];
            for (const key in input.categories) {
                if (input.categories[key]?.active || useAllCategories) {
                    arrayOfVectorStores.push(await getRetrieverFromIndex(key));
                }
            }

            const retriever = new MergerRetriever(
                arrayOfVectorStores,
                NUM_SOURCES,
                SIMILARITY_THRESHOLD
            );

            const documents = await retriever.getRelevantDocuments(question)

            // const documents = await weaviateStore.similaritySearch(question, 5)


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
                        author: source.metadata.author,
                        title: source.metadata.title,
                        location: {
                            pageNr: source.metadata.pageNumber,
                            lineFrom: source.metadata.loc_lines_from
                                ? source.metadata.loc_lines_from
                                : 0,
                            lineTo: source.metadata.loc_lines_to
                                ? source.metadata.loc_lines_to
                                : 0,
                        },
                        content: source.pageContent,
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