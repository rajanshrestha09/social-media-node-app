import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(10, "post lenght must not be less than 10 character.")
});
