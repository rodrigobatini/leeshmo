import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTHER_OPTION } from "@/lib/onboarding-constants";
import { cn } from "@/lib/utils";

const verticals: { id: string; emoji: string; label: string }[] = [
  { id: "gastronomia", emoji: "🍽", label: "Gastronomia" },
  { id: "saude", emoji: "🩺", label: "Saude & bem-estar" },
  { id: "fitness", emoji: "💪", label: "Fitness" },
  { id: "games", emoji: "🎮", label: "Games & entretenimento" },
  { id: "educacao", emoji: "📚", label: "Educacao & cursos" },
  { id: "moda", emoji: "👗", label: "Moda & beleza" },
  { id: "financas", emoji: "💰", label: "Financas & negocios" },
  { id: "tech", emoji: "💻", label: "Tech & B2B" },
  { id: "casa", emoji: "🏠", label: "Casa & lifestyle" },
  { id: "pet", emoji: "🐾", label: "Pet & familia" },
  { id: OTHER_OPTION, emoji: "✏️", label: OTHER_OPTION },
];

const visualStyles: { id: string; emoji: string; label: string }[] = [
  { id: "limpo", emoji: "◻️", label: "Limpo / minimal" },
  { id: "ugc", emoji: "📱", label: "UGC / autentico" },
  { id: "premium", emoji: "✨", label: "Premium" },
  { id: "bold", emoji: "🎨", label: "Bold & colorido" },
];

interface StepNicheContextProps {
  nicheLine: string;
  onNicheLineChange: (v: string) => void;
  verticalSegments: string[];
  onToggleVertical: (id: string) => void;
  verticalOther: string;
  onVerticalOtherChange: (v: string) => void;
  referenceHint: string;
  onReferenceHintChange: (v: string) => void;
  avoidHint: string;
  onAvoidHintChange: (v: string) => void;
  visualStyleTags: string[];
  onToggleVisual: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepNicheContext({
  nicheLine,
  onNicheLineChange,
  verticalSegments,
  onToggleVertical,
  verticalOther,
  onVerticalOtherChange,
  referenceHint,
  onReferenceHintChange,
  avoidHint,
  onAvoidHintChange,
  visualStyleTags,
  onToggleVisual,
  onNext,
  onBack,
}: StepNicheContextProps) {
  const nicheOk = nicheLine.trim().length >= 8;
  const verticalOk =
    verticalSegments.filter((v) => v !== OTHER_OPTION).length > 0 ||
    (verticalSegments.includes(OTHER_OPTION) && verticalOther.trim().length >= 2);
  const canContinue = nicheOk && verticalOk;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Nicho e voz</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Rapido: ajuda a IA a falar a linguagem do seu mercado, copys e ideias visuais.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="niche-line" className="mb-1.5 block text-left text-sm font-medium text-foreground">
            Em uma frase, qual e o seu nicho?
          </label>
          <input
            id="niche-line"
            type="text"
            value={nicheLine}
            onChange={(e) => onNicheLineChange(e.target.value.slice(0, 120))}
            maxLength={120}
            placeholder="Ex.: receitas low carb para quem trabalha fora"
            className="w-full rounded-xl border border-border/60 bg-card px-4 py-3 text-sm shadow-sm outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">{nicheLine.length}/120</p>
        </div>

        <div>
          <p className="mb-2 text-left text-sm font-medium text-foreground">Area (marque uma ou mais)</p>
          <div className="flex flex-wrap gap-2">
            {verticals.map((v) => {
              const selected = verticalSegments.includes(v.label);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onToggleVertical(v.label)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/12 text-primary"
                      : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30",
                  )}
                >
                  <span className="mr-1">{v.emoji}</span>
                  {v.label}
                </button>
              );
            })}
          </div>
          {verticalSegments.includes(OTHER_OPTION) ? (
            <input
              type="text"
              value={verticalOther}
              onChange={(e) => onVerticalOtherChange(e.target.value.slice(0, 80))}
              maxLength={80}
              placeholder="Seu segmento em poucas palavras..."
              className="mt-2 w-full rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          ) : null}
        </div>

        <div>
          <p className="mb-2 text-left text-sm font-medium text-foreground">Estilo visual (opcional)</p>
          <div className="flex flex-wrap gap-2">
            {visualStyles.map((v) => {
              const selected = visualStyleTags.includes(v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onToggleVisual(v.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/12 text-primary"
                      : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30",
                  )}
                >
                  <span className="mr-1">{v.emoji}</span>
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="ref-hint" className="mb-1.5 block text-left text-xs font-medium text-muted-foreground">
              Referencias (opcional)
            </label>
            <input
              id="ref-hint"
              type="text"
              value={referenceHint}
              onChange={(e) => onReferenceHintChange(e.target.value.slice(0, 100))}
              maxLength={100}
              placeholder="@perfis ou estilos que voce admira"
              className="w-full rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div>
            <label htmlFor="avoid-hint" className="mb-1.5 block text-left text-xs font-medium text-muted-foreground">
              Evitar (opcional)
            </label>
            <input
              id="avoid-hint"
              type="text"
              value={avoidHint}
              onChange={(e) => onAvoidHintChange(e.target.value.slice(0, 100))}
              maxLength={100}
              placeholder="Ex.: antes/depois, promessa de renda"
              className="w-full rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="gap-2 rounded-full px-6">
          Continuar <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
