"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { buildProfileFromOnboardingSelections } from "@/lib/build-generate-profile";
import { GOAL_OPTIONS, INSIGHT_STRATEGIES, INSIGHT_TRENDS } from "@/lib/insights-options";
import { OTHER_OPTION } from "@/lib/onboarding-constants";
import { loadOnboardingData, saveOnboardingData, type OnboardingSelections } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OtherTextField from "@/components/onboarding/OtherTextField";
import SelectionCard from "@/components/onboarding/SelectionCard";

type GenerateResponse = {
  personas: Array<{ name: string; objective: string; pain: string; tone: string }>;
  drafts: Array<{ title: string; channel: string; cta: string; body: string }>;
  paths: string[];
};

const STEP_LABELS = ["Objetivos", "Tendências", "Estratégias", "Personas"] as const;

export default function NovaEstrategiaPage() {
  const router = useRouter();
  const [base, setBase] = useState<OnboardingSelections | null>(null);
  const [step, setStep] = useState(0);
  const [goals, setGoals] = useState<string[]>([]);
  const [goalsOther, setGoalsOther] = useState("");
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = loadOnboardingData();
    if (!d) {
      router.replace("/onboarding");
      return;
    }
    setBase(d);
    setGoals(d.goals?.length ? d.goals : []);
    setGoalsOther(d.goalsOther ?? "");
    setSelectedTrends(d.selectedTrends?.length ? [...d.selectedTrends] : []);
    setSelectedStrategies(d.selectedStrategies?.length ? [...d.selectedStrategies] : []);
    setSelectedPersonas(d.selectedPersonas?.length ? [...d.selectedPersonas] : []);
  }, [router]);

  const toggleMulti = useCallback((list: string[], setter: (v: string[]) => void, value: string) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }, []);

  const otherGoalsOk = !goals.includes(OTHER_OPTION) || goalsOther.trim().length >= 2;
  const canNextGoals = goals.length > 0 && otherGoalsOk;
  const canNextTrends = selectedTrends.length > 0;
  const canNextStrategies = selectedStrategies.length > 0;
  const personaNames = base?.generatedPersonas?.map((p) => p.name) ?? [];
  const canNextPersonas = personaNames.length === 0 || selectedPersonas.length > 0;

  async function handleGenerate() {
    if (!base) return;
    setError(null);
    setGenerating(true);
    try {
      const profile = buildProfileFromOnboardingSelections(base, {
        goals,
        goalsOther,
        selectedTrends,
        selectedStrategies,
        selectedPersonas,
      });
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profile }),
      });
      if (!response.ok) {
        let message = "Não foi possível gerar agora. Tente novamente.";
        try {
          const j = (await response.json()) as { error?: string };
          if (response.status === 429) {
            message =
              typeof j?.error === "string"
                ? j.error
                : "Voce chegou ao limite de geracoes de hoje. Volte amanha.";
          } else if (typeof j?.error === "string") message = j.error;
        } catch {
          /* ignore */
        }
        throw new Error(message);
      }
      const output = (await response.json()) as GenerateResponse;
      saveOnboardingData({
        ...base,
        goals,
        goalsOther,
        selectedTrends,
        selectedStrategies,
        selectedPersonas,
        generatedPersonas: output.personas,
        generatedDrafts: output.drafts,
        generatedPaths: output.paths,
      });
      window.dispatchEvent(new Event("onboarding-store-change"));
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setGenerating(false);
    }
  }

  if (!base) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div>
        <p className="eyebrow">Estratégia</p>
        <h1 className="text-2xl font-bold tracking-tight">Nova estratégia</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Usamos o que já está salvo do seu setup (negócio, público, canais, nicho). Aqui você só redefine foco: objetivos, tendências, modelos e personas — e geramos uma nova rodada de insights e rascunhos.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              i === step ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
      ) : null}

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold">Quais objetivos guiam esta rodada?</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {GOAL_OPTIONS.map((g, i) => (
                <SelectionCard
                  key={g.label}
                  icon={g.icon}
                  label={g.label}
                  description={g.description}
                  selected={goals.includes(g.label)}
                  onClick={() => toggleMulti(goals, setGoals, g.label)}
                  delay={i * 0.04}
                />
              ))}
            </div>
            <OtherTextField
              show={goals.includes(OTHER_OPTION)}
              value={goalsOther}
              onChange={setGoalsOther}
              placeholder="Ex.: parcerias com marcas, comunidade paga..."
            />
          </motion.div>
        ) : null}

        {step === 1 ? (
          <motion.div key="trends" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <h2 className="mb-2 text-lg font-semibold">Tendências em foco</h2>
            {INSIGHT_TRENDS.map((item) => (
              <MiniInsightCard
                key={item.id}
                title={item.title}
                description={item.description}
                selected={selectedTrends.includes(item.id)}
                onClick={() => toggleMulti(selectedTrends, setSelectedTrends, item.id)}
              />
            ))}
          </motion.div>
        ) : null}

        {step === 2 ? (
          <motion.div key="strategies" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <h2 className="mb-2 text-lg font-semibold">Modelos de estratégia</h2>
            {INSIGHT_STRATEGIES.map((item) => (
              <MiniInsightCard
                key={item.id}
                title={item.title}
                description={item.description}
                selected={selectedStrategies.includes(item.id)}
                onClick={() => toggleMulti(selectedStrategies, setSelectedStrategies, item.id)}
              />
            ))}
          </motion.div>
        ) : null}

        {step === 3 ? (
          <motion.div key="personas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <h2 className="mb-2 text-lg font-semibold">Personas prioritárias</h2>
            {personaNames.length === 0 ? (
              <p className="rounded-xl border border-border/60 bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
                Ainda não há personas salvas. A geração usará perfis genéricos alinhados ao seu nicho. Você pode{" "}
                <Link href="/onboarding" className="font-medium text-primary underline-offset-4 hover:underline">
                  revisar o setup completo
                </Link>{" "}
                para gerar personas nomeadas antes.
              </p>
            ) : (
              personaNames.map((name) => {
                const p = base.generatedPersonas.find((x) => x.name === name);
                return (
                  <MiniInsightCard
                    key={name}
                    title={name}
                    description={p ? [p.pain, p.objective].filter(Boolean).join(" · ") : ""}
                    selected={selectedPersonas.includes(name)}
                    onClick={() => toggleMulti(selectedPersonas, setSelectedPersonas, name)}
                  />
                );
              })
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" asChild className="gap-2 self-start">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao dashboard
          </Link>
        </Button>
        <div className="flex gap-2 sm:ml-auto">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 0 && !canNextGoals) ||
                (step === 1 && !canNextTrends) ||
                (step === 2 && !canNextStrategies) ||
                (step === 3 && !canNextPersonas)
              }
              className="gap-2 rounded-full px-6"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={generating || !canNextPersonas}
              className="gap-2 rounded-full px-6"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Gerar nova estratégia
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniInsightCard({
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
        "flex w-full gap-3 rounded-xl border-2 p-4 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/45",
        selected
          ? "border-primary bg-[color-mix(in_oklab,var(--primary)_12%,var(--card))] ring-2 ring-[color-mix(in_oklab,var(--primary)_32%,transparent)]"
          : "border-transparent bg-card hover:border-border",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {selected ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Lightbulb className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
    </button>
  );
}
