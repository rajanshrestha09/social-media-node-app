import { z } from 'zod'
import { usernameValidation, email, password } from './fieldValidation.js';

// export const usernameValidation = z
//   .string()
//   .min(2, 'Username must be at least 2 characters')
//   .max(20, 'Username must be no more than 20 characters')
//   .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema = z.object({
  username: usernameValidation,
  email: email,
  password: password
})