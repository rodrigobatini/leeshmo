import type { OnboardingSelections } from "@/lib/onboarding-store";

/** Labels dos IDs do StepInsightsReview (Next) — mesmos titulos do Lovable onde aplicavel */
export const TREND_ID_TO_LABEL: Record<string, string> = {
  "trend-story": "Videos curtos com storytelling",
  "trend-carousel": "Conteudo educativo em carrossel",
  "trend-bastidores": "Bastidores e transparencia",
};

export const STRATEGY_ID_TO_TITLE: Record<string, string> = {
  "strat-funil": "Funil de conteudo",
  "strat-pilares": "Pilares de conteudo",
  "strat-repurpose": "Repurposing machine",
};

export const STRATEGY_ID_TO_META: Record<string, { emoji: string; desc: string }> = {
  "strat-funil": { emoji: "🎯", desc: "Topo → Meio → Fundo com CTAs progressivos" },
  "strat-pilares": { emoji: "📅", desc: "3-5 temas fixos com rotacao semanal" },
  "strat-repurpose": { emoji: "🔄", desc: "1 conteudo longo → 8+ micro-conteudos" },
};

export function strategyDisplayTitle(idOrTitle: string): string {
  return STRATEGY_ID_TO_TITLE[idOrTitle] ?? idOrTitle;
}

/** Compat: valores salvos pelo export Lovable (titulo legivel) */
const STRATEGY_TITLE_TO_META: Record<string, { emoji: string; desc: string }> = {
  "Funil de conteudo": STRATEGY_ID_TO_META["strat-funil"],
  "Funil de conteúdo": STRATEGY_ID_TO_META["strat-funil"],
  "Pilares de conteudo": STRATEGY_ID_TO_META["strat-pilares"],
  "Pilares de conteúdo": STRATEGY_ID_TO_META["strat-pilares"],
  "Repurposing machine": STRATEGY_ID_TO_META["strat-repurpose"],
  "Collab & Co-criação": { emoji: "🤝", desc: "Parcerias estrategicas com criadores" },
};

export function trendLabel(idOrTitle: string): string {
  return TREND_ID_TO_LABEL[idOrTitle] ?? idOrTitle;
}

export function strategyMeta(idOrTitle: string): { emoji: string; desc: string } | null {
  return STRATEGY_ID_TO_META[idOrTitle] ?? STRATEGY_TITLE_TO_META[idOrTitle] ?? null;
}

/** Detalhes extras para cards de persona (Lovable); fallback = dados gerados */
export const personaDetails: Record<string, { avatar: string; age: string; pain: string; channels: string[] }> = {
  "Ana Empreendedora": { avatar: "👩‍💼", age: "28-35", pain: "Sem tempo para criar conteudo", channels: ["Instagram", "LinkedIn"] },
  "Carlos Iniciante": { avatar: "👨‍💻", age: "22-30", pain: "Nao sabe por onde comecar", channels: ["YouTube", "TikTok"] },
  "Marina Gestora": { avatar: "👩‍🏫", age: "32-45", pain: "Precisa provar ROI", channels: ["LinkedIn", "E-mail"] },
};

export function generatePosts(data: OnboardingSelections) {
  const channelColors: Record<string, string> = {
    Instagram: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300",
    LinkedIn: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
    TikTok: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
    YouTube: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    "E-mail": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    Twitter: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300",
    Blog: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  };
  const days = ["Hoje", "Amanha", "Qua", "Qui", "Sex"];
  const painHint =
    data.generatedPersonas?.[0]?.pain ||
    (data.selectedPersonas[0] ? personaDetails[data.selectedPersonas[0]]?.pain : undefined) ||
    "dores do publico";

  const templates = [
    (ch: string) => ({ title: `5 dicas para ${data.businessName || "seu negocio"}`, type: "Carrossel", channel: ch }),
    (ch: string) => ({ title: `Como resolver "${painHint}"`, type: "Artigo", channel: ch }),
    (ch: string) => ({ title: `Bastidores: como funciona a ${data.businessName || "empresa"}`, type: "Video curto", channel: ch }),
    (ch: string) => ({ title: `Newsletter semanal: tendencias do nicho`, type: "Newsletter", channel: ch }),
    (ch: string) => ({ title: `Guia rapido para ${data.audience[0] || "seu publico"}`, type: "Post", channel: ch }),
  ];

  const activeChannels = data.channels.length > 0 ? data.channels : ["Instagram"];
  return templates.slice(0, 5).map((tpl, i) => {
    const ch = activeChannels[i % activeChannels.length];
    const post = tpl(ch);
    return { ...post, date: days[i], color: channelColors[ch] || "bg-muted text-muted-foreground" };
  });
}
