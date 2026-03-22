import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neon } from '@neondatabase/serverless';

function createPrismaClient() {
  const sql = neon(process.env.DATABASE_URL!);
  const adapter = new PrismaNeon(sql);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ── Retry helper ─────────────────────────────────────────────────────────────
// Wraps a Prisma call and retries once on transient connection errors.

const TRANSIENT_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2010']);

export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    const msg  = (err as { message?: string }).message ?? '';
    const isTransient =
      (code && TRANSIENT_CODES.has(code)) ||
      msg.includes('Connection reset') ||
      msg.includes('ECONNRESET') ||
      msg.includes('connect ECONNREFUSED');

    if (!isTransient) throw err;

    // Retry once — Neon HTTP driver reconnects automatically
    return fn();
  }
}
