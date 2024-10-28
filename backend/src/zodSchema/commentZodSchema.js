import { z } from 'zod'


export const commentZodSchema = z.object({
    authorName: z.string(),
    content: z.string()
})