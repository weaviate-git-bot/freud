import { Message } from "~/interfaces/message";
import { z } from "zod";
import { ThumbState } from "@prisma/client";

export const Feedback = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    thumb: z.nativeEnum(ThumbState),
    comment: z.string(),
    messages: z.array(Message),
})


export type Feedback = z.infer<typeof Feedback>;
