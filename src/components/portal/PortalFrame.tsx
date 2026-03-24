"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Menu,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { ONBOARDING_DONE_KEY } from "@/lib/onboarding";
import { AiUsageHint } from "@/components/portal/AiUsageHint";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NAV_ITEMS = [
  { href: "/dashboard", key: "dashboard" as const, icon: BarChart3 },
  { href: "/personas", key: "personas" as const, icon: Users },
  { href: "/library", key: "content" as const, icon: FileText },
  { href: "/calendar", key: "calendar" as const, icon: Calendar },
  { href: "/automacao", key: "automation" as const, icon: Zap },
  { href: "/insights", key: "metrics" as const, icon: TrendingUp },
];

const isDev = process.env.NODE_ENV === "development";
const SIDEBAR_COLLAPSED_KEY = "leeshmo-sidebar-collapsed";

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NotifItem = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

function PortalNavLinks({
  pathname,
  canAccessFullPortal,
  onNavigate,
  mode,
  collapsed = false,
  t,
}: {
  pathname: string;
  canAccessFullPortal: boolean;
  onNavigate?: () => void;
  mode: "drawer" | "sidebar";
  collapsed?: boolean;
  t: (path: string) => string;
}) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const locked = !canAccessFullPortal;
        const Icon = item.icon;
        const isSidebar = mode === "sidebar";
        const label = t(`nav.${item.key}`);
        return (
          <Link
            key={item.href}
            href={locked ? "#" : item.href}
            title={isSidebar && collapsed ? label : undefined}
            onClick={(e) => {
              if (locked) e.preventDefault();
              else onNavigate?.();
            }}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium transition-colors",
              mode === "drawer" && "w-full gap-3 px-3 py-2.5",
              isSidebar && collapsed && "justify-center px-2 py-2.5",
              isSidebar && !collapsed && "gap-3 px-3 py-2",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              locked && "pointer-events-none opacity-50",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {isSidebar && collapsed ? (
              <span className="sr-only">{label}</span>
            ) : (
              <span>{label}</span>
            )}
          </Link>
        );
      })}
    </>
  );
}

export function PortalFrame({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotifItem[]>([]);
  const [unread, setUnread] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const [onboardingHydrated, setOnboardingHydrated] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      setSidebarCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const fetchNotifications = useCallback(() => {
    if (!isSignedIn) return;
    void fetch("/api/notifications", { credentials: "include" })
      .then((r) => r.json() as Promise<{ items?: NotifItem[]; unreadCount?: number }>)
      .then((d) => {
        setNotifs(d.items ?? []);
        setUnread(d.unreadCount ?? 0);
      })
      .catch(() => {});
  }, [isSignedIn]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!notifOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [notifOpen]);

  useEffect(() => {
    const syncOnboarding = () => {
      setOnboardingDone(window.localStorage.getItem(ONBOARDING_DONE_KEY) === "true");
    };
    syncOnboarding();
    setOnboardingHydrated(true);
    window.addEventListener("storage", syncOnboarding);
    window.addEventListener("onboarding-status-change", syncOnboarding as EventListener);
    return () => {
      window.removeEventListener("storage", syncOnboarding);
      window.removeEventListener("onboarding-status-change", syncOnboarding as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!onboardingHydrated) return;
    if (!onboardingDone && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [onboardingHydrated, onboardingDone, pathname, router]);

  if (isLoaded && !isSignedIn) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <p className="eyebrow">{t("portal.eyebrow")}</p>
            <CardTitle className="text-3xl">{t("portal.signInTitle")}</CardTitle>
            <CardDescription>{t("portal.signInDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <SignInButton mode="modal">
              <Button className="mt-2">{t("portal.signInClerk")}</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  const canAccessFullPortal = onboardingHydrated && onboardingDone;
  const showLockedState =
    onboardingHydrated && !onboardingDone && pathname !== "/onboarding";

  const MobileDrawer = () => (
    <>
      <div className="mb-6">
        <Link href="/dashboard" className="text-xl font-bold gradient-text" onClick={() => setMenuOpen(false)}>
          Leeshmo
        </Link>
      </div>
      <nav className="flex flex-1 flex-col space-y-1">
        <PortalNavLinks
          pathname={pathname}
          canAccessFullPortal={canAccessFullPortal}
          onNavigate={() => setMenuOpen(false)}
          mode="drawer"
          t={t}
        />
      </nav>
      {isDev ? (
        <div className="border-t border-border/50 pt-4">
          <Link
            href="/onboarding"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            onClick={() => setMenuOpen(false)}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            {t("portal.setupDev")}
          </Link>
        </div>
      ) : null}
    </>
  );

  const sidebarW = sidebarCollapsed ? "w-[4.25rem]" : "w-56";

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-30 hidden flex-col border-r border-border/50 bg-card/90 backdrop-blur-md transition-[width] duration-200 ease-out lg:flex",
          sidebarW,
        )}
      >
        <div className="flex h-14 shrink-0 items-center gap-1 border-b border-border/50 px-2">
          {sidebarCollapsed ? (
            <Link
              href="/dashboard"
              className="flex h-10 min-w-0 flex-1 items-center justify-center rounded-lg text-lg font-bold gradient-text"
              title="Leeshmo"
            >
              L
            </Link>
          ) : (
            <Link href="/dashboard" className="min-w-0 flex-1 truncate pl-1 text-lg font-bold gradient-text">
              Leeshmo
            </Link>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? t("portal.expandMenu") : t("portal.collapseMenu")}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
          <PortalNavLinks
            pathname={pathname}
            canAccessFullPortal={canAccessFullPortal}
            mode="sidebar"
            collapsed={sidebarCollapsed}
            t={t}
          />
        </nav>
        {isDev ? (
          <div className="border-t border-border/50 p-2">
            <Link
              href="/onboarding"
              className={cn(
                "flex items-center rounded-lg text-sm text-muted-foreground transition-colors hover:bg-muted",
                sidebarCollapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2",
              )}
              title={sidebarCollapsed ? t("portal.setupDev") : undefined}
            >
              <Sparkles className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed ? <span>{t("portal.setupDev")}</span> : <span className="sr-only">{t("portal.setupDev")}</span>}
            </Link>
          </div>
        ) : null}
      </aside>

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-200 ease-out",
          sidebarCollapsed ? "lg:ml-[4.25rem]" : "lg:ml-56",
        )}
      >
        <header className="sticky top-0 z-20 border-b border-border/50 bg-background/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 py-2.5 sm:px-5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label={t("portal.openMenu")}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/dashboard" className="shrink-0 text-lg font-bold gradient-text lg:hidden">
              Leeshmo
            </Link>
            <div className="hidden min-w-0 flex-1 lg:block" aria-hidden />
            <div className="ml-auto flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              <AiUsageHint />
              <div className="relative shrink-0" ref={notifRef}>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="relative"
                  aria-expanded={notifOpen}
                  aria-haspopup="true"
                  onClick={() => {
                    setNotifOpen((o) => !o);
                    void fetchNotifications();
                  }}
                >
                  <Bell className="h-4 w-4" />
                  {unread > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-0.5 text-[10px] font-semibold text-secondary-foreground">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </Button>
                {notifOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-border/60 bg-card p-0 shadow-lg">
                    <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
                      <span className="text-xs font-semibold text-muted-foreground">{t("portal.notifications")}</span>
                      {unread > 0 ? (
                        <button
                          type="button"
                          className="text-xs font-medium text-primary hover:underline"
                          onClick={() => {
                            void fetch("/api/notifications", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              credentials: "include",
                              body: JSON.stringify({ markAllRead: true }),
                            }).then(() => fetchNotifications());
                          }}
                        >
                          {t("portal.markRead")}
                        </button>
                      ) : null}
                    </div>
                    <ul className="max-h-72 overflow-y-auto py-1">
                      {notifs.length === 0 ? (
                        <li className="px-3 py-6 text-center text-sm text-muted-foreground">{t("portal.noNotifications")}</li>
                      ) : (
                        notifs.map((n) => (
                          <li key={n.id}>
                            <button
                              type="button"
                              className={cn(
                                "w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/80",
                                !n.read_at && "bg-primary/5",
                              )}
                              onClick={() => {
                                if (!n.read_at) {
                                  void fetch("/api/notifications", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    credentials: "include",
                                    body: JSON.stringify({ ids: [n.id] }),
                                  }).then(() => fetchNotifications());
                                }
                              }}
                            >
                              <span className="font-medium">{n.title}</span>
                              {n.body ? <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p> : null}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                ) : null}
              </div>
              {isSignedIn ? (
                <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Link
                        href="/settings"
                        label={t("portal.settingsApp")}
                        labelIcon={<Settings className="h-4 w-4" aria-hidden />}
                      />
                    </UserButton.MenuItems>
                </UserButton>
              ) : null}
            </div>
          </div>
        </header>

        {menuOpen ? (
          <>
            <button type="button" className="fixed inset-0 z-40 bg-black/50 lg:hidden" aria-label={t("portal.closeMenu")} onClick={() => setMenuOpen(false)} />
            <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-[min(100vw-3rem,18rem)] flex-col border-r border-border/50 bg-card p-4 shadow-xl lg:hidden">
              <MobileDrawer />
            </aside>
          </>
        ) : null}

        <main className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-5 sm:py-6">
            {!onboardingHydrated ? (
              <div className="space-y-4" aria-busy="true" aria-label={t("portal.loadingPanel")}>
                <div className="h-8 w-48 animate-pulse rounded-lg bg-muted/60" />
                <div className="h-28 animate-pulse rounded-xl bg-muted/40" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/35" />
                  ))}
                </div>
              </div>
            ) : showLockedState ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold">{t("portal.lockedTitle")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t("portal.lockedDescription")}</p>
                  <Button type="button" onClick={() => router.push("/onboarding")} className="mt-4">
                    {t("portal.lockedCta")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
