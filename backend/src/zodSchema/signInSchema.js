import {z} from 'zod'
import { usernameValidation, email, password } from './fieldValidation.js';


export const signInSchema = z.object({
    username: usernameValidation.or(email),
    password: password
})
