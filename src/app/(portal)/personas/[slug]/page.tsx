"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { loadOnboardingData, type OnboardingSelections } from "@/lib/onboarding-store";
import { personaDetails } from "@/lib/lovable-dashboard-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PersonaDetailPage() {
  const { t } = useI18n();
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const name = useMemo(() => {
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

  const persona = useMemo(() => {
    if (!data?.generatedPersonas?.length) return null;
    return data.generatedPersonas.find((p) => p.name === name) ?? null;
  }, [data, name]);

  const extra = personaDetails[name];

  if (data === null) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-sm text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  if (!persona) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <User className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold">{t("personasDetail.notFoundTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("personasDetail.notFoundBody")}</p>
        <Button asChild variant="secondary">
          <Link href="/personas">{t("personasDetail.seeAll")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button type="button" variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        {t("personasDetail.back")}
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted text-3xl">{extra?.avatar ?? "👤"}</div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t("personasDetail.persona")}</p>
          <h1 className="text-2xl font-bold tracking-tight">{persona.name}</h1>
          {data.businessName ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {t("personasDetail.context")} <span className="text-foreground">{data.businessName}</span>
            </p>
          ) : null}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("personasDetail.pain")}</CardTitle>
          <CardDescription className="text-foreground/90">{persona.pain}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-foreground">{t("personasDetail.objective")}</p>
            <p className="mt-1 text-muted-foreground">{persona.objective}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{t("personasDetail.voice")}</p>
            <p className="mt-1 text-muted-foreground">{persona.tone}</p>
          </div>
          {extra?.channels?.length ? (
            <div>
              <p className="font-medium text-foreground">{t("personasDetail.channels")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {extra.channels.map((ch) => (
                  <span key={ch} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="secondary">
          <Link href="/personas">{t("personasDetail.list")}</Link>
        </Button>
        <Button asChild>
          <Link href="/nova-estrategia">{t("personasDetail.newStrategy")}</Link>
        </Button>
      </div>
    </div>
  );
}
