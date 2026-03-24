import { auth } from "@clerk/nextjs/server";
import { getDailyGenerationCount, getDailyGenerationLimit, incrementDailyGeneration, utcTodayBucket } from "@/lib/ai-quota";
import { ensureSchema, getDb } from "@/lib/db";
import { inferPathRecommendations, pathLabel, type OnboardingState } from "@/lib/onboarding";
import { generateStrategyWithOpenRouter } from "@/lib/openrouter-strategy";

type Persona = {
  name: string;
  objective: string;
  pain: string;
  tone: string;
};

type Draft = {
  title: string;
  channel: string;
  cta: string;
  body: string;
};

function fallbackProfile(input: Partial<OnboardingState>): OnboardingState {
  return {
    brandName: input.brandName ?? "",
    niche: input.niche ?? "",
    offer: input.offer ?? "",
    valueProp: input.valueProp ?? "",
    businessStage: input.businessStage ?? "",
    audience: input.audience ?? "",
    constraints: input.constraints ?? "",
    mainGoal: input.mainGoal ?? "",
    revenueModel: input.revenueModel ?? "",
    funnelMaturity: input.funnelMaturity ?? "",
    activePresence: Array.isArray(input.activePresence) ? input.activePresence : [],
    selectedPath: input.selectedPath ?? "",
  };
}

function createDrafts(profile: OnboardingState): Draft[] {
  const channel = profile.activePresence[0] === "youtube" ? "YouTube" : "LinkedIn";

  return [
    {
      title: `Como ${profile.brandName || "sua marca"} evita travas no crescimento`,
      channel,
      cta: "Comente 'MAPA' para receber o framework",
      body: `Se voce atua em ${profile.niche || "seu nicho"}, este roteiro te ajuda a estruturar conteudo com foco em resultado sem perder consistencia.`,
    },
    {
      title: "Checklist de posicionamento para as proximas 2 semanas",
      channel: "Newsletter",
      cta: "Responda este email para receber versao editavel",
      body: `Plano pratico para comunicar ${profile.valueProp || "sua proposta de valor"} e reduzir ruido no topo do funil.`,
    },
  ];
}

function createPersonas(profile: OnboardingState): Persona[] {
  const brand = profile.brandName?.trim() || "sua marca";
  return [
    {
      name: "Ana, sempre sem tempo",
      objective: "Consumir algo util em poucos minutos entre uma reuniao e outra",
      pain: "Agenda lotada; nao sobra energia para conteudo longo, cursos ou textos densos",
      tone: "Direto, sem enrolacao, formato escaneavel",
    },
    {
      name: "Bruno, pe no freio no investimento",
      objective: "Testar antes de gastar com ferramentas, ads ou producao pesada",
      pain: "Nao quer investir dinheiro (ou tempo caro) ate ver prova de que funciona no nicho",
      tone: "Cetico no bom sentido; pede exemplos, numeros e passos gratis",
    },
    {
      name: "Carla, ainda aprendendo o tema",
      objective: `Entender o basico sobre ${profile.niche || "o assunto"} sem se sentir perdida`,
      pain: "Sente que falta informacao clara; muito jargao e pouco passo a passo honesto",
      tone: "Didatico, acolhedor, sem assumir conhecimento previo",
    },
    {
      name: "Diego, cansado de promessa vazia",
      objective: `Resolver um problema concreto relacionado a ${brand}, nao ver mais um pitch generico`,
      pain: "Ja viu muito conteudo repetido; quer aplicacao real, nao motivacao vazia",
      tone: "Pragmatico; valoriza bastidores, erros e o que realmente funcionou",
    },
  ];
}

function buildRecommendations(profile: OnboardingState) {
  const recommended = inferPathRecommendations(profile);
  return recommended.map((id, index) => ({
    id,
    title: pathLabel(id),
    reason:
      index === 0
        ? "Maior aderencia ao momento atual e objetivo principal informado."
        : "Boa alternativa para equilibrar aquisicao e conversao.",
  }));
}

function buildMockOutput(profile: OnboardingState) {
  const recommended = inferPathRecommendations(profile);
  const selected = profile.selectedPath ? pathLabel(profile.selectedPath) : pathLabel(recommended[0]);

  return {
    personas: createPersonas(profile),
    drafts: createDrafts(profile),
    paths: [
      `${selected}: prioridade sugerida para os proximos 30 dias`,
      "Ritmo semanal: 2 pecas de valor + 1 peca de conversao",
      "Loop de melhoria: revisar dados a cada 14 dias",
    ],
    recommendations: buildRecommendations(profile),
  };
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { profile: Partial<OnboardingState> };
    const profile = fallbackProfile(body.profile ?? {});
    const sql = getDb();
    const bucket = utcTodayBucket();

    if (sql) {
      try {
        await ensureSchema();
        const count = await getDailyGenerationCount(sql, userId, bucket);
        const limit = getDailyGenerationLimit();
        if (count >= limit) {
          return Response.json(
            { error: "Limite diario de geracoes atingido. Tente amanha.", limit, used: count },
            { status: 429, headers: { "Retry-After": "86400" } },
          );
        }
      } catch (quotaErr) {
        console.error("[api/generate] quota precheck", quotaErr);
      }
    }

    const llm = await generateStrategyWithOpenRouter(profile);
    const output = llm
      ? {
          personas: llm.personas,
          drafts: llm.drafts,
          paths: llm.paths,
          recommendations: buildRecommendations(profile),
        }
      : buildMockOutput(profile);
    const generationSource = llm ? ("openrouter" as const) : ("mock" as const);
    if (!llm) {
      console.warn("[api/generate] using mock output (OpenRouter missing, failed, or invalid JSON)");
    }

    let persisted = false;

    if (sql) {
      try {
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

        const notifId = crypto.randomUUID();
        await sql`
          INSERT INTO notifications (id, user_id, title, body)
          VALUES (${notifId}, ${userId}, ${"Estrategia gerada"}, ${"Personas e rascunhos foram salvos no seu workspace."})
        `;

        persisted = true;
      } catch (persistErr) {
        console.error("[api/generate] persist failed (returning mock output anyway)", persistErr);
      }

      try {
        await incrementDailyGeneration(sql, userId, bucket);
      } catch (incErr) {
        console.error("[api/generate] increment quota failed", incErr);
      }
    }

    return Response.json({
      ...output,
      persisted,
      storage: sql ? "neon" : "mock-only",
      generationSource,
    });
  } catch (err) {
    console.error("[api/generate]", err);
    return Response.json({ error: "Failed to generate strategy" }, { status: 500 });
  }
}
