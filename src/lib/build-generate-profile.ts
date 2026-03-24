import type { OnboardingState, PresenceChannel } from "@/lib/onboarding";
import { CHANNEL_NONE, OTHER_MONETIZATION, OTHER_OPTION } from "@/lib/onboarding-constants";
import { strategyDisplayTitle, trendLabel } from "@/lib/lovable-dashboard-data";
import type { OnboardingSelections } from "@/lib/onboarding-store";

const CHANNEL_LABEL_TO_PRESENCE: Record<string, PresenceChannel> = {
  Instagram: "instagram",
  TikTok: "instagram",
  YouTube: "youtube",
  LinkedIn: "linkedin",
  "E-mail": "newsletter",
  Blog: "website",
};

const MONET_LABELS: Record<string, string> = {
  "produto-fisico": "Produto fisico",
  "produto-digital": "Produto digital",
  servico: "Servico / Consultoria",
  assinatura: "Assinatura / SaaS",
  ads: "Ads / Anuncios",
  afiliados: "Afiliados",
  membros: "Membros / comunidade",
};

const VISUAL_TAG_LABELS: Record<string, string> = {
  limpo: "Visual limpo/minimal",
  ugc: "UGC/autentico",
  premium: "Premium",
  bold: "Bold e colorido",
};

function channelsToPresence(channels: string[]): PresenceChannel[] {
  if (channels.includes(CHANNEL_NONE)) return [];
  const set = new Set<PresenceChannel>();
  for (const c of channels) {
    const p = CHANNEL_LABEL_TO_PRESENCE[c];
    if (p) set.add(p);
  }
  return Array.from(set);
}

function formatWithOtherLabel(selected: string[], otherKey: string, otherText: string): string {
  const base = selected.filter((s) => s !== otherKey);
  const extra = selected.includes(otherKey) && otherText.trim() ? otherText.trim() : "";
  if (base.length && extra) return [...base, extra].join(", ");
  if (base.length) return base.join(", ");
  return extra;
}

function formatVerticalSegments(segments: string[], other: string): string {
  const base = segments.filter((s) => s !== OTHER_OPTION);
  const extra = segments.includes(OTHER_OPTION) && other.trim() ? other.trim() : "";
  if (base.length && extra) return [...base, extra].join(", ");
  if (base.length) return base.join(", ");
  return extra;
}

function formatVisualTags(ids: string[]): string {
  return ids.map((id) => VISUAL_TAG_LABELS[id] ?? id).join("; ");
}

function formatOffer(monetization: string[], otherText: string): string {
  const parts: string[] = [];
  for (const m of monetization) {
    if (m === OTHER_MONETIZATION) {
      if (otherText.trim()) parts.push(`Outro: ${otherText.trim()}`);
    } else {
      parts.push(MONET_LABELS[m] ?? m);
    }
  }
  return parts.join(", ") || "servico";
}

export type ProfileOverrides = Partial<
  Pick<OnboardingSelections, "goals" | "goalsOther" | "selectedTrends" | "selectedStrategies" | "selectedPersonas">
>;

/**
 * Monta o payload de /api/generate a partir do que ja esta salvo no onboarding (+ overrides opcionais).
 */
export function buildProfileFromOnboardingSelections(
  data: OnboardingSelections,
  overrides?: ProfileOverrides,
): Partial<OnboardingState> {
  const goals = overrides?.goals ?? data.goals;
  const goalsOther = overrides?.goalsOther ?? data.goalsOther ?? "";

  const nicheFallback =
    formatWithOtherLabel(data.businessTypes, OTHER_OPTION, data.businessTypesOther ?? "") ||
    formatWithOtherLabel(data.audience, OTHER_OPTION, data.audienceOther ?? "") ||
    "geral";
  const verticalSummary = formatVerticalSegments(data.verticalSegments ?? [], data.verticalOther ?? "");
  const nicheLine = data.nicheLine?.trim() ?? "";
  const niche = [nicheLine, verticalSummary].filter(Boolean).join(" · ") || nicheFallback;

  const audienceStr =
    formatWithOtherLabel(data.audience, OTHER_OPTION, data.audienceOther ?? "") ||
    data.businessDescription.slice(0, 120) ||
    "Publico em definicao";

  const offer = formatOffer(data.monetization, data.monetizationOther ?? "");
  const goalsSummary = formatWithOtherLabel(goals, OTHER_OPTION, goalsOther);
  const goalsForInference = `${goals.join(" ")} ${goalsOther}`.toLowerCase();

  const trends = overrides?.selectedTrends ?? data.selectedTrends ?? [];
  const strategies = overrides?.selectedStrategies ?? data.selectedStrategies ?? [];
  const personasFocus = overrides?.selectedPersonas ?? data.selectedPersonas ?? [];

  const focusParts: string[] = [];
  if (trends.length) {
    focusParts.push(`Tendencias em foco: ${trends.map((id) => trendLabel(id)).join(", ")}`);
  }
  if (strategies.length) {
    focusParts.push(`Modelos de estrategia: ${strategies.map((id) => strategyDisplayTitle(id)).join(", ")}`);
  }
  if (personasFocus.length) {
    focusParts.push(`Personas prioritarias: ${personasFocus.join(", ")}`);
  }

  const constraintParts = [
    goalsSummary ? `Objetivos: ${goalsSummary}` : "",
    ...focusParts,
    (data.avoidHint ?? "").trim() ? `Evitar em mensagens e criativos: ${data.avoidHint!.trim()}` : "",
    (data.referenceHint ?? "").trim() ? `Referencias ou inspiracao: ${data.referenceHint!.trim()}` : "",
    data.visualStyleTags?.length ? `Estilo visual sugerido: ${formatVisualTags(data.visualStyleTags)}` : "",
  ].filter(Boolean);

  return {
    brandName: data.businessName,
    niche,
    offer,
    valueProp:
      [data.businessDescription, nicheLine, goalsSummary].filter(Boolean).join(" | ") || "Estrategia de conteudo personalizada",
    businessStage: "building",
    audience: audienceStr,
    constraints: constraintParts.length ? constraintParts.join(". ") : "",
    mainGoal: goalsForInference.includes("vendas") ? "conversion" : "leads",
    revenueModel: data.monetization.some((m) => m === "assinatura")
      ? "subscription"
      : data.monetization.some((m) => m === "produto-digital")
        ? "infoproduct"
        : "service",
    funnelMaturity: "basic",
    activePresence: channelsToPresence(data.channels),
    selectedPath: "lead-path",
  };
}
