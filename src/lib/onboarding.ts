export type BusinessStage = "already-selling" | "building" | "planning";
export type RevenueModel = "service" | "subscription" | "infoproduct";
export type MainGoal = "authority" | "leads" | "conversion";
export type FunnelMaturity = "none" | "basic" | "structured";
export type PresenceChannel =
  | "website"
  | "landing-page"
  | "instagram"
  | "youtube"
  | "linkedin"
  | "newsletter"
  | "whatsapp";

export type JourneyPath = "authority-path" | "lead-path" | "conversion-path";

export type OnboardingState = {
  brandName: string;
  niche: string;
  offer: string;
  valueProp: string;
  businessStage: BusinessStage | "";
  audience: string;
  constraints: string;
  mainGoal: MainGoal | "";
  revenueModel: RevenueModel | "";
  funnelMaturity: FunnelMaturity | "";
  activePresence: PresenceChannel[];
  selectedPath: JourneyPath | "";
};

export const STORAGE_KEY = "leeshmo-portal-onboarding";
export const ONBOARDING_DONE_KEY = "leeshmo-portal-onboarding-done";

export const DEFAULT_STATE: OnboardingState = {
  brandName: "",
  niche: "",
  offer: "",
  valueProp: "",
  businessStage: "",
  audience: "",
  constraints: "",
  mainGoal: "",
  revenueModel: "",
  funnelMaturity: "",
  activePresence: [],
  selectedPath: "",
};

export const stageOptions = [
  {
    id: "already-selling",
    title: "Ja vende",
    description: "Tem ofertas ativas e quer escalar com mais previsibilidade.",
  },
  {
    id: "building",
    title: "Ta construindo",
    description: "Tem base inicial e esta validando posicionamento e canal.",
  },
  {
    id: "planning",
    title: "Ainda nao vende",
    description: "Esta estruturando oferta, narrativa e primeira acquisicao.",
  },
] as const;

export const goalOptions = [
  {
    id: "authority",
    title: "Autoridade",
    description: "Ganhar confianca e reconhecimento no nicho.",
  },
  {
    id: "leads",
    title: "Leads",
    description: "Atrair demanda qualificada para seu funil.",
  },
  {
    id: "conversion",
    title: "Conversao",
    description: "Aumentar fechamento com provas e ofertas.",
  },
] as const;

export const revenueOptions = [
  { id: "service", title: "Servico" },
  { id: "subscription", title: "Assinatura / SaaS" },
  { id: "infoproduct", title: "Infoproduto" },
] as const;

export const funnelOptions = [
  { id: "none", title: "Sem funil definido" },
  { id: "basic", title: "Funil basico" },
  { id: "structured", title: "Funil estruturado" },
] as const;

export const presenceOptions = [
  { id: "website", label: "Site institucional" },
  { id: "landing-page", label: "Landing page" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "newsletter", label: "Newsletter" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

export function inferPathRecommendations(data: OnboardingState): JourneyPath[] {
  const ranking = new Map<JourneyPath, number>([
    ["authority-path", 0],
    ["lead-path", 0],
    ["conversion-path", 0],
  ]);

  if (data.mainGoal === "authority") ranking.set("authority-path", (ranking.get("authority-path") ?? 0) + 3);
  if (data.mainGoal === "leads") ranking.set("lead-path", (ranking.get("lead-path") ?? 0) + 3);
  if (data.mainGoal === "conversion") ranking.set("conversion-path", (ranking.get("conversion-path") ?? 0) + 3);

  if (data.businessStage === "planning") ranking.set("authority-path", (ranking.get("authority-path") ?? 0) + 2);
  if (data.businessStage === "building") ranking.set("lead-path", (ranking.get("lead-path") ?? 0) + 2);
  if (data.businessStage === "already-selling") ranking.set("conversion-path", (ranking.get("conversion-path") ?? 0) + 2);

  if (data.funnelMaturity === "none") ranking.set("lead-path", (ranking.get("lead-path") ?? 0) + 1);
  if (data.funnelMaturity === "structured") ranking.set("conversion-path", (ranking.get("conversion-path") ?? 0) + 1);

  if (data.activePresence.includes("youtube") || data.activePresence.includes("linkedin")) {
    ranking.set("authority-path", (ranking.get("authority-path") ?? 0) + 1);
  }

  if (data.activePresence.includes("landing-page") || data.activePresence.includes("newsletter")) {
    ranking.set("lead-path", (ranking.get("lead-path") ?? 0) + 1);
  }

  const sorted = [...ranking.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);

  return sorted.slice(0, 3);
}

export function pathLabel(path: JourneyPath): string {
  switch (path) {
    case "authority-path":
      return "Caminho de Autoridade";
    case "lead-path":
      return "Caminho de Captacao de Leads";
    case "conversion-path":
      return "Caminho de Conversao";
    default:
      return "Caminho estrategico";
  }
}
