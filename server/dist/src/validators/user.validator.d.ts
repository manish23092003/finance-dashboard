import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["ADMIN", "ANALYST", "VIEWER"]>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    role: "ADMIN" | "ANALYST" | "VIEWER";
    password: string;
}, {
    name: string;
    email: string;
    role: "ADMIN" | "ANALYST" | "VIEWER";
    password: string;
}>;
export declare const changeRoleSchema: z.ZodObject<{
    role: z.ZodEnum<["ADMIN", "ANALYST", "VIEWER"]>;
}, "strip", z.ZodTypeAny, {
    role: "ADMIN" | "ANALYST" | "VIEWER";
}, {
    role: "ADMIN" | "ANALYST" | "VIEWER";
}>;
export declare const toggleStatusSchema: z.ZodObject<{
    isActive: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
}, {
    isActive: boolean;
}>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type ToggleStatusInput = z.infer<typeof toggleStatusSchema>;
