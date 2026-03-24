export interface OnboardingSelections {
  businessName: string;
  businessDescription: string;
  businessTypes: string[];
  /** Texto quando marca "Outro" em tipo de negocio */
  businessTypesOther?: string;
  audience: string[];
  audienceOther?: string;
  monetization: string[];
  monetizationOther?: string;
  channels: string[];
  goals: string[];
  goalsOther?: string;
  frequency: string;
  /** Nicho em uma frase + area + voz (para IA); opcional em dados antigos */
  nicheLine?: string;
  verticalSegments?: string[];
  verticalOther?: string;
  referenceHint?: string;
  avoidHint?: string;
  visualStyleTags?: string[];
  selectedTrends: string[];
  selectedStrategies: string[];
  selectedPersonas: string[];
  generatedPersonas: Array<{ name: string; objective: string; pain: string; tone: string }>;
  generatedDrafts: Array<{ title: string; channel: string; cta: string; body: string }>;
  generatedPaths: string[];
}

/** Unica chave local para dados completos do onboarding (alinhada com Insights, Personas, etc.). */
export const ONBOARDING_STORAGE_KEY = "leeshmo_onboarding";

const STORAGE_KEY = ONBOARDING_STORAGE_KEY;

export function saveOnboardingData(data: OnboardingSelections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadOnboardingData(): OnboardingSelections | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingSelections;
  } catch {
    return null;
  }
}
