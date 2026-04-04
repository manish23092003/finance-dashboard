import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env before anything else
dotenv.config();

/**
 * Validated environment configuration.
 * App will crash immediately if required env vars are missing or malformed.
 */
const envSchema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform(Number)
    .pipe(z.number().int().positive()),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsed.data;
