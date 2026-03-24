import { motion } from "framer-motion";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function StepProgress({ currentStep, totalSteps, stepLabels }: StepProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="mx-auto mb-9 w-full max-w-xl">
      <div className="mb-3 flex items-center justify-between">
        <motion.span key={currentStep} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold text-foreground">
          {stepLabels[currentStep]}
        </motion.span>
        <span className="tabular-nums text-xs font-medium text-muted-foreground">{currentStep + 1} / {totalSteps}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-hero)" }} initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }} />
      </div>
    </div>
  );
}
