"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 bg-background/85 px-6 py-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <Link href="/" className="gradient-text text-xl font-bold">
        Leeshmo
      </Link>
      <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
        <ThemeToggle />
        <LanguageSwitcher />
        <Show when="signed-out">
          <SignInButton mode="modal" fallbackRedirectUrl="/onboarding">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              {t("home.signIn")}
            </Button>
          </SignInButton>
          <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
            <Button size="sm" className="rounded-full hover:brightness-110">
              {t("home.signUp")}
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/dashboard">{t("nav.dashboard")}</Link>
          </Button>
          <Button size="sm" className="rounded-full hover:brightness-110" asChild>
            <Link href="/onboarding">{t("home.onboarding")}</Link>
          </Button>
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
