import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Generic Zod Validation Middleware.
 * Validates the specified request property (body, query, or params)
 * against a Zod schema. On success, replaces the property with the
 * parsed/transformed data. On failure, returns 400 with field-level errors.
 *
 * @param schema - A Zod schema to validate against
 * @param source - Which part of the request to validate (default: 'body')
 *
 * @example
 *   router.post('/', validate(createRecordSchema), controller.create);
 *   router.get('/', validate(recordQuerySchema, 'query'), controller.getAll);
 */
export declare const validate: (schema: ZodSchema, source?: "body" | "query" | "params") => (req: Request, res: Response, next: NextFunction) => void;
