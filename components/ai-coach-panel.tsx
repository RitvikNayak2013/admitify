"use client";

import { BrainCircuit, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AiCoachKind, AiCoachResponse } from "@/lib/ai/types";
import type { StudentProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AiCoachPanel({
  kind,
  profile,
  context,
  title = "GPT-5 strategy coach",
  description = "Generate proof-first guidance for this workspace.",
  prompt,
  className,
  compact = false
}: {
  kind: AiCoachKind;
  profile: StudentProfile;
  context?: unknown;
  title?: string;
  description?: string;
  prompt?: string;
  className?: string;
  compact?: boolean;
}) {
  const [result, setResult] = useState<AiCoachResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function runCoach() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, profile, context, prompt })
      });
      const data = (await response.json()) as AiCoachResponse;
      setResult(data);
    } catch {
      setResult({
        mode: "mock",
        model: "client-fallback",
        title: "AI coach unavailable",
        summary: "The AI coach route could not be reached. Use the deterministic roadmap and keep building proof-backed progress.",
        insights: ["The app is still usable without an API response.", "Focus on evidence quality and measurable impact.", "Retry after checking the dev server or API key."],
        actions: ["Complete one roadmap task.", "Add one vault proof item.", "Review official requirements for one target."],
        cautions: ["Keep every claim honest and verifiable."]
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className={cn("overflow-hidden border-primary/20 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbfa_58%,#fff8e6_100%)] shadow-sm", className)}>
      <CardHeader className={cn("flex-row items-start justify-between gap-4", compact && "p-4")}>
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
        <Badge variant={result?.usageLimited ? "warning" : result?.mode === "openai" ? "success" : "secondary"}>
          {result?.usageLimited ? "Quota protected" : result?.mode === "openai" ? result.model : "GPT-5 ready"}
        </Badge>
      </CardHeader>
      <CardContent className={cn(compact && "p-4 pt-0")}>
        <Button onClick={runCoach} disabled={loading} variant={result ? "outline" : "default"} className="w-full sm:w-auto">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Thinking..." : result ? "Refresh AI guidance" : "Generate AI guidance"}
        </Button>

        {result ? (
          <div className="mt-5 grid gap-4">
            <div className="rounded-lg border bg-white/80 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={result.mode === "openai" ? "success" : "secondary"}>{result.mode === "openai" ? result.model : "Mock fallback"}</Badge>
                <Badge variant="outline">Ethical guardrails on</Badge>
                {result.quota ? (
                  <Badge variant="outline">
                    {result.quota.remainingClient} visitor / {result.quota.remainingGlobal} demo calls left
                  </Badge>
                ) : null}
                {result.usageLimited ? <Badge variant="warning">API key protected</Badge> : null}
              </div>
              <p className="mt-3 font-semibold">{result.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.summary}</p>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <div className="rounded-lg border bg-white/80 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  Insight
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {result.insights.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border bg-white/80 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Next moves
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {result.actions.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border bg-white/80 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Guardrails
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  {result.cautions.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Uses the secure server route with `OPENAI_API_KEY` and falls back to deterministic guidance when no key is present.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
