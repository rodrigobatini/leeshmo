/** Snapshot do fluxo de onboarding (passo + formularios) para sobreviver a refresh. Chave por usuario (Clerk). */

function storageKey(userId: string) {
  return `leeshmo_onboarding_progress_v1_${userId}`;
}

export type GenerateResponseSnapshot = {
  personas: Array<{ name: string; objective: string; pain: string; tone: string }>;
  drafts: Array<{ title: string; channel: string; cta: string; body: string }>;
  paths: string[];
};

export type OnboardingProgressSnapshot = {
  v: 1;
  /** 2 = fluxo com passo "Nicho e voz" (passos 9/10 geracao/insights). Ausente = legado. */
  flowVersion?: 2;
  step: number;
  businessInfo: { name: string; description: string; website: string };
  businessTypes: string[];
  audience: string[];
  monetization: string[];
  channels: string[];
  goals: string[];
  frequency: string;
  businessTypesOther: string;
  audienceOther: string;
  monetizationOther: string;
  goalsOther: string;
  /** Passo extra: nicho em uma frase, area, referencias, limites de mensagem, estilo visual */
  nicheLine?: string;
  verticalSegments?: string[];
  verticalOther?: string;
  referenceHint?: string;
  avoidHint?: string;
  visualStyleTags?: string[];
  generated: GenerateResponseSnapshot | null;
  selectedTrends: string[];
  selectedStrategies: string[];
  selectedPersonas: string[];
};

export function loadOnboardingProgress(userId: string | null | undefined): OnboardingProgressSnapshot | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OnboardingProgressSnapshot;
    if (parsed.v !== 1) return null;
    if (typeof parsed.step !== "number" || parsed.step < 0 || parsed.step > 10) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveOnboardingProgress(userId: string | null | undefined, data: OnboardingProgressSnapshot): void {
  if (!userId) return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(data));
  } catch {
    /* quota */
  }
}

export function clearOnboardingProgress(userId: string | null | undefined): void {
  if (!userId) return;
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    /* ignore */
  }
}
