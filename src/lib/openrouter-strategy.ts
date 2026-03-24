import type { OnboardingState } from "@/lib/onboarding";

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

export type LlmStrategyPayload = {
  personas: Persona[];
  drafts: Draft[];
  paths: string[];
};

function getApiKey(): string | undefined {
  const k = process.env.OPENROUTER_API_KEY?.trim();
  return k || undefined;
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(getApiKey());
}

function defaultModel(): string {
  return process.env.OPENROUTER_MODEL?.trim() || "openai/gpt-4o-mini";
}

function extractJsonObject(raw: string): unknown {
  const t = raw.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonStr = fence ? fence[1].trim() : t;
  return JSON.parse(jsonStr) as unknown;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalizePayload(data: unknown): LlmStrategyPayload | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const personasRaw = o.personas;
  const draftsRaw = o.drafts;
  const pathsRaw = o.paths;
  if (!Array.isArray(personasRaw) || !Array.isArray(draftsRaw) || !Array.isArray(pathsRaw)) return null;

  const personas: Persona[] = personasRaw
    .slice(0, 8)
    .map((p) => {
      const x = p && typeof p === "object" ? (p as Record<string, unknown>) : {};
      return {
        name: asString(x.name).slice(0, 120),
        objective: asString(x.objective).slice(0, 500),
        pain: asString(x.pain).slice(0, 500),
        tone: asString(x.tone).slice(0, 300),
      };
    })
    .filter((p) => p.name.length > 0);

  const drafts: Draft[] = draftsRaw
    .slice(0, 6)
    .map((d) => {
      const x = d && typeof d === "object" ? (d as Record<string, unknown>) : {};
      return {
        title: asString(x.title).slice(0, 200),
        channel: asString(x.channel).slice(0, 80),
        cta: asString(x.cta).slice(0, 200),
        body: asString(x.body).slice(0, 4000),
      };
    })
    .filter((d) => d.title.length > 0);

  const paths = pathsRaw
    .map((s) => (typeof s === "string" ? s.slice(0, 500) : ""))
    .filter(Boolean);

  if (personas.length < 2 || drafts.length < 1 || paths.length < 1) return null;

  return { personas, drafts, paths };
}

/**
 * Chama OpenRouter e devolve personas, drafts e paths. Retorna null se nao configurado, erro ou JSON invalido.
 */
export async function generateStrategyWithOpenRouter(profile: OnboardingState): Promise<LlmStrategyPayload | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const model = defaultModel();
  const system = `Voce e estrategista de conteudo para pequenos negocios no Brasil.
Responda APENAS com um unico objeto JSON valido (sem markdown, sem texto antes ou depois), com esta estrutura exata:
{
  "personas": [ { "name": string, "objective": string, "pain": string, "tone": string } ],
  "drafts": [ { "title": string, "channel": string, "cta": string, "body": string } ],
  "paths": [ string, string, string ]
}
Regras:
- Use portugues do Brasil (sem acentos especiais opcionais: escreva sem cedilha se preferir ASCII).
- Gere exatamente 4 personas distintas e 2 rascunhos de conteudo alinhados ao perfil.
- "paths": tres linhas curtas com prioridades para os proximos 30 dias.
- Canais de draft devem ser realistas (ex.: Instagram, LinkedIn, Newsletter, YouTube, TikTok).
- Respeite restricoes e nicho do usuario quando fornecidos.`;

  const user = JSON.stringify({
    brandName: profile.brandName,
    niche: profile.niche,
    offer: profile.offer,
    valueProp: profile.valueProp,
    audience: profile.audience,
    constraints: profile.constraints,
    mainGoal: profile.mainGoal,
    revenueModel: profile.revenueModel,
    activePresence: profile.activePresence,
    selectedPath: profile.selectedPath,
  });

  const body = {
    model,
    temperature: 0.65,
    max_tokens: 4096,
    messages: [
      { role: "system" as const, content: system },
      { role: "user" as const, content: user },
    ],
  };

  const referer = process.env.OPENROUTER_HTTP_REFERER?.trim() || "https://leeshmo.app";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": "Leeshmo",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90_000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("[openrouter] HTTP", res.status, errText.slice(0, 500));
      return null;
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      console.error("[openrouter] empty content");
      return null;
    }

    let parsed: unknown;
    try {
      parsed = extractJsonObject(content);
    } catch (e) {
      console.error("[openrouter] JSON parse", e);
      return null;
    }

    return normalizePayload(parsed);
  } catch (e) {
    console.error("[openrouter] fetch", e);
    return null;
  }
}
