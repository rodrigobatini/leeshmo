"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  FileText,
  Flame,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadOnboardingData, type OnboardingSelections } from "@/lib/onboarding-store";
import {
  generatePosts,
  personaDetails,
  strategyDisplayTitle,
  strategyMeta,
  trendLabel,
} from "@/lib/lovable-dashboard-data";

function personaHref(name: string) {
  return `/personas/${encodeURIComponent(name)}`;
}

function estrategiaHref(idOrTitle: string) {
  return `/estrategias/${encodeURIComponent(idOrTitle)}`;
}

type DeltaTone = "positive" | "warning" | "negative";

const deltaToneClass: Record<DeltaTone, string> = {
  positive: "stat-delta stat-delta--positive",
  warning: "stat-delta stat-delta--warning",
  negative: "stat-delta stat-delta--negative",
};

export default function DashboardPage() {
  const { t } = useI18n();
  const [data, setData] = useState<OnboardingSelections | null>(null);

  useEffect(() => {
    setData(loadOnboardingData());
  }, []);

  const stats = useMemo(
    () =>
      [
        {
          label: t("dashboard.statContents"),
          value: "24",
          change: "+12%",
          deltaTone: "positive" as const,
          icon: <FileText className="h-3.5 w-3.5" />,
        },
        {
          label: t("dashboard.statScheduled"),
          value: String(data?.channels.length ? data.channels.length * 4 : 18),
          change: "+8%",
          deltaTone: "positive" as const,
          icon: <Calendar className="h-3.5 w-3.5" />,
        },
        {
          label: t("dashboard.statPersonas"),
          value: String(data?.selectedPersonas?.length || data?.generatedPersonas?.length || 3),
          change: "",
          deltaTone: undefined,
          icon: <Users className="h-3.5 w-3.5" />,
        },
        {
          label: t("dashboard.statEngagement"),
          value: "4.2%",
          change: "+0.8%",
          deltaTone: "positive" as const,
          icon: <TrendingUp className="h-3.5 w-3.5" />,
        },
      ] as const,
    [data, t],
  );

  const upcomingPosts = useMemo(() => (data ? generatePosts(data) : []), [data]);

  const greeting = data?.businessName
    ? `${t("dashboard.greeting")}, ${data.businessName}! 👋`
    : `${t("dashboard.greetingGeneric")}! 👋`;

  return (
    <div className="space-y-5">
      <motion.div initial={false} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{greeting}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card rounded-xl px-3 py-3 sm:px-4 sm:py-3.5"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">{stat.icon}</div>
              {stat.change && stat.deltaTone ? (
                <span className={cn("shrink-0 text-[0.65rem]", deltaToneClass[stat.deltaTone])}>{stat.change}</span>
              ) : null}
            </div>
            <p className="text-lg font-bold tabular-nums text-foreground sm:text-xl">{stat.value}</p>
            <p className="mt-0.5 text-[0.7rem] leading-tight text-muted-foreground sm:text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {data && (data.selectedPersonas.length > 0 || data.selectedStrategies.length > 0) ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {data.selectedPersonas.length > 0 ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" /> {t("dashboard.yourPersonas")}
                </h2>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" asChild>
                  <Link href="/personas">{t("dashboard.seeAll")}</Link>
                </Button>
              </div>
              <div className="space-y-1.5">
                {data.selectedPersonas.map((name, i) => {
                  const p = personaDetails[name];
                  const gp = data.generatedPersonas?.find((x) => x.name === name);
                  return (
                    <Link key={name} href={personaHref(name)} className="block">
                      <motion.div
                        initial={false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                        className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-base">
                          {p?.avatar ?? "👤"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium leading-tight text-foreground">{name}</p>
                          <p className="truncate text-[0.7rem] text-muted-foreground">{p?.pain ?? gp?.pain ?? "—"}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap justify-end gap-0.5">
                          {(p?.channels ?? (gp ? ["Instagram"] : [])).map((ch) => (
                            <span key={ch} className="rounded-full bg-muted px-1.5 py-0 text-[0.6rem] text-muted-foreground">
                              {ch}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ) : null}

          {data.selectedStrategies.length > 0 ? (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Target className="h-3.5 w-3.5 text-primary" /> {t("dashboard.activeStrategies")}
                </h2>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" asChild>
                  <Link href="/nova-estrategia">{t("dashboard.newStrategy")}</Link>
                </Button>
              </div>
              <div className="space-y-1.5">
                {data.selectedStrategies.map((idOrTitle, i) => {
                  const s = strategyMeta(idOrTitle);
                  const title = strategyDisplayTitle(idOrTitle);
                  return (
                    <Link key={idOrTitle} href={estrategiaHref(idOrTitle)} className="block">
                      <motion.div
                        initial={false}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted/50"
                      >
                        <span className="text-lg leading-none">{s?.emoji ?? "📌"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium leading-tight text-foreground">{title}</p>
                          <p className="line-clamp-1 text-[0.7rem] text-muted-foreground">
                            {s?.desc ?? t("dashboard.strategyFallback")}
                          </p>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ) : null}
        </div>
      ) : null}

      {data && data.selectedTrends.length > 0 ? (
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-xl p-4">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Flame className="h-3.5 w-3.5 text-primary" /> {t("dashboard.selectedTrends")}
            </h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.selectedTrends.map((trend, i) => (
              <motion.span
                key={trend}
                initial={false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.04 }}
                className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-[0.7rem] font-medium text-foreground"
              >
                {trendLabel(trend)}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ) : null}

      <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">{t("dashboard.upcoming")}</h2>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" asChild>
            <Link href="/calendar">{t("dashboard.calendarLink")}</Link>
          </Button>
        </div>
        <div className="divide-y divide-border/50">
          {upcomingPosts.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">{t("dashboard.emptyPosts")}</p>
          ) : (
            upcomingPosts.map((post, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.04 }}
                className="group flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="h-8 w-0.5 shrink-0 rounded-full bg-primary/35 transition-colors group-hover:bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-snug text-foreground">{post.title}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-1.5 py-0 text-[0.65rem] font-medium ${post.color}`}>{post.channel}</span>
                    <span className="text-[0.65rem] text-muted-foreground">{post.type}</span>
                  </div>
                </div>
                <span className="shrink-0 text-[0.65rem] font-medium tabular-nums text-muted-foreground">{post.date}</span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
