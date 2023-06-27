import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + input.text);
      const jsonData: string = await response.json();
      console.log(jsonData);
      return {
        greeting: `Pokemon: ${input.text}`,
        pokemon: jsonData
      };
    }),
});
