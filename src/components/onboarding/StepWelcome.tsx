import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepWelcomeProps {
  onNext: () => void;
}

export default function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex max-w-lg flex-col items-center py-6 text-center sm:py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10"
      >
        <Sparkles className="h-10 w-10 text-primary" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Bem-vindo ao <span className="gradient-text">Leeshmo</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mb-10 text-lg leading-relaxed text-muted-foreground"
      >
        Vamos criar sua estrategia de conteudo em minutos. Sem complicacao, sem formularios chatos.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Button size="lg" onClick={onNext} className="gap-2 rounded-full px-8 py-6 text-base font-semibold">
          Comecar agora
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
