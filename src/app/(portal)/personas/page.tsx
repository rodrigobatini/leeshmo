"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadOnboardingData, type OnboardingSelections } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

export default function PersonasPage() {
  const { t } = useI18n();
  const [data, setData] = useState<OnboardingSelections | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount
    setData(loadOnboardingData());
  }, []);

  const personas = data?.generatedPersonas ?? [];
  const summary = useMemo(() => {
    if (!data) return null;
    const parts = [data.businessName, data.nicheLine?.trim(), data.goals?.slice(0, 2).join(" · ")].filter(Boolean);
    return parts.join(" — ") || null;
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{t("personas.eyebrow")}</p>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{t("personas.title")}</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("personas.description")}</p>
        </div>
        {personas.length > 0 ? (
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {personas.length} {personas.length === 1 ? "persona" : "personas"}
          </div>
        ) : null}
      </div>

      {summary ? (
        <p className="rounded-lg border border-border/50 bg-card/60 px-3 py-2 text-xs text-muted-foreground sm:text-sm">
          <span className="font-medium text-foreground">{t("personas.context")}</span> {summary}
        </p>
      ) : null}

      {personas.length === 0 ? (
        <Card className="overflow-hidden border-dashed">
          <CardContent className="flex flex-col items-center px-5 py-10 text-center sm:py-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-base font-semibold">{t("personas.emptyTitle")}</h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{t("personas.emptyBody")}</p>
            <Button asChild className="mt-5 gap-2 rounded-full">
              <Link href="/onboarding">
                <Sparkles className="h-4 w-4" />
                {t("personas.goSetup")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="grid list-none gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {personas.map((p, i) => (
            <motion.li key={`${p.name}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/personas/${encodeURIComponent(p.name)}`} className="block h-full">
                <Card
                  className={cn(
                    "h-full border-border/70 transition-shadow hover:shadow-md",
                    i === 0 && "ring-1 ring-primary/15",
                  )}
                >
                  <CardHeader className="space-y-1 p-3 pb-2 sm:p-4 sm:pb-2">
                    <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-foreground/85">{p.pain}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-1.5 p-3 pt-0 text-xs text-muted-foreground sm:p-4 sm:pt-0">
                    <p>
                      <span className="font-medium text-foreground">{t("personas.objective")}</span> {p.objective}
                    </p>
                    <p className="line-clamp-2">
                      <span className="font-medium text-foreground">{t("personas.tone")}</span> {p.tone}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
