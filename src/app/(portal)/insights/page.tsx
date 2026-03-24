"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { pathLabel, type JourneyPath } from "@/lib/onboarding";
import { loadOnboardingData, type OnboardingSelections } from "@/lib/onboarding-store";
import { ONBOARDING_DONE_KEY } from "@/lib/onboarding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeltaTone = "positive" | "warning" | "negative";

const deltaToneClass: Record<DeltaTone, string> = {
  positive: "stat-delta stat-delta--positive",
  warning: "stat-delta stat-delta--warning",
  negative: "stat-delta stat-delta--negative",
};

function inferPathFromGoals(goals: string[], goalsOther?: string): JourneyPath | null {
  const blob = `${goals.join(" ")} ${goalsOther ?? ""}`.toLowerCase();
  if (blob.includes("vendas") || blob.includes("convers")) return "conversion-path";
  if (blob.includes("autoridade") || blob.includes("marca")) return "authority-path";
  if (blob.includes("lead") || blob.includes("capta")) return "lead-path";
  return null;
}

function formatList(items: string[], other?: string): string {
  const base = items.filter(Boolean);
  if (other?.trim()) return [...base, other.trim()].join(", ");
  return base.join(", ") || "Não definido";
}

const kpiMock = [
  { label: "Alcance semanal", value: "12,4k", change: "+8%", tone: "positive" as DeltaTone },
  { label: "Engajamento", value: "4,2%", change: "+0,3pp", tone: "positive" as DeltaTone },
  { label: "Leads", value: "86", change: "+12%", tone: "positive" as DeltaTone },
];

export default function InsightsPage() {
  const [data, setData] = useState<OnboardingSelections | null>(null);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    setData(loadOnboardingData());
    setOnboardingDone(typeof window !== "undefined" && window.localStorage.getItem(ONBOARDING_DONE_KEY) === "true");
  }, []);

  const pathDisplay = useMemo(() => {
    if (!data) return null;
    const first = data.generatedPaths?.[0];
    if (first) {
      const lower = first.toLowerCase();
      if (lower.includes("autoridade")) return pathLabel("authority-path");
      if (lower.includes("convers")) return pathLabel("conversion-path");
      if (lower.includes("lead") || lower.includes("capta")) return pathLabel("lead-path");
      return first;
    }
    const inferred = inferPathFromGoals(data.goals, data.goalsOther);
    return inferred ? pathLabel(inferred) : "Defina no onboarding";
  }, [data]);

  const goalsDisplay = useMemo(() => formatList(data?.goals ?? [], data?.goalsOther), [data]);

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">
          {onboardingDone
            ? "Nenhum perfil salvo neste dispositivo. Conclua a revisão final de insights no setup para sincronizar os dados."
            : "Finalize o onboarding para habilitar insights personalizados."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Performance</p>
          <h1 className="text-2xl font-bold tracking-tight">Métricas e insights</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Resumo da sua estratégia e indicadores de exemplo até conectar analytics real (GA, Meta, etc.).
          </p>
        </div>
        <Button variant="secondary" size="sm" className="shrink-0 gap-2 self-start rounded-full sm:self-auto" asChild>
          <Link href="/personas">
            Ver personas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-2">
            <BarChart3 className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <CardTitle>Prioridades para os próximos 30 dias</CardTitle>
              <CardDescription>Baseado no onboarding salvo em {data.businessName || "sua marca"}.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4">
            <p className="text-sm font-semibold">Caminho sugerido</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{pathDisplay}</p>
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4">
            <p className="text-sm font-semibold">Objetivos</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{goalsDisplay}</p>
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4 md:col-span-2">
            <p className="text-sm font-semibold">Canais</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{formatList(data.channels)}</p>
          </article>
          {data.nicheLine?.trim() ? (
            <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4 md:col-span-2">
              <p className="text-sm font-semibold">Nicho em foco</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{data.nicheLine.trim()}</p>
            </article>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">KPIs (exemplo)</CardTitle>
          <CardDescription>Valores ilustrativos — mesmo estilo visual do dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {kpiMock.map((k) => (
            <div key={k.label} className="rounded-xl border border-border/60 bg-muted/40 p-4">
              <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{k.value}</p>
              <p className={cn("mt-1 text-xs", deltaToneClass[k.tone])}>{k.change}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tendência (mock)</CardTitle>
          <CardDescription>Volume relativo por semana — substituir por dados reais quando integrar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl border border-border/40 bg-muted/20 p-4">
            <div className="pointer-events-none absolute inset-x-4 top-4 grid h-28 grid-rows-4 gap-0 border-b border-dashed border-border/30">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-dashed border-border/20" />
              ))}
            </div>
            <div className="relative flex h-36 items-end gap-2 pt-2">
              {[40, 55, 45, 70, 62, 80, 75].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-primary/60 to-primary/30 transition-all hover:from-primary/80 hover:to-primary/40"
                  style={{ height: `${h}%` }}
                  title={`Semana ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>Semana 1</span>
            <span>Semana 7</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
