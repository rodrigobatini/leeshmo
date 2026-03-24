"use client";

import { useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const PRICING_SECTION_ID = "pricing";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Same-page link to #pricing — always scrolls (Next/link hash can stop working on repeat clicks). */
export function PricingAnchorLink({ children, className }: Props) {
  const onClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    const el = document.getElementById(PRICING_SECTION_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${PRICING_SECTION_ID}`);
  }, []);

  return (
    <a href={`#${PRICING_SECTION_ID}`} onClick={onClick} className={cn(className)}>
      {children}
    </a>
  );
}
