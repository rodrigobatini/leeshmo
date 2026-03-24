"use client";

import { HomePricingSection } from "@/components/home/HomePricingSection";
import { MarketingHeader } from "@/components/home/MarketingHeader";

export default function PlanosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex flex-1 flex-col items-center px-6 py-12 pb-24">
        <div className="w-full max-w-4xl">
          <HomePricingSection />
        </div>
      </main>
    </div>
  );
}
