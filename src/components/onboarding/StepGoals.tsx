import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GOAL_OPTIONS } from "@/lib/insights-options";
import { OTHER_OPTION } from "@/lib/onboarding-constants";
import SelectionCard from "./SelectionCard";
import OtherTextField from "./OtherTextField";

interface StepGoalsProps {
  selected: string[];
  onSelect: (value: string) => void;
  otherText: string;
  onOtherTextChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepGoals({ selected, onSelect, otherText, onOtherTextChange, onNext, onBack }: StepGoalsProps) {
  const otherOk = !selected.includes(OTHER_OPTION) || otherText.trim().length >= 2;
  const canContinue = selected.length > 0 && otherOk;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="mx-auto max-w-2xl">
      <div className="mb-8 text-center"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Quais sao seus objetivos?</h2></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GOAL_OPTIONS.map((goal, i) => (
          <SelectionCard key={goal.label} icon={goal.icon} label={goal.label} description={goal.description} selected={selected.includes(goal.label)} onClick={() => onSelect(goal.label)} delay={i * 0.05} />
        ))}
      </div>
      <OtherTextField show={selected.includes(OTHER_OPTION)} value={otherText} onChange={onOtherTextChange} placeholder="Ex.: parcerias com marcas, comunidade paga..." />
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
        <Button onClick={onNext} disabled={!canContinue} className="gap-2 rounded-full px-6">Continuar <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </motion.div>
  );
}
