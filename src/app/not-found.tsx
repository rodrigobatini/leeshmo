"use client";

import Link from "next/link";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t("notFound.title")}</p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          {t("notFound.home")}
        </Link>
      </div>
    </div>
  );
}
