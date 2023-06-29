import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { openAIRouter } from "~/server/api/routers/openai";
import { langchainRouter } from "./routers/langchain";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  openai: openAIRouter,
  langchain: langchainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
