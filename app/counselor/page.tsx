"use client";

import { AlertCircle, Bot, CheckCircle2, Clock3, Gauge, KeyRound, Send, ShieldCheck, Sparkles, User } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/lib/storage";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type CounselorResponse = {
  reply: string;
  mode?: "mock" | "openai";
  model?: string;
  usageLimited?: boolean;
  limitReason?: string;
  retryAfterSeconds?: number;
  quota?: {
    remainingGlobal: number;
    remainingClient: number;
  };
};

type AiStatus = {
  configured: boolean;
  enabled: boolean;
  model: string;
  limits: {
    dailyGlobalLimit: number;
    dailyClientLimit: number;
    minSecondsBetweenClientRequests: number;
    maxOutputTokens: number;
  };
};

const prompts = [
  "What should I do next?",
  "What project should I build for my major?",
  "What should I do this week?",
  "How can I improve my weakest area?"
];

export default function CounselorPage() {
  const { profile } = useProfile();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Tell me what feels unclear, and I’ll help you pick the next honest step: one task, one piece of proof, or one decision to make this week."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [quota, setQuota] = useState<CounselorResponse["quota"]>();
  const [limitReason, setLimitReason] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    fetch("/api/ai/status")
      .then((response) => response.json())
      .then((data: AiStatus) => setAiStatus(data))
      .catch(() => setAiStatus(null));
  }, []);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function send(message: string) {
    const trimmed = message.trim();
    if (!trimmed || loading || cooldown > 0) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setLimitReason("");
    try {
      const response = await fetch("/api/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, profile, history: messages })
      });
      const data = (await response.json()) as CounselorResponse;
      setMessages([...nextMessages, { role: "assistant", content: data.reply ?? "I could not generate a response. Try one smaller, specific question." }]);
      setQuota(data.quota);
      if (data.usageLimited || data.limitReason) {
        setLimitReason(data.limitReason ?? "AI quota protection is active.");
      }
      if (data.retryAfterSeconds) {
        setCooldown(data.retryAfterSeconds);
      }
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            "I could not reach the counselor route, so here is the practical move: choose one roadmap task, complete a proof artifact, and update your profile strength after you have evidence."
        }
      ]);
      setLimitReason("The AI route was unavailable, so Admitify used fallback guidance.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <AppShell title="Coach" subtitle="A practical mentor for the next honest step.">
      <div className="grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="min-h-[700px]">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Admitify Coach</CardTitle>
                <CardDescription>Ask a normal question. The answer should feel like a good counselor, not a brochure.</CardDescription>
              </div>
              <Badge variant={aiStatus?.configured && aiStatus.enabled ? "success" : "warning"}>
                {aiStatus?.configured && aiStatus.enabled ? "OpenAI ready" : "Key needed"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[570px] flex-col">
            <div
              className={`mb-4 rounded-lg border p-4 ${
                aiStatus?.configured && aiStatus.enabled ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {aiStatus?.configured && aiStatus.enabled ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700" />
                )}
                <div>
                  <p className="font-semibold">
                    {aiStatus?.configured && aiStatus.enabled ? "OpenAI is connected" : "OpenAI is not connected yet"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {aiStatus?.configured && aiStatus.enabled
                      ? `Using ${aiStatus.model}. Limits are active so the key is protected.`
                      : "Add your API key to .env.local, restart the server, and the coach will switch from fallback to OpenAI."}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-4 grid gap-3 rounded-lg border bg-slate-50 p-3 md:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-semibold">Ethical coach</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-primary" />
                <span>
                  {quota
                    ? `${quota.remainingClient} visitor / ${quota.remainingGlobal} demo calls left`
                    : aiStatus
                      ? `${aiStatus.limits.dailyClientLimit} visitor / ${aiStatus.limits.dailyGlobalLimit} demo calls`
                      : "Quota protected"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {aiStatus?.configured ? <Clock3 className="h-4 w-4 text-primary" /> : <KeyRound className="h-4 w-4 text-primary" />}
                <span>{cooldown ? `${cooldown}s cooldown` : "Ready to ask"}</span>
              </div>
            </div>
            {limitReason ? (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                {limitReason} Fallback guidance stays available for the demo.
              </div>
            ) : null}
            <div className="scrollbar-soft flex-1 space-y-4 overflow-y-auto rounded-lg border bg-slate-50 p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" ? (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                  ) : null}
                  <div
                    className={`max-w-[82%] whitespace-pre-line rounded-lg border p-3 text-sm leading-6 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-white"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" ? (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-700">
                      <User className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              ))}
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                  Thinking through your profile...
                </div>
              ) : null}
            </div>
            <form onSubmit={submit} className="mt-4 flex flex-col gap-3 md:flex-row">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={cooldown ? `Wait ${cooldown}s before the next request...` : "Ask something like: what should I do this weekend?"}
                className="min-h-20"
                disabled={loading || cooldown > 0}
              />
              <Button type="submit" className="md:h-20 md:w-24" disabled={loading || cooldown > 0}>
                <Send className="h-4 w-4" />
                Ask
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Fast asks</CardTitle>
              <CardDescription>Use these for a clean judging demo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {prompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  className="h-auto w-full justify-start whitespace-normal py-3 text-left"
                  onClick={() => send(prompt)}
                  disabled={loading || cooldown > 0}
                >
                  {prompt}
                </Button>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Credit protection</CardTitle>
              <CardDescription>Server-side quota controls keep your key from being drained.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground">
              <p>Daily demo and per-visitor limits are enforced before any OpenAI call.</p>
              <p>Cooldowns slow repeated clicks, and oversized profile context is truncated.</p>
              <p>When limits are hit, the app uses deterministic fallback advice.</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-950 text-white">
            <CardHeader>
              <CardTitle>Guardrails</CardTitle>
              <CardDescription className="text-slate-300">The counselor is built for real work and honest proof.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
              <p>No guaranteed claims.</p>
              <p>No fake achievements.</p>
              <p>No dishonest essay writing.</p>
              <p>Specific next steps, evidence, and measurable impact.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
