import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const frequencies = [
  { value: "casual", emoji: "🌱", title: "Casual", desc: "1-2x por semana", sub: "Pra quem ta comecando" },
  { value: "regular", emoji: "⚡", title: "Regular", desc: "3-4x por semana", sub: "Consistencia sem pressao" },
  { value: "intenso", emoji: "🔥", title: "Intenso", desc: "5-7x por semana", sub: "Growth acelerado" },
  { value: "maquina", emoji: "🚀", title: "Maquina", desc: "Multiplos posts/dia", sub: "Full content machine" },
];

interface StepFrequencyProps {
  selected: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFrequency({ selected, onSelect, onNext, onBack }: StepFrequencyProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="mx-auto max-w-xl">
      <div className="mb-8 text-center"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Qual a frequencia ideal?</h2></div>
      <div className="space-y-3">
        {frequencies.map((freq, i) => {
          const isSelected = selected === freq.value;
          return (
            <motion.button
              key={freq.value}
              type="button"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(freq.value)}
              aria-pressed={isSelected}
              className={cn(
                "w-full rounded-xl border-2 p-5 text-left transition-all duration-200",
                "shadow-[var(--shadow-card)]",
                isSelected
                  ? "border-primary bg-[color-mix(in_oklab,var(--primary)_14%,var(--card))] shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_45%,transparent),var(--shadow-card)] ring-2 ring-[color-mix(in_oklab,var(--primary)_35%,transparent)]"
                  : "border-transparent bg-card hover:border-[color-mix(in_oklab,var(--primary)_35%,var(--border))]",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{freq.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{freq.title}</p>
                  <p className="text-sm text-muted-foreground">{freq.desc}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      isSelected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {freq.sub}
                  </span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-dashed border-muted-foreground/35 bg-transparent",
                    )}
                    aria-hidden
                  >
                    <Check
                      className={cn("h-4 w-4 stroke-[2.5]", isSelected ? "opacity-100" : "opacity-0")}
                    />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
        <Button onClick={onNext} disabled={!selected} className="gap-2 rounded-full px-6">Continuar <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </motion.div>
  );
}
