/** Opcoes compartilhadas entre onboarding (StepInsightsReview) e fluxo Nova estrategia */

import { OTHER_OPTION } from "@/lib/onboarding-constants";

export type InsightOption = { id: string; title: string; description: string };

export const GOAL_OPTIONS = [
  { icon: "📈", label: "Aumentar vendas", description: "Gerar mais receita com conteudo estrategico" },
  { icon: "👥", label: "Ganhar seguidores", description: "Crescer audiencia de forma organica" },
  { icon: "🎯", label: "Gerar leads", description: "Captar contatos qualificados" },
  { icon: "🏆", label: "Autoridade no nicho", description: "Ser referencia no seu mercado" },
  { icon: "✏️", label: OTHER_OPTION, description: "Outro objetivo com conteudo" },
] as const;

export const INSIGHT_TRENDS: InsightOption[] = [
  {
    id: "trend-story",
    title: "Videos curtos com storytelling",
    description: "Gancho nos primeiros segundos e arco emocional; funciona bem em Reels e Shorts.",
  },
  {
    id: "trend-carousel",
    title: "Conteudo educativo em carrossel",
    description: "Lista em slides para ensinar um conceito sem precisar de video; bom para salvar e compartilhar.",
  },
  {
    id: "trend-bastidores",
    title: "Bastidores e transparencia",
    description: "Mostrar processo e decisoes reais para gerar confianca antes de pedir conversao.",
  },
];

export const INSIGHT_STRATEGIES: InsightOption[] = [
  {
    id: "strat-funil",
    title: "Funil de conteudo",
    description: "Pecas para topo (alcance), meio (educacao) e fundo (decisao), em sequencia coerente.",
  },
  {
    id: "strat-pilares",
    title: "Pilares de conteudo",
    description: "3 a 5 temas fixos que sua marca repete para nao ficar sem ideia toda semana.",
  },
  {
    id: "strat-repurpose",
    title: "Repurposing machine",
    description: "Uma ideia vira varios formatos (post, email, corte de video) sem recomecar do zero.",
  },
];
