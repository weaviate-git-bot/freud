import { Message } from "~/interfaces/message";
import { z } from "zod";

export const Feedback = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    comment: z.string(),
    messages: z.array(Message),
})


export type Feedback = z.infer<typeof Feedback>;