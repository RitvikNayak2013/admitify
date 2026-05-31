"use client";

import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { Term } from "@/components/info-tip";
import { ScoreRing } from "@/components/score-ring";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { universities } from "@/lib/seed/universities";
import { calculateOverallReadiness, generateGapAnalysis } from "@/lib/scoring";
import { useProfile } from "@/lib/storage";

export default function ProfileStrengthPage() {
  const { profile } = useProfile();
  const targetUniversities = useMemo(
    () => universities.filter((university) => profile.dreamUniversities.includes(university.id)),
    [profile.dreamUniversities]
  );
  const readiness = useMemo(() => calculateOverallReadiness(profile, targetUniversities), [profile, targetUniversities]);
  const gapAnalysis = useMemo(() => generateGapAnalysis(profile, targetUniversities), [profile, targetUniversities]);
  const categories = [
    ["Academics", readiness.academics, readiness.weights.academics],
    ["Tests", readiness.tests, readiness.weights.tests],
    ["Extracurricular depth", readiness.extracurricularDepth, readiness.weights.extracurricularDepth],
    ["Awards", readiness.awards, readiness.weights.awards],
    ["Projects and proof", readiness.projectsAndProof, readiness.weights.projectsAndProof],
    ["Leadership", readiness.leadership, readiness.weights.leadership],
    ["Narrative fit", readiness.narrativeFit, readiness.weights.narrativeFit]
  ] as const;
  const radarData = categories.map(([category, result]) => ({ category, score: result.numeric }));

  return (
    <AppShell title="Profile Strength" subtitle="An explainable breakdown of readiness categories and improvement suggestions.">
      <div className="grid gap-5">
        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>
                <Term label="Dream Fit Readiness Score">A planning score for profile strength and fit. It is not an admission prediction.</Term>
              </CardTitle>
              <CardDescription>Readiness and fit only. This is a planning signal, not an outcome forecast.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-5">
              <ScoreRing score={readiness.overall.numeric} />
              <div className="text-center">
                <Badge variant="success">{readiness.overall.label}</Badge>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{readiness.overall.explanation}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Term label="Profile shape">A visual snapshot of where your profile is strong and where it needs more work.</Term>
              </CardTitle>
              <CardDescription>Radar view of your strongest and weakest dimensions.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {categories.map(([category, result, weight]) => (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{category}</CardTitle>
                    <CardDescription>{result.explanation}</CardDescription>
                  </div>
                  <Badge variant={result.numeric < 55 ? "rose" : result.numeric < 72 ? "warning" : "success"}>{result.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between text-sm font-semibold">
                  <span>{result.numeric}/100</span>
                  <span>{weight}% weight</span>
                </div>
                <Progress value={result.numeric} />
                <div className="mt-4 rounded-lg border bg-slate-50 p-4">
                  <p className="text-sm font-semibold">Specific improvement suggestions</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                    {result.recommendedImprovements.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <CardTitle>
              <Term label="Gap analysis">A list of the biggest differences between your current profile and what your goals ask you to build.</Term>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Your academics may be strong while project proof, leadership evidence, or narrative fit still needs work.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {gapAnalysis.gaps.slice(0, 3).map((gap) => (
              <div key={gap.category} className="rounded-lg border border-white/10 bg-white/10 p-4">
                <Badge variant={gap.severity === "High" ? "rose" : gap.severity === "Medium" ? "warning" : "success"}>{gap.severity}</Badge>
                <p className="mt-3 font-semibold">{gap.category}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{gap.nextStep}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
