"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";
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

function formatList(items: string[], other: string | undefined, emptyLabel: string): string {
  const base = items.filter(Boolean);
  if (other?.trim()) return [...base, other.trim()].join(", ");
  return base.join(", ") || emptyLabel;
}

export default function InsightsPage() {
  const { t } = useI18n();
  const [data, setData] = useState<OnboardingSelections | null>(null);
  const [onboardingDone, setOnboardingDone] = useState(false);

  const kpiMock = useMemo(
    () => [
      { label: t("insights.kpiReach"), value: "12,4k", change: "+8%", tone: "positive" as DeltaTone },
      { label: t("insights.kpiEngagement"), value: "4,2%", change: "+0,3pp", tone: "positive" as DeltaTone },
      { label: t("insights.kpiLeads"), value: "86", change: "+12%", tone: "positive" as DeltaTone },
    ],
    [t],
  );

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
    return inferred ? pathLabel(inferred) : t("insights.pathUndefined");
  }, [data, t]);

  const goalsDisplay = useMemo(
    () => formatList(data?.goals ?? [], data?.goalsOther, t("insights.undefinedGoals")),
    [data, t],
  );

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-[var(--muted-foreground)]">
          {onboardingDone ? t("insights.emptyDone") : t("insights.emptyNotDone")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{t("insights.eyebrow")}</p>
          <h1 className="text-2xl font-bold tracking-tight">{t("insights.title")}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("insights.subtitle")}</p>
        </div>
        <Button variant="secondary" size="sm" className="shrink-0 gap-2 self-start rounded-full sm:self-auto" asChild>
          <Link href="/personas">
            {t("insights.seePersonas")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-2">
            <BarChart3 className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <CardTitle>{t("insights.prioritiesTitle")}</CardTitle>
              <CardDescription>
                {t("insights.basedOn", { brand: data.businessName || t("insights.brandFallback") })}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4">
            <p className="text-sm font-semibold">{t("insights.suggestedPath")}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{pathDisplay}</p>
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4">
            <p className="text-sm font-semibold">{t("insights.goals")}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{goalsDisplay}</p>
          </article>
          <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4 md:col-span-2">
            <p className="text-sm font-semibold">{t("insights.channels")}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{formatList(data.channels, undefined, t("insights.undefinedGoals"))}</p>
          </article>
          {data.nicheLine?.trim() ? (
            <article className="rounded-xl border border-[var(--border)] bg-[var(--input)]/70 p-4 md:col-span-2">
              <p className="text-sm font-semibold">{t("insights.nicheFocus")}</p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{data.nicheLine.trim()}</p>
            </article>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("insights.kpiExampleTitle")}</CardTitle>
          <CardDescription>{t("insights.kpiExampleDesc")}</CardDescription>
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
          <CardTitle className="text-lg">{t("insights.trendMockTitle")}</CardTitle>
          <CardDescription>{t("insights.trendMockDesc")}</CardDescription>
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
                  title={`${t("insights.week")} ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>
              {t("insights.week")} 1
            </span>
            <span>
              {t("insights.week")} 7
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
