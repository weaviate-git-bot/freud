import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { z } from "zod";
import { Source } from "~/interfaces/message";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { client } from "~/utils/weaviate/client";
import { embeddings } from "~/utils/weaviate/embeddings";
import { getRetrieverFromIndex } from "~/utils/weaviate/getRetriever";
import { ChatGPTAPI } from 'chatgpt'
import { env } from "~/env.mjs";
import { Configuration, OpenAIApi } from "openai";

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



export const sourceRouter = createTRPCRouter({
    hello: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            const weaviateStore = await WeaviateStore.fromExistingIndex(embeddings, {
                client,
                indexName: "ISTDP",
                metadataKeys,
            });

            const documents = await weaviateStore.similaritySearch(input, 5)

            let stuffString = "";

            documents.map(((doc, index) => {
                stuffString += "---\n Source " + (index + 1) + ": \n" + doc.pageContent + "\n---\n\n"
            }))

            console.log(stuffString)

            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "system", "content": `You are an expert psychiatrist that works as a mentor for a professional psychiatrist. They have a work-related question. Use the ${documents.length} sources below to answer the question, and if the question can't be answered based on the sources, say \"I don't know\". You must indicate when you have used each source. Show this with the number of the source in square brackets. \n\n${stuffString}\nQuestion: ${input}\nAnswer:` },
                { role: "user", content: input }],
                temperature: 0,
            });

            const output = response.data.choices[0]?.message?.content

            return output;
        }),
})