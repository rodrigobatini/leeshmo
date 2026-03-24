"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, BarChart3, Users, Zap } from "lucide-react";
import { HomePricingSection } from "@/components/home/HomePricingSection";
import { MarketingHeader } from "@/components/home/MarketingHeader";
import { PricingAnchorLink } from "@/components/home/PricingAnchorLink";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";

const featureKeys = [
  { icon: <Sparkles className="h-5 w-5" />, titleKey: "home.f1Title" as const, descKey: "home.f1Desc" as const },
  { icon: <BarChart3 className="h-5 w-5" />, titleKey: "home.f2Title" as const, descKey: "home.f2Desc" as const },
  { icon: <Users className="h-5 w-5" />, titleKey: "home.f3Title" as const, descKey: "home.f3Desc" as const },
  { icon: <Zap className="h-5 w-5" />, titleKey: "home.f4Title" as const, descKey: "home.f4Desc" as const },
];

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />

      <main className="flex flex-1 flex-col items-center px-6 py-16 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t("home.badge")}
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {t("home.headline")} <span className="gradient-text">{t("home.headlineGradient")}</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("home.sub")}</p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Show when="signed-out">
              <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
                <Button size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-semibold hover:brightness-110">
                  {t("home.ctaStart")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <p>
                  {t("home.hasAccount")}{" "}
                  <SignInButton mode="modal" fallbackRedirectUrl="/onboarding">
                    <span className="cursor-pointer font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                      {t("home.signIn")}
                    </span>
                  </SignInButton>
                </p>
                <PricingAnchorLink className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                  {t("home.heroPlansLink")}
                </PricingAnchorLink>
              </div>
            </Show>
            <Show when="signed-in">
              <Button size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-semibold hover:brightness-110" asChild>
                <Link href="/onboarding">
                  {t("home.goOnboarding")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-base font-semibold" asChild>
                <Link href="/dashboard">{t("home.openDashboard")}</Link>
              </Button>
              <PricingAnchorLink className="text-sm font-medium text-muted-foreground underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/30">
                {t("home.heroPlansLink")}
              </PricingAnchorLink>
            </Show>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featureKeys.map((f, i) => (
            <motion.div
              key={f.titleKey}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass-card-hover p-5 text-left"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{f.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{t(f.titleKey)}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-24 w-full max-w-4xl">
          <HomePricingSection />
        </div>
      </main>
    </div>
  );
}
