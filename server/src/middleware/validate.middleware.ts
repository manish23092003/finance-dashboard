import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

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
export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const fieldErrors = zodError.flatten().fieldErrors;

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: fieldErrors,
      });
      return;
    }

    // Replace with parsed/transformed data (e.g., trimmed strings, type coercions)
    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
};