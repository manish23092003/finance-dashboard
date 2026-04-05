"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/**
 * Singleton PrismaClient instance.
 * Ensures only one connection pool exists across the application lifecycle,
 * preventing connection exhaustion during hot-reloads in development.
 */
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ??
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'warn', 'error']
            : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
exports.default = prisma;
//# sourceMappingURL=prisma.js.map