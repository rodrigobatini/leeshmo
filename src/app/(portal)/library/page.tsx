"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LibraryPage() {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">{t("library.eyebrow")}</p>
        <CardTitle>{t("library.title")}</CardTitle>
        <CardDescription>{t("library.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--muted-foreground)]">{t("library.body")}</p>
      </CardContent>
    </Card>
  );
}
