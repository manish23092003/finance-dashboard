"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load .env before anything else
dotenv_1.default.config();
/**
 * Validated environment configuration.
 * App will crash immediately if required env vars are missing or malformed.
 */
const envSchema = zod_1.z.object({
    PORT: zod_1.z
        .string()
        .default('5000')
        .transform(Number)
        .pipe(zod_1.z.number().int().positive()),
    JWT_SECRET: zod_1.z
        .string()
        .min(32, 'JWT_SECRET must be at least 32 characters for security'),
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map