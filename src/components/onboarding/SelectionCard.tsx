import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

interface SelectionCardProps {
  icon: ReactNode;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}

export default function SelectionCard({ icon, label, description, selected, onClick, delay = 0 }: SelectionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`selection-card w-full text-left ${selected ? "selected" : ""}`}
    >
      {selected ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)]"
        >
          <Check className="h-3 w-3 text-primary-foreground" />
        </motion.div>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-2xl">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          {description ? <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p> : null}
        </div>
      </div>
    </motion.button>
  );
}
