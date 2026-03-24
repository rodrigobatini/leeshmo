"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutomacaoPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("automacao.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("automacao.subtitle")}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("automacao.soonTitle")}</CardTitle>
          <CardDescription>{t("automacao.soonDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("automacao.soonBody")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
