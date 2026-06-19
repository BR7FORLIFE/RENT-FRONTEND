import * as z from "zod";

//register
export const registerSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.email(),
    cellphone: z.string(),
    fullname: z.string(),
    identificationNumber: z.string(),
    identificationType: z.enum(["CC", "CE", "TI", "PPT", "PASSPORT"]),
});

export const RegisterResponseSchema = z.object({
    userId: z.uuid(),
    message: z.string(),
});

export type RegisterType = z.infer<typeof registerSchema>;
export type RegisterResponseType = z.infer<typeof RegisterResponseSchema>;

//login
export const LoginSchema = z.object({
    email: z.email(),
    password: z.email(),
});

export type LoginType = z.infer<typeof LoginSchema>;
