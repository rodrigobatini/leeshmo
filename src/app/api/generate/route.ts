import { auth } from "@clerk/nextjs/server";
import { ensureSchema, getDb } from "@/lib/db";

type OnboardingState = {
  brandName: string;
  niche: string;
  offer: string;
  valueProp: string;
  channels: string;
  audience: string;
  goals: string;
  constraints: string;
  revenueModel: string;
  funnel: string;
};

function buildMockOutput(data: OnboardingState) {
  return {
    personas: [
      {
        name: "Operador de crescimento",
        objective: `Escalar ${data.brandName || "a marca"} com previsibilidade`,
        pain: "Falta de consistencia editorial e baixa taxa de conversao",
        tone: "Objetivo, pratico e orientado a resultados",
      },
      {
        name: "Fundador generalista",
        objective: "Validar canal e oferta sem equipe robusta",
        pain: "Pouco tempo e dificuldade em priorizar conteudo",
        tone: "Didatico e estrategico",
      },
    ],
    drafts: [
      {
        title: "3 sinais de que seu calendario esta sabotando o crescimento",
        channel: "LinkedIn",
        cta: "Comente 'PLANO' para receber o template",
        body: `Se voce vende ${data.offer || "servicos"} e ainda improvisa pauta semanal, o custo oculto e alto. Aqui estao 3 sinais que mostram por que sua operacao trava.`,
      },
      {
        title: "Roteiro curto: posicionamento em 60 segundos",
        channel: "Reels",
        cta: "Salve para revisar antes de gravar",
        body: `Framework rapido para comunicar ${data.valueProp || "sua proposta de valor"} sem soar generico.`,
      },
    ],
    paths: [
      "Caminho A: autoridade com conteudo educacional",
      "Caminho B: captacao com oferta de entrada",
      "Caminho C: conversao com provas sociais e casos",
    ],
  };
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { profile: OnboardingState };
  const profile = body.profile;
  const output = buildMockOutput(profile);

  const sql = getDb();
  let persisted = false;

  if (sql) {
    await ensureSchema();
    const sessionId = crypto.randomUUID();
    await sql`
      INSERT INTO onboarding_sessions (id, user_id, payload)
      VALUES (${sessionId}, ${userId}, ${JSON.stringify(profile)}::jsonb)
    `;

    for (const persona of output.personas) {
      await sql`
        INSERT INTO generated_personas (id, user_id, name, objective, pain, tone)
        VALUES (${crypto.randomUUID()}, ${userId}, ${persona.name}, ${persona.objective}, ${persona.pain}, ${persona.tone})
      `;
    }

    for (const draft of output.drafts) {
      await sql`
        INSERT INTO content_drafts (id, user_id, title, channel, cta, body)
        VALUES (${crypto.randomUUID()}, ${userId}, ${draft.title}, ${draft.channel}, ${draft.cta}, ${draft.body})
      `;
    }

    persisted = true;
  }

  return Response.json({
    ...output,
    persisted,
    storage: sql ? "neon" : "mock-only",
  });
}

