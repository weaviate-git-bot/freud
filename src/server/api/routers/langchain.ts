/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConsoleCallbackHandler } from "langchain/callbacks";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { z } from "zod";
import { Message, Role } from "~/interfaces/message";
import type { Source } from "~/interfaces/source";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getFullRetriever } from "~/utils/weaviate/getRetriever";

// Function for retrieving an array of the three questions that chatGPT returns
function textToFollowUps(str: string | undefined): string[] {
  if (str == undefined) {
    return [];
  }
  const followUpQuestions: string[] = [];
  for (let i = 1; i < 4; i++) {
    let question = "";
    let start_found = false;
    let start_index = 0;
    for (let j = 0; j < str.length; j++) {
      if (str[j] == i.toString() && !start_found) {
        start_index = j + 3;
        start_found = true;
      }
      if (str[j] == "?" && start_found) {
        question = str.substring(start_index, j + 1);
        followUpQuestions.push(question);
        break;
      }
    }
  }
  return followUpQuestions;
}

// Specify language model, embeddings and prompts
const model = new OpenAI({
  callbacks: [new ConsoleCallbackHandler()],
  cache: true,
});

const CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`;

const QA_PROMPT = `You are an expert psychologist who are helping a colleague. They have a work-related question. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}:

Helpful answer:`;

const NUM_SOURCES = 5;
const SIMILARITY_THRESHOLD = 0.3;

// Connect to weaviate vector store

// Define TRPCRouter endpoint
export const langchainRouter = createTRPCRouter({
  conversation: publicProcedure

    // Validate input
    .input(z.array(Message))

    .mutation(async ({ input }) => {
      const question = input[input.length - 1]?.content;
      const retriever = await getFullRetriever(
        NUM_SOURCES,
        SIMILARITY_THRESHOLD
      );

      try {
        // Call to langchain Conversational Retriever QA
        // For filtering, see https://weaviate.io/developers/weaviate/api/graphql/filters
        const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever, {
          memory: new BufferMemory({
            memoryKey: "chat_history", // Must be set to "chat_history"
            inputKey: "memoryKey",
            outputKey: "text",
          }),
          returnSourceDocuments: true,
          qaTemplate: QA_PROMPT,
          questionGeneratorTemplate: CONDENSE_PROMPT,
        });

        const res = await chain.call({ question });

        // Sources used for answering
        const sources: Source[] = res.sourceDocuments.map(
          (source: {
            pageContent: string;
            metadata: {
              author: string;
              category: string;
              chapter: string;
              filename: string;
              filetype: string;
              href: string;
              loc_lines_from: number;
              loc_lines_to: number;
              pageNumber: number;
              title: string;
            };
          }) => {
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

        // Reply
        const reply: Message = {
          role: Role.Assistant,
          content: res.text,
          sources: sources,
        };

        // Follow-up code
        const FOLLOWUP_PROMPT = `Based on the following, previous answer to a question, create three follow-up questions that are asked as if you were a professional psychiatrist asking another professional for guidance or info. You should only give the the three questions and nothing else.

Previous answer: ${reply.content}

Exception: However, if the answer says 'I don't know', or 'I don't understand', or 'not related to context', or if it is a question, or similar; then give one word questions only.

Three follow-up questions on the strict form: '1. Follow-up question one.\n2. Follow-up question two.\n3. Follow-up question three.'`;
        const questions_response = await model.call(FOLLOWUP_PROMPT);
        let generated_followup_questions = textToFollowUps(questions_response);
        console.log(generated_followup_questions);

        let letterCount = 0;
        generated_followup_questions.forEach((element) => {
          letterCount += element.length;
        });
        if (letterCount < 50) {
          // Because it should give one word questions if answer is bad!
          generated_followup_questions = [
            "How can I help my patient with anxiety?",
            "How do I assess trauma in a patient?",
            "What do I do if my patient is very silent?",
          ];
        }

        // Return reply
        return { reply, generated_followup_questions };
      } catch (error) {
        console.error(error);
      }
    }),
});
