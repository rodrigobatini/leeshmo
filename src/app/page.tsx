"use client";

import { useMemo, useState } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

type StepField = {
  id: keyof OnboardingState;
  label: string;
  placeholder: string;
  required?: boolean;
};

type Persona = {
  name: string;
  objective: string;
  pain: string;
  tone: string;
};

type Draft = {
  title: string;
  channel: string;
  cta: string;
  body: string;
};

type CalendarItem = {
  id: string;
  date: string;
  type: string;
  status: "Planned" | "InReview" | "Ready";
  title: string;
};

type OnboardingState = {
  brandName: string;
  niche: string;
  offer: string;
  valueProp: string;
  channels: string;
  audience: string;
  goals: string;
  constraints: string;
  revenueModel: string;
  funnel: string;
};

const STORAGE_KEY = "leeshmo-mvp-onboarding";

const DEFAULT_STATE: OnboardingState = {
  brandName: "",
  niche: "",
  offer: "",
  valueProp: "",
  channels: "",
  audience: "",
  goals: "",
  constraints: "",
  revenueModel: "",
  funnel: "",
};

const STEP_FIELDS: Array<{ title: string; fields: StepField[] }> = [
  {
    title: "Negocio e oferta",
    fields: [
      { id: "brandName", label: "Marca", placeholder: "Ex: Leeshmo", required: true },
      { id: "niche", label: "Nicho", placeholder: "Ex: Marketing para creators", required: true },
      { id: "offer", label: "Oferta principal", placeholder: "Ex: Consultoria e produto SaaS", required: true },
    ],
  },
  {
    title: "Produto e proposta",
    fields: [
      { id: "valueProp", label: "Proposta de valor", placeholder: "Qual problema voce resolve?", required: true },
    ],
  },
  {
    title: "Estado atual",
    fields: [
      { id: "channels", label: "Canais ativos", placeholder: "Instagram, Youtube, Newsletter..." },
    ],
  },
  {
    title: "Publico e posicionamento",
    fields: [
      { id: "audience", label: "ICP / publico alvo", placeholder: "Quem deve comprar agora?", required: true },
    ],
  },
  {
    title: "Objetivos e escopo",
    fields: [
      { id: "goals", label: "Objetivos 30/60/90", placeholder: "Leads, conversao, autoridade...", required: true },
      { id: "constraints", label: "Restricoes", placeholder: "Tempo, equipe, budget..." },
    ],
  },
  {
    title: "Monetizacao e operacao",
    fields: [
      { id: "revenueModel", label: "Modelo de receita", placeholder: "Servico, assinatura, infoproduto..." },
      { id: "funnel", label: "Funil atual", placeholder: "Oferta de entrada, upsell, LTV..." },
    ],
  },
];

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingState>(() => {
    if (typeof window === "undefined") return DEFAULT_STATE;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as OnboardingState) : DEFAULT_STATE;
  });
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastStorage, setLastStorage] = useState<"mock-only" | "neon" | null>(null);

  const progress = useMemo(() => Math.round(((step + 1) / STEP_FIELDS.length) * 100), [step]);
  const current = STEP_FIELDS[step];

  function updateField(key: keyof OnboardingState, value: string) {
    const next = { ...data, [key]: value };
    setData(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function canContinue() {
    return current.fields.every((f) => !f.required || data[f.id].trim().length > 0);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: data }),
      });
      if (!response.ok) {
        throw new Error("Falha ao gerar pacote");
      }
      const output = (await response.json()) as {
        personas: Persona[];
        drafts: Draft[];
        paths: string[];
        storage: "mock-only" | "neon";
      };
      setPersonas(output.personas);
      setDrafts(output.drafts);
      setPaths(output.paths);
      setLastStorage(output.storage);
    } finally {
      setIsGenerating(false);
    }
  }

  async function addToCalendar(draft: Draft) {
    const item: CalendarItem = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      type: draft.channel,
      status: "Planned",
      title: draft.title,
    };
    setCalendar((prev) => [item, ...prev]);

    await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: draft.title,
        channel: draft.channel,
        publishDate: item.date,
      }),
    });
  }

  const dashboard = {
    onboardingComplete: step === STEP_FIELDS.length - 1 && canContinue(),
    personas: personas.length,
    drafts: drafts.length,
    scheduled: calendar.length,
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="card-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Leeshmo MVP</p>
            <h1 className="mt-1 text-2xl font-semibold">Assistente estrategico de conteudo</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[var(--primary-moss)]/30 px-3 py-1 text-xs text-[var(--muted)]">
              Build base pronto para demo
            </span>
            {isSignedIn ? (
              <UserButton />
            ) : null}
          </div>
        </div>
      </header>

      {isLoaded && !isSignedIn ? (
        <section className="card-surface p-6 text-center">
          <h2 className="text-xl font-semibold">Entre para continuar</h2>
          <p className="mt-2 text-[var(--muted)]">
            O fluxo do Leeshmo usa Clerk para autenticar e salvar o progresso por usuario.
          </p>
          <SignInButton mode="modal">
            <button className="btn-primary mt-4 rounded-lg px-4 py-2 font-semibold">Entrar com Clerk</button>
          </SignInButton>
        </section>
      ) : null}

      {isLoaded && isSignedIn ? (
      <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className="card-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Onboarding interativo</h2>
            <span className="text-sm text-[var(--muted)]">{progress}%</span>
          </div>
          <div className="mb-5 h-2 rounded-full bg-black/25">
            <div className="h-2 rounded-full bg-[var(--cta)] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <h3 className="mb-3 text-sm uppercase tracking-wide text-[var(--neutral-warm)]">{current.title}</h3>

          <div className="space-y-4">
            {current.fields.map((field) => (
              <label key={field.id} className="block">
                <span className="mb-1 block text-sm">{field.label}</span>
                <input
                  value={data[field.id]}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 outline-none focus:border-[var(--cta)]"
                  placeholder={field.placeholder}
                />
              </label>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm disabled:opacity-40"
            >
              Voltar
            </button>
            {step < STEP_FIELDS.length - 1 ? (
              <button
                onClick={() => canContinue() && setStep((s) => s + 1)}
                className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
                disabled={!canContinue()}
              >
                Proximo passo
              </button>
            ) : (
              <button onClick={handleGenerate} className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold">
                {isGenerating ? "Gerando..." : "Gerar pacote inicial"}
              </button>
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold">Dashboard basico</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="Onboarding" value={dashboard.onboardingComplete ? "Completo" : "Em andamento"} />
            <MetricCard label="Personas" value={String(dashboard.personas)} />
            <MetricCard label="Drafts" value={String(dashboard.drafts)} />
            <MetricCard label="Agendados" value={String(dashboard.scheduled)} />
          </div>
          <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-[var(--muted)]">
            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--neutral-warm)]">
              Persistencia: {lastStorage ? lastStorage : "aguardando geracao"}
            </p>
            Caminhos sugeridos:
            <ul className="mt-2 space-y-1">
              {paths.length ? paths.map((p) => <li key={p}>- {p}</li>) : <li>- Gere o pacote para ver recomendacoes.</li>}
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold">Personas</h2>
          <div className="mt-4 space-y-3">
            {personas.length ? (
              personas.map((p) => (
                <article key={p.name} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Objetivo: {p.objective}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Dor: {p.pain}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">Tom: {p.tone}</p>
                </article>
              ))
            ) : (
              <EmptyBlock text="As personas aparecerao aqui apos a geracao." />
            )}
          </div>
        </div>

        <div className="card-surface p-5">
          <h2 className="text-lg font-semibold">Conteudos iniciais</h2>
          <div className="mt-4 space-y-3">
            {drafts.length ? (
              drafts.map((d) => (
                <article key={d.title} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <p className="font-semibold">{d.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{d.channel}</p>
                  <p className="mt-2 text-sm">{d.body}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">CTA: {d.cta}</p>
                  <button onClick={() => addToCalendar(d)} className="mt-3 rounded-md bg-[var(--primary-moss)] px-3 py-1 text-sm">
                    Enviar ao calendario
                  </button>
                </article>
              ))
            ) : (
              <EmptyBlock text="Gere o pacote de IA para criar drafts." />
            )}
          </div>
        </div>
      </section>

      <section className="card-surface p-5">
        <h2 className="text-lg font-semibold">Calendario editorial simples</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[var(--neutral-warm)]">
              <tr>
                <th className="pb-2">Data</th>
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Titulo</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {calendar.length ? (
                calendar.map((item) => (
                  <tr key={item.id} className="border-t border-white/10">
                    <td className="py-2">{item.date}</td>
                    <td className="py-2">{item.type}</td>
                    <td className="py-2">{item.title}</td>
                    <td className="py-2">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 text-[var(--muted)]" colSpan={4}>
                    Nenhum item no calendario. Envie um draft para comecar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      </>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="text-xs uppercase tracking-wide text-[var(--neutral-warm)]">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

function EmptyBlock({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-white/20 bg-black/20 p-4 text-sm text-[var(--muted)]">{text}</div>;
}
