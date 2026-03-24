import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepBusinessInfoProps {
  data: { name: string; description: string; website: string };
  onChange: (data: { name: string; description: string; website: string }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepBusinessInfo({ data, onChange, onNext, onBack }: StepBusinessInfoProps) {
  const [focused, setFocused] = useState("");
  const isValid = data.name.trim().length >= 2;

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4 }} className="mx-auto w-full max-w-lg">
      <div className="mb-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Building2 className="h-7 w-7 text-primary" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Conte sobre seu negocio</h2>
      </div>

      <div className="space-y-5">
        <Field label="Nome do negocio *" focused={focused === "name"}>
          <input value={data.name} onChange={(e) => onChange({ ...data, name: e.target.value })} onFocus={() => setFocused("name")} onBlur={() => setFocused("")} placeholder="Ex: Minha Startup" className="w-full bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
        </Field>
        <Field label="Descreva em uma frase" focused={focused === "desc"}>
          <textarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} onFocus={() => setFocused("desc")} onBlur={() => setFocused("")} placeholder="Ex: Ajudo empreendedores..." rows={3} className="w-full resize-none bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
        </Field>
        <Field label="Site ou rede social principal" focused={focused === "web"}>
          <input value={data.website} onChange={(e) => onChange({ ...data, website: e.target.value })} onFocus={() => setFocused("web")} onBlur={() => setFocused("")} placeholder="https://seusite.com ou @perfil" className="w-full bg-transparent px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
        </Field>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Voltar</Button>
        <Button onClick={onNext} disabled={!isValid} className="gap-2 rounded-full px-6">Continuar <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </motion.div>
  );
}

function Field({ label, focused, children }: { label: string; focused: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div className={`relative rounded-xl border-2 transition-all duration-200 ${focused ? "border-primary bg-accent/30" : "border-border bg-card"}`}>{children}</div>
    </div>
  );
}
