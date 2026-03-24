import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OTHER_MONETIZATION } from "@/lib/onboarding-constants";
import OtherTextField from "./OtherTextField";

const models = [
  { value: "produto-fisico", emoji: "📦", label: "Produto fisico", desc: "E-commerce, loja fisica, marketplace" },
  { value: "produto-digital", emoji: "💎", label: "Produto digital", desc: "Cursos, ebooks, templates, apps" },
  { value: "servico", emoji: "🤝", label: "Servico / Consultoria", desc: "Freelance, agencia, mentoria" },
  { value: "assinatura", emoji: "🔄", label: "Assinatura / SaaS", desc: "Recorrencia mensal ou anual" },
  { value: "ads", emoji: "📢", label: "Ads / Anuncios", desc: "Google, Meta, TikTok Ads, patrocinios" },
  { value: "afiliados", emoji: "🔗", label: "Afiliados", desc: "Links, comissoes, parcerias de perf." },
  { value: "membros", emoji: "💬", label: "Membros / comunidade", desc: "Patreon, assinatura de conteudo, VIP" },
  { value: OTHER_MONETIZATION, emoji: "✏️", label: "Outro", desc: "Outra forma de monetizacao" },
];

interface StepMonetizationProps {
  selected: string[];
  onSelect: (value: string) => void;
  otherText: string;
  onOtherTextChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepMonetization({ selected, onSelect, otherText, onOtherTextChange, onNext, onBack }: StepMonetizationProps) {
  const otherOk = !selected.includes(OTHER_MONETIZATION) || otherText.trim().length >= 2;
  const canContinue = selected.length > 0 && otherOk;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="mx-auto max-w-2xl">
      <div className="mb-8 text-center"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Como voce monetiza?</h2></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {models.map((model, i) => (
          <motion.button key={model.value} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.35 }} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(model.value)} className={`selection-card w-full text-left ${selected.includes(model.value) ? "selected" : ""}`}>
            <div className="flex items-start gap-3"><span className="shrink-0 text-2xl">{model.emoji}</span><div><p className="text-sm font-semibold text-foreground">{model.label}</p><p className="mt-0.5 text-xs text-muted-foreground">{model.desc}</p></div></div>
          </motion.button>
        ))}
      </div>
      <OtherTextField show={selected.includes(OTHER_MONETIZATION)} value={otherText} onChange={onOtherTextChange} placeholder="Ex.: afiliacao, licenciamento, licitacoes..." />
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
        <Button onClick={onNext} disabled={!canContinue} className="gap-2 rounded-full px-6">Continuar <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </motion.div>
  );
}
