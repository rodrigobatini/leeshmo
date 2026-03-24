import { getDb } from "@/lib/db";

type Sql = NonNullable<ReturnType<typeof getDb>>;

/** Resposta de GET /api/generate/quota (uso diario para UX). */
export type AiQuotaInfo = {
  limit: number;
  used: number;
  remaining: number;
  tracking: boolean;
  resetAt: string;
};

export function getDailyGenerationLimit(): number {
  const raw = process.env.AI_DAILY_GENERATION_LIMIT;
  const n = raw ? Number.parseInt(raw, 10) : 50;
  return Number.isFinite(n) && n > 0 ? n : 50;
}

/** Data UTC YYYY-MM-DD para bucket diario. */
export function utcTodayBucket(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Proximo reset UTC (meia-noite UTC) para copy de "volta amanha". */
export function nextUtcResetIso(): string {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0));
  return next.toISOString();
}

export async function getDailyGenerationCount(sql: Sql, userId: string, bucketDate: string): Promise<number> {
  const rows = await sql`
    SELECT generation_count
    FROM ai_usage_daily
    WHERE user_id = ${userId} AND bucket_date = ${bucketDate}::date
  `;
  const row = rows[0] as { generation_count: number } | undefined;
  return row?.generation_count ?? 0;
}

export async function incrementDailyGeneration(sql: Sql, userId: string, bucketDate: string): Promise<void> {
  await sql`
    INSERT INTO ai_usage_daily (user_id, bucket_date, generation_count)
    VALUES (${userId}, ${bucketDate}::date, 1)
    ON CONFLICT (user_id, bucket_date)
    DO UPDATE SET generation_count = ai_usage_daily.generation_count + 1
  `;
}
