// src/schemas/userSchemas.ts
import { z } from 'zod';
const authSchema = {
    Register: z.object({
        name: z.string({ message: 'Name is required' }),
        email: z.string({ message: 'email is required' }).email({
            message: 'The email address you entered is not valid.',
        }),
        password: z.string({ message: 'password is required' }).min(4, {
            message: 'Please enter a password that is at least 4 characters long.',
        }),
        bio: z.string({ message: 'Biography is required' }).min(10, {
            message: 'Biography must be at least 10 characters',
        }),
        avatar: z.object({
            public_id: z.string().min(1, { message: 'Public id is required' }),
            url: z.string().url().min(1, { message: 'url must be a valid URL' }),
        }),
        // imgUrl: z.string({
        //   message: "Please provide image url",
        // }),
    }),
    Login: z.object({
        email: z.string({ message: 'email is required' }).email({
            message: 'The email address you entered is not valid.',
        }),
        password: z.string({ message: 'password is required' }).min(4, {
            message: 'Please enter a password that is at least 4 characters long.',
        }),
    }),
};
// export const userRegistrationSchema = z.object({
//   fullName: z.string(),
//   email: z.string().email({
//     message: "The email address you entered is not valid.",
//   }),
//   password: z.string().min(8, {
//     message: "Please enter a password that is at least 8 characters long.",
//   }),
//   gender: z.enum(["male", "female"]),
//   imgUrl: z.string({
//     message: "Please provide image url",
//   }),
// });
// export const userLoginSchema = z.object({
//   email: z.string().email({
//     message: "The email address you entered is not valid.",
//   }),
//   password: z.string().min(8, {
//     message: "Please enter a password that is at least 8 characters long.",
//   }),
// });
// export const userUpdateSchema = z.object({
//   name: z.string(),
//   password: z.string().min(8, {
//     message: "Please enter a password that is at least 8 characters long.",
//   }),
//   imageUrl: z.string(),
// });
// export const userUpdateRoleSchema = z.object({
//   // role: z
//   //   .string({
//   //     required_error: 'Name is required',
//   //     invalid_type_error: 'Name must be a string',
//   //   })
//   //   .min(2, {
//   //     message: 'Role must be at least 2 characters',
//   //   }),
//   role: z.enum(["user", "admin"]),
// });
export default authSchema;
