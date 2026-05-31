"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, ChevronDown, Circle, Clock3, RefreshCcw, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InfoTip, Term } from "@/components/info-tip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { universities } from "@/lib/seed/universities";
import { generateRoadmap } from "@/lib/roadmap";
import { generateGapAnalysis } from "@/lib/scoring";
import { loadRoadmap, saveRoadmap, useProfile } from "@/lib/storage";
import type { RoadmapTask } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const timeframes: RoadmapTask["timeframe"][] = ["This week", "This month", "Next 3 months", "Next 6 months", "Before applications"];

const timeframeHints: Record<RoadmapTask["timeframe"], string> = {
  "This week": "Small, finishable moves.",
  "This month": "Build momentum and proof.",
  "Next 3 months": "Ship visible work.",
  "Next 6 months": "Create external validation.",
  "Before applications": "Audit, verify, and polish."
};

function priorityVariant(priority: RoadmapTask["priority"]): "rose" | "warning" | "secondary" {
  if (priority === "High") return "rose";
  if (priority === "Medium") return "warning";
  return "secondary";
}

function TaskCard({ task, onToggle }: { task: RoadmapTask; onToggle: (id: string) => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-4 transition ${
        task.completed ? "border-emerald-200 bg-emerald-50/80" : "bg-white hover:border-primary/35 hover:shadow-soft"
      }`}
    >
      <div className="flex gap-3">
        <button
          aria-label={`Toggle ${task.title}`}
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border transition ${
            task.completed ? "border-emerald-600 bg-emerald-600 text-white" : "bg-white text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {task.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
            <Badge variant="outline">{task.category}</Badge>
          </div>
          <h3 className="mt-3 text-base font-semibold leading-6">{task.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
              <Clock3 className="h-3.5 w-3.5 text-primary" />
              {task.estimatedHours}h
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              {formatDate(task.deadline)}
            </span>
          </div>
        </div>
      </div>

      <details className="group mt-4 rounded-md border bg-white/70 px-3 py-2">
        <summary className="cursor-pointer list-none text-sm font-semibold text-slate-700">
          Why and proof
          <InfoTip label="Evidence to collect" className="ml-2">
            The files, links, screenshots, documents, or results you should save to make the task verifiable.
          </InfoTip>
          <ChevronDown className="float-right h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
        </summary>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{task.whyItMatters}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {task.evidenceToCollect.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      </details>
    </motion.article>
  );
}

export default function RoadmapPage() {
  const { profile } = useProfile();
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<RoadmapTask["timeframe"]>("This week");
  const targetUniversities = useMemo(
    () => universities.filter((university) => profile.dreamUniversities.includes(university.id)),
    [profile.dreamUniversities]
  );
  const gapAnalysis = useMemo(() => generateGapAnalysis(profile, targetUniversities), [profile, targetUniversities]);

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
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const activeTasks = tasks.filter((task) => task.timeframe === activeTimeframe);
  const activeDone = activeTasks.filter((task) => task.completed).length;
  const nextTasks = tasks.filter((task) => !task.completed).slice(0, 3);

  function setAndSave(next: RoadmapTask[]) {
    setTasks(next);
    saveRoadmap(next);
  }

  function toggleTask(id: string) {
    setAndSave(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  }

  function regenerate() {
    const generated = generateRoadmap(profile, targetUniversities, gapAnalysis);
    setAndSave(generated);
    setActiveTimeframe("This week");
  }

  return (
    <AppShell title="Roadmap" subtitle="Pick one timeframe. Finish the next useful proof-building tasks.">
      <div className="grid min-w-0 gap-5">
        <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-soft">
          <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_260px] md:p-8">
            <div className="min-w-0">
              <Badge variant="warning">Action board</Badge>
              <h2 className="mt-4 max-w-2xl break-words text-3xl font-bold tracking-normal md:text-4xl">
                Work the next milestone, not the whole admissions universe.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                Your roadmap is grouped by time so each session has a clear finish line.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>{progress}% complete</span>
                <span>{profile.weeklyAvailableHours}h/week</span>
              </div>
              <Progress value={progress} className="mt-3 bg-white/15" />
              <Button variant="accent" className="mt-5 w-full" onClick={regenerate}>
                <RefreshCcw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </div>
        </section>

        <Card>
          <CardContent className="p-3">
            <div className="grid gap-2 md:grid-cols-5">
              {timeframes.map((timeframe) => {
                const group = tasks.filter((task) => task.timeframe === timeframe);
                const done = group.filter((task) => task.completed).length;
                const active = activeTimeframe === timeframe;
                return (
                  <button
                    key={timeframe}
                    onClick={() => setActiveTimeframe(timeframe)}
                    className={`rounded-md border p-3 text-left transition ${
                      active ? "border-slate-950 bg-slate-950 text-white shadow-sm" : "bg-white hover:border-primary/40 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{timeframe}</span>
                    <span className={`mt-1 block text-xs ${active ? "text-slate-300" : "text-muted-foreground"}`}>
                      {done}/{group.length} done
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="section-kicker">Current lane</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-normal">{activeTimeframe}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{timeframeHints[activeTimeframe]}</p>
              </div>
              <Badge variant={activeDone === activeTasks.length && activeTasks.length ? "success" : "outline"}>
                {activeDone} of {activeTasks.length} complete
              </Badge>
            </div>

            <motion.div key={activeTimeframe} layout className="grid gap-3">
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </motion.div>
          </div>

          <aside className="grid content-start gap-4">
            <Card className="interactive-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="section-kicker">
                      <Term label="Biggest gap">The area where your profile most needs stronger evidence or clearer progress.</Term>
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{gapAnalysis.biggestGap}</h3>
                  </div>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{gapAnalysis.gaps[0]?.nextStep}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="section-kicker">Up next</p>
                <div className="mt-4 grid gap-3">
                  {nextTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setActiveTimeframe(task.timeframe)}
                      className="rounded-md border bg-white p-3 text-left text-sm transition hover:border-primary/40 hover:bg-slate-50"
                    >
                      <span className="block font-semibold">{task.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{task.timeframe}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </AppShell>
  );
}
