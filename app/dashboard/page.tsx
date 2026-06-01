"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Circle, Clock3, GraduationCap, Sparkles, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InfoTip, Term } from "@/components/info-tip";
import { ScoreRing } from "@/components/score-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WelcomeTour } from "@/components/welcome-tour";
import { sampleProfile } from "@/lib/seed/sampleProfile";
import { universities } from "@/lib/seed/universities";
import { generateRoadmap } from "@/lib/roadmap";
import { calculateOverallReadiness, generateGapAnalysis, generateWeeklyActions } from "@/lib/scoring";
import { loadRoadmap, saveRoadmap, useProfile } from "@/lib/storage";
import type { RoadmapTask } from "@/lib/types";
import { getUniversityInitials, getUniversityLogoUrl } from "@/lib/university-assets";

const focusModes = [
  { id: "proof", label: "Build proof", detail: "Make one achievement visible." },
  { id: "school", label: "Tune fit", detail: "Connect goals to target schools." },
  { id: "week", label: "Win the week", detail: "Finish the next useful task." }
];

export default function DashboardPage() {
  const { profile, setProfile } = useProfile();
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [doneActions, setDoneActions] = useState<string[]>([]);
  const [focus, setFocus] = useState(focusModes[0].id);

  const targetUniversities = useMemo(
    () => universities.filter((university) => profile.dreamUniversities.includes(university.id)),
    [profile.dreamUniversities]
  );
  const readiness = useMemo(() => calculateOverallReadiness(profile, targetUniversities), [profile, targetUniversities]);
  const gapAnalysis = useMemo(() => generateGapAnalysis(profile, targetUniversities), [profile, targetUniversities]);
  const weeklyActions = useMemo(() => generateWeeklyActions(profile, gapAnalysis).slice(0, 3), [profile, gapAnalysis]);
  const weakScores = [
    ["Proof", readiness.projectsAndProof.numeric],
    ["Awards", readiness.awards.numeric],
    ["Leadership", readiness.leadership.numeric],
    ["Tests", readiness.tests.numeric],
    ["Activities", readiness.extracurricularDepth.numeric]
  ]
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .slice(0, 3);

  useEffect(() => {
    const stored = loadRoadmap();
    if (stored.length) {
      setTasks(stored);
      return;
    }
    const generated = generateRoadmap(profile, targetUniversities, gapAnalysis);
    setTasks(generated);
    saveRoadmap(generated);
  }, [gapAnalysis, profile, targetUniversities]);

  const completed = tasks.filter((task) => task.completed).length;
  const nextTask = tasks.find((task) => !task.completed);
  const topTargets = targetUniversities.slice(0, 5);
  const activeFocus = focusModes.find((item) => item.id === focus) ?? focusModes[0];

  function toggleAction(id: string) {
    setDoneActions((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function useDemoProfile() {
    const demoTargets = universities.filter((university) => sampleProfile.dreamUniversities.includes(university.id));
    const demoGaps = generateGapAnalysis(sampleProfile, demoTargets);
    const demoRoadmap = generateRoadmap(sampleProfile, demoTargets, demoGaps);
    setProfile(sampleProfile);
    setTasks(demoRoadmap);
    saveRoadmap(demoRoadmap);
    setDoneActions([]);
  }

  return (
    <AppShell title="Command" subtitle="A weekly operating layer for building real evidence toward ambitious universities.">
      <WelcomeTour onUseDemoProfile={useDemoProfile} />
      <div className="grid min-w-0 gap-5">
        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="hero-metal">
            <div className="relative z-10 grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_250px] md:p-8">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span className="metal-chip">Live roadmap</span>
                  <span className="metal-chip">{profile.weeklyAvailableHours}h/week</span>
                  <span className="metal-chip">{targetUniversities.length || 0} target schools</span>
                </div>
                <h2 className="mt-6 max-w-3xl break-words text-3xl font-bold tracking-normal md:text-5xl">
                  Turn {topTargets[0]?.name ?? "your dream school"} into the next proof-backed move.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  Admitify reads your goals, profile, and evidence, then keeps the week focused on work a real student can actually complete.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/roadmap">
                    <Button variant="accent">
                      Open roadmap
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/universities">
                    <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      Edit dream schools
                    </Button>
                  </Link>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Focus", activeFocus.label],
                    ["Gap", gapAnalysis.biggestGap],
                    ["Next", nextTask?.category ?? "Proof"]
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-white/[0.08] p-3 backdrop-blur">
                      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid place-items-center rounded-lg border border-white/10 bg-white/[0.08] p-5 backdrop-blur">
                <ScoreRing score={readiness.overall.numeric} />
                <p className="mt-3 inline-flex items-center gap-1.5 text-center text-xs font-medium uppercase text-slate-300">
                  Readiness score
                  <InfoTip label="Dream Fit Readiness Score">
                    A planning score for profile strength against your goals. It is not a result prediction.
                  </InfoTip>
                </p>
              </div>
            </div>
          </div>

          <Card className="interactive-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">Next best move</p>
                  <h3 className="mt-3 text-xl font-semibold text-slate-950">{nextTask?.title ?? "Add your first roadmap task"}</h3>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-50 text-cyan-800">
                  <Target className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-md border bg-white/70 px-3 py-2 text-sm text-muted-foreground">
                <Clock3 className="h-4 w-4 text-cyan-700" />
                {nextTask?.estimatedHours ?? 2} focused hours
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Roadmap progress</span>
                  <span>{tasks.length ? Math.round((completed / tasks.length) * 100) : 0}%</span>
                </div>
                <Progress value={tasks.length ? (completed / tasks.length) * 100 : 0} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="interactive-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-kicker">Focus mode</p>
                  <h3 className="mt-2 text-xl font-semibold">{activeFocus.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{activeFocus.detail}</p>
                </div>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {focusModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setFocus(mode.id)}
                    className={`rounded-md border px-3 py-3 text-left text-sm transition ${
                      focus === mode.id ? "border-slate-950 bg-slate-950 text-white shadow-metal" : "bg-white/[0.72] hover:bg-white"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-lg border bg-white/70 p-4 shadow-sm">
                <p className="text-sm font-semibold">
                  <Term label="Gap to close">A gap is the difference between your current profile and what your goals may require you to build.</Term>:{" "}
                  {gapAnalysis.biggestGap}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{gapAnalysis.gaps[0]?.nextStep}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="interactive-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-kicker">Do these first</p>
                  <h3 className="mt-2 text-xl font-semibold">3 actions, not 30</h3>
                </div>
                <Link href="/roadmap">
                  <Button variant="ghost" size="sm">
                    Full plan
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-4 grid gap-3">
                {weeklyActions.map((action) => {
                  const done = doneActions.includes(action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => toggleAction(action.id)}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${
                        done ? "border-emerald-200 bg-emerald-50" : "bg-white/[0.72] hover:border-cyan-700/35 hover:bg-white"
                      }`}
                    >
                      {done ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <Circle className="mt-0.5 h-5 w-5 text-muted-foreground" />}
                      <span>
                        <span className="block font-semibold">{action.title}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">{action.estimatedHours} hours</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-kicker">
                    <Term label="Dream schools">Universities you want to plan toward. Admitify uses them for fit, gaps, and roadmap priorities.</Term>
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">Your target set</h3>
                </div>
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                {topTargets.map((university) => {
                  const logo = getUniversityLogoUrl(university);
                  return (
                    <div key={university.id} className="min-w-44 rounded-lg border bg-white/[0.72] p-4 shadow-sm backdrop-blur">
                      <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-lg border bg-white">
                        {logo ? (
                          <Image src={logo} alt="" width={30} height={30} unoptimized className="object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-primary">{getUniversityInitials(university.name)}</span>
                        )}
                      </div>
                      <p className="mt-3 truncate text-sm font-semibold">{university.name}</p>
                      <p className="text-xs text-muted-foreground">{university.country}</p>
                    </div>
                  );
                })}
                <Link href="/universities" className="grid min-w-44 place-items-center rounded-lg border border-dashed bg-white/[0.65] p-4 text-sm font-semibold text-muted-foreground transition hover:border-cyan-700/40 hover:bg-white">
                  Add school
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="section-kicker">
                    <Term label="Weakest areas">The readiness categories where one improvement could help your profile the most.</Term>
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">Improve these</h3>
                </div>
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-5 space-y-4">
                {weakScores.map(([label, value]) => (
                  <div key={label as string}>
                    <div className="mb-2 flex justify-between text-sm font-medium">
                      <span>{label}</span>
                      <span>{value}/100</span>
                    </div>
                    <Progress value={Number(value)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
