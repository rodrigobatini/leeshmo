import { auth } from "@clerk/nextjs/server";
import { ensureSchema, getDb } from "@/lib/db";

export type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sql = getDb();
  if (!sql) {
    return Response.json({ items: [], unreadCount: 0 });
  }

  try {
    await ensureSchema();
    const rows = await sql`
      SELECT id, title, body, read_at, created_at
      FROM notifications
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `;
    const list = rows as NotificationRow[];
    const unreadCount = list.filter((r) => !r.read_at).length;
    return Response.json({ items: list, unreadCount });
  } catch (err) {
    console.error("[api/notifications] GET", err);
    return Response.json({ items: [], unreadCount: 0 });
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { ids?: string[]; markAllRead?: boolean };
  const sql = getDb();
  if (!sql) {
    return Response.json({ ok: true });
  }

  try {
    await ensureSchema();
    if (body.markAllRead) {
      await sql`
        UPDATE notifications
        SET read_at = NOW()
        WHERE user_id = ${userId} AND read_at IS NULL
      `;
    } else if (body.ids?.length) {
      for (const id of body.ids) {
        await sql`
          UPDATE notifications
          SET read_at = NOW()
          WHERE id = ${id} AND user_id = ${userId}
        `;
      }
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[api/notifications] PATCH", err);
    return Response.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
