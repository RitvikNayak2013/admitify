"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, GraduationCap, ListChecks, ShieldCheck, Sparkles, X } from "lucide-react";
import { Term } from "@/components/info-tip";
import { Button } from "@/components/ui/button";

const tourKey = "admitify.tour.seen";

const tourSteps = [
  {
    title: "Set the target",
    body: "Choose the universities and major you care about. Admitify turns that goal into a planning lens, not a prediction.",
    studentAction: "Pick 2-5 serious targets.",
    appAction: "Map fit signals and gaps.",
    icon: GraduationCap,
    term: {
      label: "Fit",
      help: "Fit means how well your interests, academics, activities, and proof connect to a university or program."
    }
  },
  {
    title: "Create evidence",
    body: "The plan points toward visible work: a project, score report, competition result, case study, link, or documented impact.",
    studentAction: "Complete one proof task.",
    appAction: "Track evidence quality.",
    icon: ListChecks,
    term: {
      label: "Proof",
      help: "Proof is evidence that a claim is real, such as a GitHub repo, certificate, video, transcript, article, or measurable result."
    }
  },
  {
    title: "Use AI carefully",
    body: "The coach gives specific next steps while refusing fake achievements, dishonest essays, and guaranteed-outcome language.",
    studentAction: "Ask one specific question.",
    appAction: "Protect credits and ethics.",
    icon: ShieldCheck,
    term: {
      label: "Readiness",
      help: "Readiness is a planning score for profile strength. It is not an admission prediction."
    }
  }
];

export function WelcomeTour({ onUseDemoProfile }: { onUseDemoProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const active = tourSteps[step];
  const Icon = active.icon;

  useEffect(() => {
    try {
      const forceTour = new URLSearchParams(window.location.search).get("tour") === "1";
      setOpen(forceTour || window.localStorage.getItem(tourKey) !== "true");
    } catch {
      setOpen(true);
    }
  }, []);

  function closeTour() {
    try {
      window.localStorage.setItem(tourKey, "true");
    } catch {
      // Ignore private browsing/localStorage failures.
    }
    setOpen(false);
  }

  function useDemo() {
    onUseDemoProfile();
    closeTour();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="w-full max-w-5xl overflow-hidden rounded-lg border border-white/20 bg-white shadow-metal-lg"
      >
        <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
          <div className="hero-metal rounded-none border-0 p-6 text-white shadow-none md:p-8">
            <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/10 text-cyan-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <button onClick={closeTour} className="grid h-9 w-9 place-items-center rounded-md border border-white/15 text-slate-300 hover:bg-white/10" aria-label="Close tour">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-8 text-sm font-semibold uppercase text-cyan-200">Admitify</p>
            <h2 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl">Your dream-school plan, made concrete.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Start with a goal. Leave with a weekly roadmap, a proof vault, and an AI coach that keeps the advice practical and honest.
            </p>
            <div className="mt-6 grid gap-3 text-sm leading-6 text-slate-200">
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                <span className="font-semibold text-white">Student?</span> Start onboarding and make your own plan.
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                <span className="font-semibold text-white">Judge or guest?</span> Use the demo profile and explore the full product in under a minute.
              </div>
            </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 md:p-8">
            <div className="flex gap-2">
              {tourSteps.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => setStep(index)}
                  className={`h-2 flex-1 rounded-full transition ${index <= step ? "bg-gradient-to-r from-cyan-700 to-amber-400" : "bg-slate-200"}`}
                  aria-label={`Go to tour step ${index + 1}`}
                />
              ))}
            </div>

            <motion.div key={active.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className="mt-8">
              <div className="grid h-12 w-12 place-items-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-800 shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-normal text-slate-950">{active.title}</h3>
              <p className="mt-3 min-h-14 text-sm leading-7 text-muted-foreground">{active.body}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-white/70 p-4 shadow-sm">
                  <p className="section-kicker">You do</p>
                  <p className="mt-2 text-sm font-semibold">{active.studentAction}</p>
                </div>
                <div className="rounded-lg border bg-white/70 p-4 shadow-sm">
                  <p className="section-kicker">Admitify does</p>
                  <p className="mt-2 text-sm font-semibold">{active.appAction}</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
                <Term label={active.term.label}>{active.term.help}</Term>
              </div>
            </motion.div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>
                Back
              </Button>
              {step < tourSteps.length - 1 ? (
                <Button onClick={() => setStep((current) => Math.min(tourSteps.length - 1, current + 1))}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={useDemo} variant="accent">
                  Use demo profile
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link href="/onboarding" onClick={closeTour}>
                <Button className="w-full" variant="outline">
                  I am a student
                </Button>
              </Link>
              <Button variant="ghost" className="w-full" onClick={closeTour}>
                Explore dashboard
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
