import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ADMIN", "ANALYST", "VIEWER"]>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    role: "ADMIN" | "ANALYST" | "VIEWER";
    password: string;
}, {
    name: string;
    email: string;
    password: string;
    role?: "ADMIN" | "ANALYST" | "VIEWER" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
