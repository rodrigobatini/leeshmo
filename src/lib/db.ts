import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export async function ensureSchema() {
  const sql = getDb();
  if (!sql) return false;

  await sql`
    CREATE TABLE IF NOT EXISTS onboarding_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS generated_personas (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      objective TEXT NOT NULL,
      pain TEXT NOT NULL,
      tone TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS content_drafts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      channel TEXT NOT NULL,
      cta TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS calendar_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      channel TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Planned',
      publish_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  return true;
}

