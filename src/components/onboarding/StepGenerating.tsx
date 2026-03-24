import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, BarChart3, Calendar, FileText, Zap, Check, ArrowRight, Sun, HeartHandshake } from "lucide-react";
import type { AiQuotaInfo } from "@/lib/ai-quota";
import { Button } from "@/components/ui/button";

interface OnboardingData {
  businessInfo: { name: string; description: string; website: string };
  businessTypes: string[];
  businessTypesOther?: string;
  audience: string[];
  audienceOther?: string;
  monetization: string[];
  monetizationOther?: string;
  channels: string[];
  goals: string[];
  goalsOther?: string;
  frequency: string;
}

interface StepGeneratingProps {
  data: OnboardingData;
  onFinish: () => void;
  onGenerate: () => Promise<void>;
  /** Quando o limite diario ja foi atingido antes de gerar — voltar para ajustar o fluxo (ex.: passo 7). */
  onQuotaBack?: () => void;
}

const stages = [
  { icon: <BarChart3 className="h-5 w-5" />, label: "Analisando seu mercado e nicho...", duration: 1200 },
  { icon: <Users className="h-5 w-5" />, label: "Criando personas do seu publico...", duration: 1200 },
  { icon: <FileText className="h-5 w-5" />, label: "Gerando ideias de conteudo...", duration: 1200 },
  { icon: <Calendar className="h-5 w-5" />, label: "Montando calendario editorial...", duration: 1200 },
  { icon: <Zap className="h-5 w-5" />, label: "Conectando ao backend...", duration: 1000 },
];

function friendlyQuotaLine(q: AiQuotaInfo | null): string | null {
  if (!q?.tracking) return null;
  if (q.remaining >= q.limit) return "Sua cota de hoje esta liberada para gerar a estrategia.";
  if (q.remaining > 5) return `Voce ainda tem ${q.remaining} geracoes hoje — otimo momento para criar.`;
  if (q.remaining > 0) return `Restam ${q.remaining} geracao(oes) hoje. Aproveite com calma.`;
  return null;
}

function QuotaRestMessage({ resetAt }: { resetAt: string }) {
  const d = new Date(resetAt);
  const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
  return (
    <p className="text-sm text-muted-foreground">
      O contador renova as <span className="font-medium text-foreground">{timeStr} UTC</span> (meia-noite UTC). Ate la, explore o que ja foi salvo no portal.
    </p>
  );
}

export default function StepGenerating({ data, onFinish, onGenerate, onQuotaBack }: StepGeneratingProps) {
  const [quotaPhase, setQuotaPhase] = useState<"loading" | "blocked" | "ready">("loading");
  const [quotaInfo, setQuotaInfo] = useState<AiQuotaInfo | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorIsQuota, setErrorIsQuota] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/generate/quota", { credentials: "include" })
      .then(async (r) => {
        if (!r.ok) return null;
        return (await r.json()) as AiQuotaInfo & { error?: string };
      })
      .then((d) => {
        if (cancelled) return;
        if (!d) {
          setQuotaPhase("ready");
          return;
        }
        setQuotaInfo(d);
        if (d.tracking && d.remaining <= 0) {
          setQuotaPhase("blocked");
        } else {
          setQuotaPhase("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setQuotaPhase("ready");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (quotaPhase !== "ready") return;
    let timeout: ReturnType<typeof setTimeout>;
    const advanceStage = (stage: number) => {
      if (stage < stages.length) {
        timeout = setTimeout(() => {
          setCurrentStage(stage + 1);
          advanceStage(stage + 1);
        }, stages[stage].duration);
      } else {
        onGenerate()
          .then(() => setCompleted(true))
          .catch((e: unknown) => {
            const msg =
              e instanceof Error
                ? e.message
                : "Nao foi possivel gerar sua estrategia agora. Tente novamente.";
            const status = typeof e === "object" && e !== null && "status" in e ? (e as { status?: number }).status : undefined;
            const is429 = status === 429 || /limite|diario|atingido/i.test(msg);
            setErrorIsQuota(is429);
            setError(msg);
          });
      }
    };
    advanceStage(0);
    return () => clearTimeout(timeout);
  }, [quotaPhase, onGenerate]);

  const progress = Math.min((currentStage / stages.length) * 100, 100);
  const quotaHint = friendlyQuotaLine(quotaInfo);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-lg py-8 text-center">
      <AnimatePresence mode="wait">
        {quotaPhase === "loading" ? (
          <motion.div key="quota-load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-8 w-8 animate-pulse text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Conferindo seu uso de hoje...</p>
            <p className="mt-2 text-xs text-muted-foreground">Assim evitamos surpresas e mantemos a experiencia justa para todos.</p>
          </motion.div>
        ) : null}

        {quotaPhase === "blocked" && quotaInfo ? (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/10 to-transparent px-5 py-8 text-left"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <Sun className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Voce ja aproveitou suas geracoes de hoje</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Isso ajuda a manter qualidade e sustentar o servico para todos. Nada foi desperdicado — seu progresso continua salvo.
                </p>
              </div>
            </div>
            <QuotaRestMessage resetAt={quotaInfo.resetAt} />
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {onQuotaBack ? (
                <Button type="button" variant="default" className="rounded-full" onClick={onQuotaBack}>
                  Voltar e revisar respostas
                </Button>
              ) : null}
              <Button type="button" variant="secondary" className="rounded-full" asChild>
                <a href="/">Ir ao inicio</a>
              </Button>
            </div>
          </motion.div>
        ) : null}

        {quotaPhase === "ready" && !completed && !error ? (
          <motion.div key="loading" exit={{ opacity: 0, y: -20 }}>
            {quotaHint ? (
              <p className="mb-4 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-left text-sm text-muted-foreground">
                <span className="mr-2 inline-flex align-middle text-primary">
                  <HeartHandshake className="h-4 w-4" />
                </span>
                {quotaHint}
              </p>
            ) : null}
            <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "linear" }} className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Preparando tudo para <span className="gradient-text">{data.businessInfo.name || "voce"}</span>
            </h2>
            <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-hero)" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
            </div>
            <div className="space-y-3 text-left">
              {stages.map((stage, i) => {
                const isDone = i < currentStage;
                const isActive = i === currentStage;
                return (
                  <div key={stage.label} className={`flex items-center gap-3 rounded-xl p-3 transition-colors duration-300 ${isActive ? "bg-accent" : ""}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${isDone ? "bg-primary/20 text-primary" : isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {isDone ? <Check className="h-4 w-4" /> : stage.icon}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${isDone ? "text-primary" : isActive ? "text-foreground" : "text-muted-foreground"}`}>{stage.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}

        {completed ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight">Tudo pronto!</h2>
            {quotaInfo?.tracking && quotaInfo.remaining > 0 ? (
              <p className="mb-2 text-sm text-muted-foreground">
                Apos esta geracao, restam {Math.max(0, quotaInfo.remaining - 1)} uso(s) hoje — use com carinho nas proximas ideias.
              </p>
            ) : null}
            <Button size="lg" onClick={onFinish} className="mt-8 gap-2 rounded-full px-6 py-6 text-base font-semibold sm:px-8">
              Vamos ver os insights e tendencias
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Button>
          </motion.div>
        ) : null}

        {error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-left">
            {errorIsQuota ? (
              <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-amber-500/10 to-transparent px-5 py-6">
                <h3 className="text-base font-semibold">Limite de hoje alcancado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {error} Quando renovar, e so tentar de novo — seu trabalho no formulario continua aqui.
                </p>
                {quotaInfo ? <div className="mt-4"><QuotaRestMessage resetAt={quotaInfo.resetAt} /></div> : null}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  {onQuotaBack ? (
                    <Button type="button" variant="secondary" className="rounded-full" onClick={onQuotaBack}>
                      Revisar respostas
                    </Button>
                  ) : null}
                  <Button type="button" variant="secondary" className="rounded-full" onClick={() => window.location.reload()}>
                    Tentar novamente mais tarde
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-4 text-sm text-destructive">{error}</p>
                <Button onClick={() => window.location.reload()} variant="secondary">
                  Recarregar
                </Button>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
