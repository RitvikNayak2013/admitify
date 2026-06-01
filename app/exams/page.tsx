"use client";

import { Check, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { exams } from "@/lib/seed/exams";
import { useProfile } from "@/lib/storage";
import type { ExamPlan } from "@/lib/types";
import { uid } from "@/lib/utils";

function examRecommendedFor(examId: string, major: string, targetCountries: string[]) {
  const exam = exams.find((item) => item.id === examId);
  if (!exam) return false;
  const countryMatch = targetCountries.some((country) => exam.relevantCountries.includes(country));
  const majorMatch = exam.relevantMajors.some((item) => item === "All majors" || major.toLowerCase().includes(item.toLowerCase()));
  return countryMatch && majorMatch;
}

function priorityVariant(priority: string) {
  if (priority === "High") return "rose";
  if (priority === "Medium") return "warning";
  return "secondary";
}

export default function ExamsPage() {
  const { profile, updateProfile } = useProfile();
  const recommended = useMemo(
    () =>
      exams
        .map((exam) => ({
          exam,
          recommended: examRecommendedFor(exam.id, profile.intendedMajor, profile.targetCountries)
        }))
        .sort((a, b) => Number(b.recommended) - Number(a.recommended)),
    [profile.intendedMajor, profile.targetCountries]
  );

  function addPlan(examId: string) {
    const exam = exams.find((item) => item.id === examId);
    const next: ExamPlan = {
      id: uid("exam-plan"),
      examId,
      targetScore: exam?.idealTargetScore.split(";")[0] ?? "",
      testDate: "",
      status: "Planning"
    };
    updateProfile({ plannedExams: [...profile.plannedExams, next] });
  }

  function updatePlan(id: string, patch: Partial<ExamPlan>) {
    updateProfile({
      plannedExams: profile.plannedExams.map((plan) => (plan.id === id ? { ...plan, ...patch } : plan))
    });
  }

  function removePlan(id: string) {
    updateProfile({ plannedExams: profile.plannedExams.filter((plan) => plan.id !== id) });
  }

  return (
    <AppShell title="Exam Planner" subtitle="Recommended exams and target scores based on major and target countries.">
      <div className="grid gap-5">
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Your exam plans</CardTitle>
              <CardDescription>Save target scores, dates, and preparation status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.plannedExams.map((plan) => {
                const exam = exams.find((item) => item.id === plan.examId);
                return (
                  <div key={plan.id} className="rounded-lg border bg-white/70 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{exam?.name ?? plan.examId}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{exam?.preparationTimeline}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removePlan(plan.id)} aria-label="Remove plan">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Target score</Label>
                        <Input value={plan.targetScore} onChange={(event) => updatePlan(plan.id, { targetScore: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Test date</Label>
                        <Input type="date" value={plan.testDate} onChange={(event) => updatePlan(plan.id, { testDate: event.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={plan.status} onChange={(event) => updatePlan(plan.id, { status: event.target.value as ExamPlan["status"] })}>
                          <option>Considering</option>
                          <option>Planning</option>
                          <option>Preparing</option>
                          <option>Completed</option>
                        </Select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="metal-panel">
            <CardHeader>
              <CardTitle className="text-white">Exam strategy</CardTitle>
              <CardDescription className="text-slate-300">
                Prioritize exams that match your target countries, major, language requirements, and available preparation time.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {["Confirm official requirements", "Use diagnostics weekly", "Collect score proof", "Avoid overtesting"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] p-3 text-sm">
                  <Check className="h-4 w-4 text-cyan-200" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          {recommended.map(({ exam, recommended: isRecommended }) => {
            const planned = profile.plannedExams.some((plan) => plan.examId === exam.id);
            return (
              <Card key={exam.id} className={isRecommended ? "border-cyan-700/40 bg-white/[0.82]" : "bg-white/[0.78]"}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{exam.name}</CardTitle>
                      <CardDescription>{exam.preparationTimeline}</CardDescription>
                    </div>
                    <Button variant={planned ? "secondary" : "default"} size="sm" onClick={() => addPlan(exam.id)} disabled={planned}>
                      {planned ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {planned ? "Planned" : "Add"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant={priorityVariant(exam.priority)}>{exam.priority} priority</Badge>
                    <Badge variant="outline">{exam.expectation}</Badge>
                    {isRecommended ? <Badge variant="success">Recommended for you</Badge> : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Relevant countries</p>
                    <p className="mt-1 text-sm">{exam.relevantCountries.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Relevant majors</p>
                    <p className="mt-1 text-sm">{exam.relevantMajors.join(", ")}</p>
                  </div>
                  <div className="rounded-lg border bg-white/70 p-3 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Ideal target score</p>
                    <p className="mt-1 text-sm leading-6">{exam.idealTargetScore}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
