import { z } from 'zod';
export declare const createRecordSchema: z.ZodObject<{
    amount: z.ZodNumber;
    type: z.ZodEnum<["INCOME", "EXPENSE"]>;
    category: z.ZodString;
    date: z.ZodEffects<z.ZodString, string, string>;
    notes: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: "INCOME" | "EXPENSE";
    date: string;
    amount: number;
    category: string;
    notes: string;
}, {
    type: "INCOME" | "EXPENSE";
    date: string;
    amount: number;
    category: string;
    notes?: string | undefined;
}>;
export declare const updateRecordSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<["INCOME", "EXPENSE"]>>;
    category: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "INCOME" | "EXPENSE" | undefined;
    date?: string | undefined;
    amount?: number | undefined;
    category?: string | undefined;
    notes?: string | undefined;
}, {
    type?: "INCOME" | "EXPENSE" | undefined;
    date?: string | undefined;
    amount?: number | undefined;
    category?: string | undefined;
    notes?: string | undefined;
}>;
export declare const recordQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
    dateFrom: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    dateTo: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    category: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["INCOME", "EXPENSE"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    type?: "INCOME" | "EXPENSE" | undefined;
    category?: string | undefined;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
}, {
    type?: "INCOME" | "EXPENSE" | undefined;
    category?: string | undefined;
    page?: string | undefined;
    limit?: string | undefined;
    dateFrom?: string | undefined;
    dateTo?: string | undefined;
}>;
export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type RecordQueryInput = z.infer<typeof recordQuerySchema>;
