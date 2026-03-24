import { auth } from "@clerk/nextjs/server";
import { getDailyGenerationCount, getDailyGenerationLimit, nextUtcResetIso, utcTodayBucket } from "@/lib/ai-quota";
import { ensureSchema, getDb } from "@/lib/db";

/**
 * GET — uso diário de gerações (para UX: mostrar limites antes de chamar a IA).
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = getDailyGenerationLimit();
  const bucket = utcTodayBucket();
  const resetAt = nextUtcResetIso();
  const sql = getDb();

  if (!sql) {
    return Response.json({
      limit,
      used: 0,
      remaining: limit,
      tracking: false as const,
      resetAt,
    });
  }

  try {
    await ensureSchema();
    const used = await getDailyGenerationCount(sql, userId, bucket);
    const remaining = Math.max(0, limit - used);
    return Response.json({
      limit,
      used,
      remaining,
      tracking: true as const,
      resetAt,
    });
  } catch (err) {
    console.error("[api/generate/quota]", err);
    return Response.json({
      limit,
      used: 0,
      remaining: limit,
      tracking: false as const,
      resetAt,
    });
  }
}
