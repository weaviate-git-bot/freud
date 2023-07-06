import { z } from "zod";

export const Feedback=z.object({
    name: z.string().optional(),
email: z.string().optional(),
feedback: z.string(),
})


export type Feedback = z.infer<typeof Feedback>;