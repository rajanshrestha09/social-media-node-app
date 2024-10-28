import { z } from 'zod'

export const postSchema = z.object({
    author: z.string(),
    content: z
        .string()
        .min(10, "Not less than 10."),
    likes: z.string().optional()
})