"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Target } from "lucide-react";
import { strategyDisplayTitle, strategyMeta, trendLabel } from "@/lib/lovable-dashboard-data";
import { loadOnboardingData, type OnboardingSelections } from "@/lib/onboarding-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EstrategiaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const idOrTitle = useMemo(() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  }, [slug]);

  const [data, setData] = useState<OnboardingSelections | null>(null);
  useEffect(() => {
    setData(loadOnboardingData());
  }, []);
  const title = strategyDisplayTitle(idOrTitle);
  const meta = strategyMeta(idOrTitle);
  const isSelected = data?.selectedStrategies?.includes(idOrTitle) ?? false;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button type="button" variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">{meta?.emoji ?? "📌"}</div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Estratégia</p>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {data?.businessName ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Marca: <span className="text-foreground">{data.businessName}</span>
            </p>
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-4 w-4 text-primary" />
            O que é
          </CardTitle>
          <CardDescription className="text-foreground/90 text-base leading-relaxed">
            {meta?.desc ?? "Modelo de organização de conteúdo escolhido para guiar seus próximos passos."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">No seu plano:</span>
            {isSelected ? (
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">Ativa</span>
            ) : (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">Não está nas selecionadas agora</span>
            )}
          </div>
          {data?.selectedTrends?.length ? (
            <div>
              <p className="font-medium text-foreground">Tendências combinadas</p>
              <ul className="mt-2 list-inside list-disc text-muted-foreground">
                {data.selectedTrends.map((t) => (
                  <li key={t}>{trendLabel(t)}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href="/nova-estrategia">Refinar em nova estratégia</Link>
        </Button>
      </div>
    </div>
  );
}
