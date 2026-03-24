"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LOCALE_STORAGE_KEY, defaultLocale, type Locale, dictionaries } from "@/lib/i18n/dictionaries";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

function getNested(obj: unknown, parts: string[]): unknown {
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined) return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`,
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (raw === "en" || raw === "pt") {
        setLocaleState(raw);
        document.documentElement.lang = raw === "en" ? "en" : "pt-BR";
      } else {
        document.documentElement.lang = "pt-BR";
      }
    } catch {
      document.documentElement.lang = "pt-BR";
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l === "en" ? "en" : "pt-BR";
    window.dispatchEvent(new Event("leeshmo-locale-change"));
  }, []);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const parts = path.split(".");
      const value = getNested(dictionaries[locale] as unknown as Record<string, unknown>, parts);
      const str = typeof value === "string" ? value : path;
      return interpolate(str, vars);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return ctx;
}

/** Para páginas server ou testes — lê o dicionário direto */
export function translate(locale: Locale, path: string, vars?: Record<string, string | number>): string {
  const parts = path.split(".");
  const value = getNested(dictionaries[locale] as unknown as Record<string, unknown>, parts);
  const str = typeof value === "string" ? value : path;
  return interpolate(str, vars);
}
