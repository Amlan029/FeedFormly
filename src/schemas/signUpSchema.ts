import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(3, "Username must be atleast 2 charecters")
    .max(20, "Username must be no more than 20 charecters")
    .regex(/^[a-zA-Z0-9]+$/,"Username must not contain special charecters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email("Invalid email address"),
    password: z.string().min(6,"password must be atleast 6 charecters")

})