import { auth } from "@clerk/nextjs/server";
import { ensureSchema, getDb } from "@/lib/db";

type CalendarInput = {
  title: string;
  channel: string;
  publishDate: string;
};

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as CalendarInput;
  const sql = getDb();

  if (!sql) {
    return Response.json({ persisted: false, reason: "DATABASE_URL is missing" });
  }

  await ensureSchema();

  await sql`
    INSERT INTO calendar_items (id, user_id, title, channel, status, publish_date)
    VALUES (${crypto.randomUUID()}, ${userId}, ${body.title}, ${body.channel}, ${"Planned"}, ${body.publishDate})
  `;

  return Response.json({ persisted: true });
}

