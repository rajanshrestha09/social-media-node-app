import { z } from 'zod'
import { usernameValidation, email, password } from './fieldValidation.js';


export const signUpSchema = z.object({
  username: usernameValidation,
  email: email,
  password: password
})