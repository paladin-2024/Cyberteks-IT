import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ── Reconnect helper ─────────────────────────────────────────────────────────
// MongoDB Atlas (especially free tier) drops idle connections after ~60s.
// When Prisma tries to reuse a stale connection it throws P2010 / ECONNRESET.
// This wrapper retries once after a forced reconnect on those transient errors.

const TRANSIENT_CODES = new Set(['P2010', 'P1001', 'P1002', 'P1008', 'P1017']);

export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    const code = (err as { code?: string }).code;
    const msg  = (err as { message?: string }).message ?? '';
    const isConnectionError =
      (code && TRANSIENT_CODES.has(code)) ||
      msg.includes('Connection reset') ||
      msg.includes('ECONNRESET') ||
      msg.includes('connect ECONNREFUSED');

    if (!isConnectionError) throw err;

    // Force Prisma to drop all connections and reconnect
    try { await prisma.$disconnect(); } catch { /* ignore */ }
    await prisma.$connect();

    return fn(); // one retry
  }
}
