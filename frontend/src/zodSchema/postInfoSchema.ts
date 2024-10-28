import {z} from 'zod'

export const postInfoSchema=z.object({
    _id:z.string(),
    author: z.string(),
    content: z.string()
})

