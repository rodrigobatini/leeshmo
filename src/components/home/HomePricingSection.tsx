"use client";

import { Check, X } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function BoolCell({ ok }: { ok: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex justify-center" role="img" aria-label={ok ? t("home.pricing.a11yIncluded") : t("home.pricing.a11yNotIncluded")}>
      {ok ? (
        <Check className="h-5 w-5 text-primary" strokeWidth={2.5} aria-hidden />
      ) : (
        <X className="h-5 w-5 text-muted-foreground/60" strokeWidth={2} aria-hidden />
      )}
    </div>
  );
}

export function HomePricingSection() {
  const { t } = useI18n();

  const rows: { labelKey: string; free: string; growth: string; scale: string }[] = [
    {
      labelKey: "home.pricing.rowOnboarding",
      free: t("home.pricing.freeOnboarding"),
      growth: t("home.pricing.growthOnboarding"),
      scale: t("home.pricing.scaleOnboarding"),
    },
    {
      labelKey: "home.pricing.rowStrategies",
      free: t("home.pricing.freeStrategies"),
      growth: t("home.pricing.growthStrategies"),
      scale: t("home.pricing.scaleStrategies"),
    },
    {
      labelKey: "home.pricing.rowPersonas",
      free: t("home.pricing.freePersonas"),
      growth: t("home.pricing.growthPersonas"),
      scale: t("home.pricing.scalePersonas"),
    },
    {
      labelKey: "home.pricing.rowIntegrations",
      free: t("home.pricing.freeIntegrations"),
      growth: t("home.pricing.growthIntegrations"),
      scale: t("home.pricing.scaleIntegrations"),
    },
  ];

  return (
    <section
      id="pricing"
      className="mx-auto w-full max-w-4xl scroll-mt-24 px-0 sm:px-2"
      aria-labelledby="pricing-heading"
    >
      <div className="mb-8 text-center">
        <p className="eyebrow mb-2">{t("home.pricing.eyebrow")}</p>
        <h2 id="pricing-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("home.pricing.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("home.pricing.subtitle")}
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-border/60 bg-card/60 shadow-[var(--shadow-card)] backdrop-blur-sm">
        <table className="w-full table-fixed border-collapse text-left text-sm">
          <colgroup>
            <col className="w-[24%] sm:w-[22%]" />
            <col className="w-[25.33%]" />
            <col className="w-[25.33%]" />
            <col className="w-[25.33%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border/60 bg-muted/30">
              <th scope="col" className="sticky left-0 z-[1] bg-muted/30 px-2 py-4 text-left text-xs font-semibold leading-tight text-foreground backdrop-blur-sm sm:px-3 sm:text-sm">
                {t("home.pricing.feature")}
              </th>
              <th scope="col" className="px-2 py-4 text-center align-bottom sm:px-3">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-semibold">{t("home.pricing.planFree")}</span>
                  <span className="text-xs text-muted-foreground">{t("home.pricing.priceFree")}</span>
                  <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
                    <Button size="sm" className="mt-1 w-full max-w-[11rem] rounded-full">
                      {t("home.pricing.ctaFree")}
                    </Button>
                  </SignUpButton>
                </div>
              </th>
              <th
                scope="col"
                className={cn(
                  "relative px-2 py-4 text-center align-bottom sm:px-3",
                  "bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] ring-1 ring-primary/25",
                )}
              >
                <span className="absolute left-1/2 top-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {t("home.pricing.badgePopular")}
                </span>
                <div className="flex flex-col items-center gap-2 pt-5">
                  <span className="font-semibold">{t("home.pricing.planGrowth")}</span>
                  <span className="text-xs text-muted-foreground">{t("home.pricing.priceSoon")}</span>
                  <Button type="button" size="sm" variant="secondary" className="mt-1 w-full max-w-[11rem] rounded-full" disabled>
                    {t("home.pricing.ctaPaid")}
                  </Button>
                </div>
              </th>
              <th scope="col" className="px-2 py-4 text-center align-bottom sm:px-3">
                <div className="flex flex-col items-center gap-2">
                  <span className="font-semibold">{t("home.pricing.planScale")}</span>
                  <span className="text-xs text-muted-foreground">{t("home.pricing.priceSoon")}</span>
                  <Button type="button" size="sm" variant="secondary" className="mt-1 w-full max-w-[11rem] rounded-full" disabled>
                    {t("home.pricing.ctaPaid")}
                  </Button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.labelKey} className="border-b border-border/40 last:border-0">
                <th
                  scope="row"
                  className="sticky left-0 z-[1] bg-card/95 px-2 py-3.5 text-left text-xs font-medium leading-snug text-foreground backdrop-blur-sm sm:px-3 sm:text-sm"
                >
                  {t(row.labelKey)}
                </th>
                <td className="px-2 py-3.5 text-center text-xs text-muted-foreground sm:px-3 sm:text-sm">{row.free}</td>
                <td className="bg-[color-mix(in_oklab,var(--primary)_6%,transparent)] px-2 py-3.5 text-center text-xs font-medium text-foreground sm:px-3 sm:text-sm">
                  {row.growth}
                </td>
                <td className="px-2 py-3.5 text-center text-xs font-medium text-foreground sm:px-3 sm:text-sm">{row.scale}</td>
              </tr>
            ))}
            <tr>
              <th
                scope="row"
                className="sticky left-0 z-[1] bg-card/95 px-2 py-3.5 text-left text-xs font-medium leading-snug text-foreground backdrop-blur-sm sm:px-3 sm:text-sm"
              >
                {t("home.pricing.rowExtras")}
              </th>
              <td className="px-2 py-3.5 sm:px-3">
                <BoolCell ok={false} />
              </td>
              <td className="bg-[color-mix(in_oklab,var(--primary)_6%,transparent)] px-2 py-3.5 sm:px-3">
                <BoolCell ok />
              </td>
              <td className="px-2 py-3.5 sm:px-3">
                <BoolCell ok />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">{t("home.pricing.note")}</p>
    </section>
  );
}
