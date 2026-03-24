"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignInButton, useAuth } from "@clerk/nextjs";
import {
  clearOnboardingProgress,
  loadOnboardingProgress,
  saveOnboardingProgress,
  type OnboardingProgressSnapshot,
} from "@/lib/onboarding-progress";
import { buildProfileFromOnboardingSelections } from "@/lib/build-generate-profile";
import { ONBOARDING_DONE_KEY } from "@/lib/onboarding";
import type { OnboardingSelections } from "@/lib/onboarding-store";
import { CHANNEL_NONE, OTHER_MONETIZATION, OTHER_OPTION } from "@/lib/onboarding-constants";
import StepProgress from "@/components/onboarding/StepProgress";
import StepWelcome from "@/components/onboarding/StepWelcome";
import StepBusinessInfo from "@/components/onboarding/StepBusinessInfo";
import StepBusinessType from "@/components/onboarding/StepBusinessType";
import StepAudience from "@/components/onboarding/StepAudience";
import StepMonetization from "@/components/onboarding/StepMonetization";
import StepChannels from "@/components/onboarding/StepChannels";
import StepGoals from "@/components/onboarding/StepGoals";
import StepFrequency from "@/components/onboarding/StepFrequency";
import StepNicheContext from "@/components/onboarding/StepNicheContext";
import StepGenerating from "@/components/onboarding/StepGenerating";
import StepInsightsReview from "@/components/onboarding/StepInsightsReview";
import { Button } from "@/components/ui/button";

type GenerateResponse = {
  personas: Array<{ name: string; objective: string; pain: string; tone: string }>;
  drafts: Array<{ title: string; channel: string; cta: string; body: string }>;
  paths: string[];
  persisted?: boolean;
  storage?: string;
  generationSource?: "openrouter" | "mock";
};

const TOTAL_STEPS = 8;
const stepLabels = ["Seu negocio", "Tipo", "Publico", "Monetizacao", "Canais", "Objetivos", "Frequencia", "Nicho e voz"];

function buildProgressSnapshot(
  step: number,
  businessInfo: { name: string; description: string; website: string },
  businessTypes: string[],
  audience: string[],
  monetization: string[],
  channels: string[],
  goals: string[],
  frequency: string,
  businessTypesOther: string,
  audienceOther: string,
  monetizationOther: string,
  goalsOther: string,
  nicheLine: string,
  verticalSegments: string[],
  verticalOther: string,
  referenceHint: string,
  avoidHint: string,
  visualStyleTags: string[],
  generated: GenerateResponse | null,
  selectedTrends: string[],
  selectedStrategies: string[],
  selectedPersonas: string[],
): OnboardingProgressSnapshot {
  return {
    v: 1,
    flowVersion: 2,
    step,
    businessInfo,
    businessTypes,
    audience,
    monetization,
    channels,
    goals,
    frequency,
    businessTypesOther,
    audienceOther,
    monetizationOther,
    goalsOther,
    nicheLine,
    verticalSegments,
    verticalOther,
    referenceHint,
    avoidHint,
    visualStyleTags,
    generated,
    selectedTrends,
    selectedStrategies,
    selectedPersonas,
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState(0);
  const [generated, setGenerated] = useState<GenerateResponse | null>(null);
  const [selectedTrends, setSelectedTrends] = useState<string[]>([]);
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);

  const [businessInfo, setBusinessInfo] = useState({ name: "", description: "", website: "" });
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [audience, setAudience] = useState<string[]>([]);
  const [monetization, setMonetization] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("");

  const [businessTypesOther, setBusinessTypesOther] = useState("");
  const [audienceOther, setAudienceOther] = useState("");
  const [monetizationOther, setMonetizationOther] = useState("");
  const [goalsOther, setGoalsOther] = useState("");

  const [nicheLine, setNicheLine] = useState("");
  const [verticalSegments, setVerticalSegments] = useState<string[]>([]);
  const [verticalOther, setVerticalOther] = useState("");
  const [referenceHint, setReferenceHint] = useState("");
  const [avoidHint, setAvoidHint] = useState("");
  const [visualStyleTags, setVisualStyleTags] = useState<string[]>([]);

  useEffect(() => {
    if (!businessTypes.includes(OTHER_OPTION)) setBusinessTypesOther("");
  }, [businessTypes]);
  useEffect(() => {
    if (!audience.includes(OTHER_OPTION)) setAudienceOther("");
  }, [audience]);
  useEffect(() => {
    if (!monetization.includes(OTHER_MONETIZATION)) setMonetizationOther("");
  }, [monetization]);
  useEffect(() => {
    if (!goals.includes(OTHER_OPTION)) setGoalsOther("");
  }, [goals]);
  useEffect(() => {
    if (!verticalSegments.includes(OTHER_OPTION)) setVerticalOther("");
  }, [verticalSegments]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!userId) {
      setHydrated(true);
      return;
    }
    const saved = loadOnboardingProgress(userId);
    if (saved) {
      let nextStep = saved.step;
      const legacy = saved.flowVersion !== 2;
      if (legacy) {
        if (saved.step === 8 && saved.generated) nextStep = 10;
        else if (saved.step === 9) nextStep = 10;
      }
      setStep(nextStep);
      setBusinessInfo(saved.businessInfo);
      setBusinessTypes(saved.businessTypes);
      setAudience(saved.audience);
      setMonetization(saved.monetization);
      setChannels(saved.channels);
      setGoals(saved.goals);
      setFrequency(saved.frequency);
      setBusinessTypesOther(saved.businessTypesOther ?? "");
      setAudienceOther(saved.audienceOther ?? "");
      setMonetizationOther(saved.monetizationOther ?? "");
      setGoalsOther(saved.goalsOther ?? "");
      setNicheLine(saved.nicheLine ?? "");
      setVerticalSegments(saved.verticalSegments ?? []);
      setVerticalOther(saved.verticalOther ?? "");
      setReferenceHint(saved.referenceHint ?? "");
      setAvoidHint(saved.avoidHint ?? "");
      setVisualStyleTags(saved.visualStyleTags ?? []);
      setGenerated(saved.generated);
      setSelectedTrends(Array.isArray(saved.selectedTrends) ? saved.selectedTrends : []);
      setSelectedStrategies(Array.isArray(saved.selectedStrategies) ? saved.selectedStrategies : []);
      setSelectedPersonas(Array.isArray(saved.selectedPersonas) ? saved.selectedPersonas : []);
    }
    setHydrated(true);
  }, [isLoaded, isSignedIn, userId]);

  useEffect(() => {
    if (!hydrated || !isSignedIn || !userId) return;
    saveOnboardingProgress(
      userId,
      buildProgressSnapshot(
        step,
        businessInfo,
        businessTypes,
        audience,
        monetization,
        channels,
        goals,
        frequency,
        businessTypesOther,
        audienceOther,
        monetizationOther,
        goalsOther,
        nicheLine,
        verticalSegments,
        verticalOther,
        referenceHint,
        avoidHint,
        visualStyleTags,
        generated,
        selectedTrends,
        selectedStrategies,
        selectedPersonas,
      ),
    );
  }, [
    hydrated,
    isSignedIn,
    userId,
    step,
    businessInfo,
    businessTypes,
    audience,
    monetization,
    channels,
    goals,
    frequency,
    businessTypesOther,
    audienceOther,
    monetizationOther,
    goalsOther,
    nicheLine,
    verticalSegments,
    verticalOther,
    referenceHint,
    avoidHint,
    visualStyleTags,
    generated,
    selectedTrends,
    selectedStrategies,
    selectedPersonas,
  ]);

  const toggleMultiSelect = useCallback((list: string[], setter: (v: string[]) => void) => (value: string) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }, []);

  const toggleVertical = useCallback((label: string) => {
    setVerticalSegments((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  }, []);

  const toggleVisual = useCallback((id: string) => {
    setVisualStyleTags((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const toggleChannel = useCallback((value: string) => {
    setChannels((prev) => {
      if (value === CHANNEL_NONE) {
        if (prev.includes(CHANNEL_NONE) && prev.length === 1) return [];
        return [CHANNEL_NONE];
      }
      const withoutNone = prev.filter((c) => c !== CHANNEL_NONE);
      if (withoutNone.includes(value)) return withoutNone.filter((c) => c !== value);
      return [...withoutNone, value];
    });
  }, []);

  const maxStep = TOTAL_STEPS + 2;
  const next = () => setStep((s) => Math.min(s + 1, maxStep));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const isFormStep = step >= 1 && step <= TOTAL_STEPS;

  async function handleGenerate() {
    const selectionsSnapshot: OnboardingSelections = {
      businessName: businessInfo.name,
      businessDescription: businessInfo.description,
      businessTypes,
      businessTypesOther,
      audience,
      audienceOther,
      monetization,
      monetizationOther,
      channels,
      goals,
      goalsOther,
      frequency,
      nicheLine,
      verticalSegments,
      verticalOther,
      referenceHint,
      avoidHint,
      visualStyleTags,
      selectedTrends: [],
      selectedStrategies: [],
      selectedPersonas: [],
      generatedPersonas: [],
      generatedDrafts: [],
      generatedPaths: [],
    };
    const profile = buildProfileFromOnboardingSelections(selectionsSnapshot);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ profile }),
    });
    if (!response.ok) {
      let message = "Nao foi possivel gerar sua estrategia agora. Tente novamente.";
      try {
        const j = (await response.json()) as { error?: string };
        if (response.status === 401) message = "Sua sessao expirou ou voce nao esta autenticado. Entre novamente.";
        else if (response.status === 429) {
          message =
            typeof j?.error === "string"
              ? j.error
              : "Voce chegou ao limite de geracoes de hoje. Volte amanha ou revise seu plano.";
        } else if (typeof j?.error === "string") message = j.error;
      } catch {
        /* ignore */
      }
      const err = new Error(message) as Error & { status?: number };
      err.status = response.status;
      throw err;
    }
    const output = (await response.json()) as GenerateResponse;
    setGenerated(output);
    window.localStorage.setItem(ONBOARDING_DONE_KEY, "true");
  }

  if (isLoaded && isSignedIn && !hydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Carregando seu progresso...</p>
      </div>
    );
  }

  if (isLoaded && !isSignedIn) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4">
        <div className="glass-card w-full p-8 text-center">
          <h2 className="mb-2 text-2xl font-semibold">Entre para iniciar o onboarding</h2>
          <p className="mb-4 text-sm text-muted-foreground">Precisamos da sua sessao para gerar e salvar sua estrategia personalizada.</p>
          <SignInButton mode="modal">
            <Button>Entrar com Clerk</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] min-h-screen flex-col bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
        <span className="gradient-text text-xl font-bold tracking-tight">Leeshmo</span>
        {isFormStep ? <span className="text-xs font-medium text-muted-foreground">Passo {step} de {TOTAL_STEPS}</span> : null}
      </header>
      <main className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-6">
        <div className="flex w-full max-w-2xl flex-col">
          {isFormStep ? <StepProgress currentStep={step - 1} totalSteps={TOTAL_STEPS} stepLabels={stepLabels} /> : null}
          <AnimatePresence mode="wait">
            {step === 0 ? <StepWelcome key="welcome" onNext={next} /> : null}
            {step === 1 ? <StepBusinessInfo key="info" data={businessInfo} onChange={setBusinessInfo} onNext={next} onBack={back} /> : null}
            {step === 2 ? (
              <StepBusinessType
                key="business"
                selected={businessTypes}
                onSelect={toggleMultiSelect(businessTypes, setBusinessTypes)}
                otherText={businessTypesOther}
                onOtherTextChange={setBusinessTypesOther}
                onNext={next}
                onBack={back}
              />
            ) : null}
            {step === 3 ? (
              <StepAudience
                key="audience"
                selected={audience}
                onSelect={toggleMultiSelect(audience, setAudience)}
                otherText={audienceOther}
                onOtherTextChange={setAudienceOther}
                onNext={next}
                onBack={back}
              />
            ) : null}
            {step === 4 ? (
              <StepMonetization
                key="monetization"
                selected={monetization}
                onSelect={toggleMultiSelect(monetization, setMonetization)}
                otherText={monetizationOther}
                onOtherTextChange={setMonetizationOther}
                onNext={next}
                onBack={back}
              />
            ) : null}
            {step === 5 ? <StepChannels key="channels" selected={channels} onSelect={toggleChannel} onNext={next} onBack={back} /> : null}
            {step === 6 ? (
              <StepGoals
                key="goals"
                selected={goals}
                onSelect={toggleMultiSelect(goals, setGoals)}
                otherText={goalsOther}
                onOtherTextChange={setGoalsOther}
                onNext={next}
                onBack={back}
              />
            ) : null}
            {step === 7 ? <StepFrequency key="frequency" selected={frequency} onSelect={setFrequency} onNext={next} onBack={back} /> : null}
            {step === 8 ? (
              <StepNicheContext
                key="niche"
                nicheLine={nicheLine}
                onNicheLineChange={setNicheLine}
                verticalSegments={verticalSegments}
                onToggleVertical={toggleVertical}
                verticalOther={verticalOther}
                onVerticalOtherChange={setVerticalOther}
                referenceHint={referenceHint}
                onReferenceHintChange={setReferenceHint}
                avoidHint={avoidHint}
                onAvoidHintChange={setAvoidHint}
                visualStyleTags={visualStyleTags}
                onToggleVisual={toggleVisual}
                onNext={next}
                onBack={back}
              />
            ) : null}
            {step === 9 ? (
              <StepGenerating
                key="generating"
                data={{
                  businessInfo,
                  businessTypes,
                  businessTypesOther,
                  audience,
                  audienceOther,
                  monetization,
                  monetizationOther,
                  channels,
                  goals,
                  goalsOther,
                  frequency,
                }}
                onGenerate={handleGenerate}
                onFinish={next}
                onQuotaBack={() => setStep(8)}
              />
            ) : null}
            {step === 10 ? (
              <StepInsightsReview
                key="insights"
                businessName={businessInfo.name}
                generated={generated ?? undefined}
                onboardingData={{
                  businessName: businessInfo.name,
                  businessDescription: businessInfo.description,
                  businessTypes,
                  businessTypesOther,
                  audience,
                  audienceOther,
                  monetization,
                  monetizationOther,
                  channels,
                  goals,
                  goalsOther,
                  frequency,
                  nicheLine,
                  verticalSegments,
                  verticalOther,
                  referenceHint,
                  avoidHint,
                  visualStyleTags,
                }}
                selectedTrends={selectedTrends}
                selectedStrategies={selectedStrategies}
                selectedPersonas={selectedPersonas}
                onSelectedTrendsChange={setSelectedTrends}
                onSelectedStrategiesChange={setSelectedStrategies}
                onSelectedPersonasChange={setSelectedPersonas}
                onFinish={() => {
                  clearOnboardingProgress(userId);
                  router.push("/dashboard");
                }}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
