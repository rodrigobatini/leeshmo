import { useState, type Dispatch, type SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, TrendingUp, Target, Users, Lightbulb, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSIGHT_STRATEGIES, INSIGHT_TRENDS, type InsightOption } from "@/lib/insights-options";
import { saveOnboardingData, type OnboardingSelections } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

interface StepInsightsReviewProps {
  businessName: string;
  onboardingData: Omit<OnboardingSelections, "selectedTrends" | "selectedStrategies" | "selectedPersonas" | "generatedPersonas" | "generatedDrafts" | "generatedPaths">;
  generated?: {
    personas: Array<{ name: string; objective: string; pain: string; tone: string }>;
    drafts: Array<{ title: string; channel: string; cta: string; body: string }>;
    paths: string[];
  };
  selectedTrends: string[];
  selectedStrategies: string[];
  selectedPersonas: string[];
  onSelectedTrendsChange: Dispatch<SetStateAction<string[]>>;
  onSelectedStrategiesChange: Dispatch<SetStateAction<string[]>>;
  onSelectedPersonasChange: Dispatch<SetStateAction<string[]>>;
  onFinish: () => void;
}

type Section = "trends" | "strategies" | "personas";

const discoveredTrends = INSIGHT_TRENDS;
const suggestedStrategies = INSIGHT_STRATEGIES;

const TAB_BASE =
  "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export default function StepInsightsReview({
  businessName,
  onboardingData,
  generated,
  selectedTrends,
  selectedStrategies,
  selectedPersonas,
  onSelectedTrendsChange,
  onSelectedStrategiesChange,
  onSelectedPersonasChange,
  onFinish,
}: StepInsightsReviewProps) {
  const [activeSection, setActiveSection] = useState<Section>("trends");
  const [preparing, setPreparing] = useState(false);

  const personas = generated?.personas?.length
    ? generated.personas
    : [
        {
          name: "Ana, sempre sem tempo",
          objective: "Consumir algo util em poucos minutos",
          pain: "Agenda lotada; pouca energia para conteudo longo",
          tone: "Direto e escaneavel",
        },
      ];

  const personaItems: InsightOption[] = personas.map((p) => ({
    id: p.name,
    title: p.name,
    description: [p.pain, p.objective].filter(Boolean).join(" · "),
  }));

  const toggle = (list: string[], setter: Dispatch<SetStateAction<string[]>>, value: string) => {
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleFinish = () => {
    saveOnboardingData({
      ...onboardingData,
      selectedTrends,
      selectedStrategies,
      selectedPersonas,
      generatedPersonas: generated?.personas ?? [],
      generatedDrafts: generated?.drafts ?? [],
      generatedPaths: generated?.paths ?? [],
    });
    setPreparing(true);
    window.setTimeout(() => {
      onFinish();
    }, 2000);
  };

  const totalSelected = selectedTrends.length + selectedStrategies.length + selectedPersonas.length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto w-full max-w-3xl">
      <AnimatePresence>
        {preparing ? (
          <motion.div
            key="preparing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 px-6 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.8, ease: "linear" }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
            >
              <Sparkles className="h-9 w-9 text-primary" />
            </motion.div>
            <p className="max-w-md text-center text-lg font-semibold text-foreground">A Leeshmo está preparando a sua estratégia</p>
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
              Organizando insights, tendências e próximos passos para você.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Insights para <span className="gradient-text">{businessName || "seu negocio"}</span>
        </h2>
      </div>
      <div className="mb-6 flex gap-2 rounded-xl bg-muted/50 p-1">
        {(
          [
            { key: "trends" as const, label: "Tendencias", icon: TrendingUp, count: selectedTrends.length },
            { key: "strategies" as const, label: "Estrategias", icon: Target, count: selectedStrategies.length },
            { key: "personas" as const, label: "Personas", icon: Users, count: selectedPersonas.length },
          ] as const
        ).map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={cn(
                TAB_BASE,
                activeSection === sec.key
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border/80"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{sec.label}</span>
              <span
                className={cn(
                  "min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                  activeSection === sec.key ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {sec.count}
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {activeSection === "trends" ? (
          <motion.div key="trends" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2.5">
            {discoveredTrends.map((item) => (
              <InsightCard
                key={item.id}
                title={item.title}
                description={item.description}
                selected={selectedTrends.includes(item.id)}
                onClick={() => toggle(selectedTrends, onSelectedTrendsChange, item.id)}
              />
            ))}
          </motion.div>
        ) : null}
        {activeSection === "strategies" ? (
          <motion.div key="strategies" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2.5">
            {suggestedStrategies.map((item) => (
              <InsightCard
                key={item.id}
                title={item.title}
                description={item.description}
                selected={selectedStrategies.includes(item.id)}
                onClick={() => toggle(selectedStrategies, onSelectedStrategiesChange, item.id)}
              />
            ))}
          </motion.div>
        ) : null}
        {activeSection === "personas" ? (
          <motion.div key="personas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2.5">
            {personaItems.map((item) => (
              <InsightCard
                key={item.id}
                title={item.title}
                description={item.description}
                selected={selectedPersonas.includes(item.id)}
                onClick={() => toggle(selectedPersonas, onSelectedPersonasChange, item.id)}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="mt-8 flex flex-col gap-4 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">{totalSelected}</span> no total · Tendencias{" "}
            <span className="font-medium text-foreground">{selectedTrends.length}</span> · Estrategias{" "}
            <span className="font-medium text-foreground">{selectedStrategies.length}</span> · Personas{" "}
            <span className="font-medium text-foreground">{selectedPersonas.length}</span>
          </p>
        </div>
        <Button
          size="lg"
          onClick={handleFinish}
          disabled={totalSelected === 0 || preparing}
          className="gap-2 self-end rounded-full px-6 py-5 text-sm font-semibold sm:self-auto sm:px-8"
        >
          Ver a estratégia e o planejamento
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function InsightCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full gap-3 rounded-xl border-2 p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "shadow-[var(--shadow-card)]",
        selected
          ? "border-primary bg-[color-mix(in_oklab,var(--primary)_12%,var(--card))] ring-2 ring-[color-mix(in_oklab,var(--primary)_32%,transparent)]"
          : "border-transparent bg-card hover:border-[color-mix(in_oklab,var(--primary)_28%,var(--border))]",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {selected ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Lightbulb className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
