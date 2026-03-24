"use client";

import { useMemo } from "react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Draft = { title: string; channel: string; cta: string; body: string };
type SavedOutput = { drafts: Draft[] };

function getOutput(): SavedOutput | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("leeshmo-portal-output");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedOutput;
  } catch {
    return null;
  }
}

export default function CalendarPage() {
  const { t } = useI18n();
  const output = useMemo(() => getOutput(), []);

  return (
    <Card>
      <CardHeader>
        <p className="eyebrow">{t("calendar.eyebrow")}</p>
        <CardTitle>{t("calendar.title")}</CardTitle>
        <CardDescription>{t("calendar.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[var(--muted-foreground)]">
                <th className="pb-2">{t("calendar.channel")}</th>
                <th className="pb-2">{t("calendar.titleCol")}</th>
                <th className="pb-2">{t("calendar.cta")}</th>
              </tr>
            </thead>
            <tbody>
              {output?.drafts?.length ? (
                output.drafts.map((draft) => (
                  <tr key={draft.title} className="border-t border-[var(--border)]">
                    <td className="py-3">{draft.channel}</td>
                    <td className="py-3">{draft.title}</td>
                    <td className="py-3">{draft.cta}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-[var(--muted-foreground)]">
                    {t("calendar.emptyHint")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
