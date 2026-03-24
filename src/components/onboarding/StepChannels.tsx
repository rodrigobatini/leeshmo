import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHANNEL_NONE } from "@/lib/onboarding-constants";
import SelectionCard from "./SelectionCard";

const channels = [
  { icon: "📸", label: "Instagram", description: "Feed, Reels, Stories" },
  { icon: "🎵", label: "TikTok", description: "Videos curtos virais" },
  { icon: "▶️", label: "YouTube", description: "Videos longos, Shorts" },
  { icon: "💼", label: "LinkedIn", description: "Conteudo profissional" },
  { icon: "📧", label: "E-mail", description: "Newsletters e sequencias" },
  { icon: "🌐", label: "Blog", description: "Artigos e SEO" },
  { icon: "🚫", label: CHANNEL_NONE, description: "Nao atuo em nenhum destes canais" },
];

interface StepChannelsProps {
  selected: string[];
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepChannels({ selected, onSelect, onNext, onBack }: StepChannelsProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="mx-auto max-w-2xl">
      <div className="mb-8 text-center"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Em quais canais voce esta?</h2></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {channels.map((ch, i) => (
          <SelectionCard key={ch.label} icon={ch.icon} label={ch.label} description={ch.description} selected={selected.includes(ch.label)} onClick={() => onSelect(ch.label)} delay={i * 0.04} />
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="gap-2 rounded-full px-6">Continuar <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </motion.div>
  );
}
