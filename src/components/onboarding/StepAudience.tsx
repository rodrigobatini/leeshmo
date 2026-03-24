import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTHER_OPTION } from "@/lib/onboarding-constants";
import SelectionCard from "./SelectionCard";
import OtherTextField from "./OtherTextField";

const audiences = [
  { icon: "🧑‍💼", label: "Empreendedores", description: "Donos de negocios, founders, CEOs" },
  { icon: "👩‍💻", label: "Profissionais tech", description: "Devs, designers, PMs" },
  { icon: "👔", label: "Corporativo / B2B", description: "Empresas, gestores, RH, vendas" },
  { icon: "🛒", label: "Consumidor final", description: "Publico geral, e-commerce, varejo" },
  { icon: "🎮", label: "Gamers & Geeks", description: "Comunidade gamer, tech enthusiasts" },
  { icon: "🎨", label: "Criativos", description: "Artistas, fotografos, videomakers" },
  { icon: "✏️", label: OTHER_OPTION, description: "Descreva outro publico-alvo" },
];

interface StepAudienceProps {
  selected: string[];
  onSelect: (value: string) => void;
  otherText: string;
  onOtherTextChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepAudience({ selected, onSelect, otherText, onOtherTextChange, onNext, onBack }: StepAudienceProps) {
  const otherOk = !selected.includes(OTHER_OPTION) || otherText.trim().length >= 2;
  const canContinue = selected.length > 0 && otherOk;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Quem e seu publico-alvo?</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {audiences.map((item, i) => (
          <SelectionCard key={item.label} icon={item.icon} label={item.label} description={item.description} selected={selected.includes(item.label)} onClick={() => onSelect(item.label)} delay={i * 0.04} />
        ))}
      </div>
      <OtherTextField show={selected.includes(OTHER_OPTION)} value={otherText} onChange={onOtherTextChange} placeholder="Ex.: medicos, estudantes, nicho fitness..." />
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
        <Button onClick={onNext} disabled={!canContinue} className="gap-2 rounded-full px-6">Continuar <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </motion.div>
  );
}
