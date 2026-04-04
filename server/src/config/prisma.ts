import { PrismaClient } from '../generated/prisma';

/**
 * Singleton PrismaClient instance.
 * Ensures only one connection pool exists across the application lifecycle,
 * preventing connection exhaustion during hot-reloads in development.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
