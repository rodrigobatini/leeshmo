"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { AiQuotaInfo } from "@/lib/ai-quota";

/**
 * Indicador discreto de uso de IA no portal — evita surpresas e reforca limite com tom positivo.
 */
export function AiUsageHint({ className }: { className?: string }) {
  const { isSignedIn } = useAuth();
  const { t } = useI18n();
  const [q, setQ] = useState<AiQuotaInfo | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    void fetch("/api/generate/quota", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: AiQuotaInfo | null) => {
        if (!cancelled && d) setQ(d);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  if (!isSignedIn || !q?.tracking) return null;

  const low = q.remaining <= 5 && q.remaining > 0;
  const empty = q.remaining <= 0;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] leading-tight sm:flex-col sm:items-start sm:gap-0.5 sm:px-2.5 sm:py-1.5 sm:text-[11px]",
        empty && "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-100",
        low && !empty && "border-primary/20 bg-primary/5",
        !low && !empty && "border-border/50 bg-muted/30 text-muted-foreground",
        className,
      )}
      title={
        empty
          ? t("aiUsage.titleEmpty")
          : t("aiUsage.titleRemaining", { n: q.remaining })
      }
    >
      <span className="flex items-center gap-1 font-medium text-foreground">
        <Sparkles className="h-3 w-3 shrink-0 text-primary" />
        <span className="hidden sm:inline">{t("aiUsage.today")}</span>
      </span>
      <span className="tabular-nums text-muted-foreground">
        {empty ? (
          t("aiUsage.renewSoon")
        ) : (
          <>
            <span className="sm:hidden">
              {q.remaining}/{q.limit}
            </span>
            <span className="hidden sm:inline">
              {q.remaining} {t("aiUsage.remaining")} {q.limit} {t("aiUsage.left")}
            </span>
          </>
        )}
      </span>
    </div>
  );
}
