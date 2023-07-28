import { z } from "zod";

export const Categories = z.record(z.string(), z.boolean());

export type Categories = z.infer<typeof Categories>;
