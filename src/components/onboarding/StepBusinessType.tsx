import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTHER_OPTION } from "@/lib/onboarding-constants";
import SelectionCard from "./SelectionCard";
import OtherTextField from "./OtherTextField";

const businessTypes = [
  { icon: "🛍️", label: "E-commerce", description: "Loja online, dropshipping, marketplace" },
  { icon: "🎓", label: "Infoprodutos", description: "Cursos, mentorias, ebooks, comunidades" },
  { icon: "💼", label: "Servicos / Freelancer", description: "Consultoria, design, dev, marketing" },
  { icon: "🏪", label: "Negocio Local", description: "Restaurante, clinica, salao, academia" },
  { icon: "📱", label: "SaaS / App", description: "Software, plataforma, aplicativo" },
  { icon: "🎨", label: "Criador de Conteudo", description: "Influencer, YouTuber, podcaster" },
  { icon: "✏️", label: OTHER_OPTION, description: "Descreva outro tipo de negocio" },
];

interface StepBusinessTypeProps {
  selected: string[];
  onSelect: (value: string) => void;
  otherText: string;
  onOtherTextChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepBusinessType({ selected, onSelect, otherText, onOtherTextChange, onNext, onBack }: StepBusinessTypeProps) {
  const otherOk = !selected.includes(OTHER_OPTION) || otherText.trim().length >= 2;
  const canContinue = selected.length > 0 && otherOk;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Qual e o seu tipo de negocio?</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {businessTypes.map((type, i) => (
          <SelectionCard key={type.label} icon={type.icon} label={type.label} description={type.description} selected={selected.includes(type.label)} onClick={() => onSelect(type.label)} delay={i * 0.05} />
        ))}
      </div>
      <OtherTextField show={selected.includes(OTHER_OPTION)} value={otherText} onChange={onOtherTextChange} placeholder="Ex.: marketplace B2B, franquia..." />
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
        <Button onClick={onNext} disabled={!canContinue} className="gap-2 rounded-full px-6">Continuar <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </motion.div>
  );
}
