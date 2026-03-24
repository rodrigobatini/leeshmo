export async function POST(request: Request) {
  const body = await request.json();

  console.info("[portal-metric]", {
    event: body?.event ?? "unknown",
    payload: body?.payload ?? {},
    at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
