import 'server-only';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@/generated/prisma/client';

// Turso when TURSO_DATABASE_URL is set, otherwise the local SQLite file dev.db.
function createClient(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url && process.env.VERCEL) {
    throw new Error('TURSO_DATABASE_URL is not set — Vercel cannot use the local dev.db file');
  }
  const adapter = new PrismaLibSql(
    url
      ? { url, authToken: process.env.TURSO_AUTH_TOKEN }
      : { url: 'file:./dev.db' },
  );
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
