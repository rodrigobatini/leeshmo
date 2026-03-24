"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ArrowRight, Sparkles, BarChart3, Users, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";

const features = [
  { icon: <Sparkles className="h-5 w-5" />, title: "IA que cria conteudo", desc: "Personas, copies e roteiros gerados automaticamente" },
  { icon: <BarChart3 className="h-5 w-5" />, title: "Metricas inteligentes", desc: "Dashboard visual com insights acionaveis" },
  { icon: <Users className="h-5 w-5" />, title: "Personas detalhadas", desc: "Entenda seu publico com jornadas completas" },
  { icon: <Zap className="h-5 w-5" />, title: "Automacao total", desc: "Agende e publique em todos os canais" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-6 py-4">
        <Link href="/" className="gradient-text text-xl font-bold">
          Leeshmo
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal" fallbackRedirectUrl="/onboarding">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Entrar
              </Button>
            </SignInButton>
            <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
              <Button size="sm" className="rounded-full hover:brightness-110">
                Criar conta
              </Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button size="sm" className="rounded-full hover:brightness-110" asChild>
              <Link href="/onboarding">Onboarding</Link>
            </Button>
            <UserButton />
          </Show>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Estrategia de conteudo com IA
          </motion.div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Sua maquina de conteudo, <span className="gradient-text">inteligente e automatica</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Crie personas, gere conteudo, planeje publicacoes e automatize tudo - em minutos, nao em semanas.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Show when="signed-out">
              <SignUpButton mode="modal" fallbackRedirectUrl="/onboarding">
                <Button size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-semibold hover:brightness-110">
                  Comecar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
              <p className="text-sm text-muted-foreground">
                Ja tem conta?{" "}
                <SignInButton mode="modal" fallbackRedirectUrl="/onboarding">
                  <span className="cursor-pointer font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary">
                    Entrar
                  </span>
                </SignInButton>
              </p>
            </Show>
            <Show when="signed-in">
              <Button size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-semibold hover:brightness-110" asChild>
                <Link href="/onboarding">
                  Ir ao onboarding
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-base font-semibold" asChild>
                <Link href="/dashboard">Abrir dashboard</Link>
              </Button>
            </Show>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="glass-card-hover p-5 text-left"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">{f.icon}</div>
              <h3 className="mb-1 text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
