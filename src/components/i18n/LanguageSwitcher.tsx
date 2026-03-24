"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const locales: { code: Locale; short: string }[] = [
  { code: "pt", short: "PT" },
  { code: "en", short: "EN" },
];

type Props = {
  /** Mais compacto ao lado do avatar */
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({ compact, className }: Props) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/30 p-0.5",
        compact && "scale-95",
        className,
      )}
      role="group"
      aria-label={t("language.label")}
    >
      {!compact ? <Languages className="ml-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden /> : null}
      {locales.map(({ code, short }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors sm:px-2.5 sm:text-xs",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={active}
            title={code === "pt" ? t("language.pt") : t("language.en")}
          >
            {short}
          </button>
        );
      })}
    </div>
  );
}
