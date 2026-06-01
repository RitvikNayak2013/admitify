"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, FilePlus2, Link2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InfoTip, Term } from "@/components/info-tip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/lib/storage";
import type { VaultItem } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

const vaultTypes: VaultItem["type"][] = [
  "Certificate",
  "GitHub",
  "Website",
  "Paper",
  "Blog",
  "Video",
  "Photo",
  "Recommendation",
  "Transcript",
  "Test Score",
  "Award",
  "Media"
];

function warningFor(item: VaultItem) {
  const warnings: string[] = [];
  if (!item.link && !item.filePlaceholder) warnings.push("Missing source");
  if (item.description.length < 40) warnings.push("Needs context");
  if (item.strengthScore < 60) warnings.push("Low proof strength");
  return warnings;
}

export default function VaultPage() {
  const { profile, updateProfile } = useProfile();
  const [selectedId, setSelectedId] = useState(profile.vaultItems[0]?.id ?? "");

  useEffect(() => {
    if (!profile.vaultItems.some((item) => item.id === selectedId)) {
      setSelectedId(profile.vaultItems[0]?.id ?? "");
    }
  }, [profile.vaultItems, selectedId]);

  const selected = useMemo(
    () => profile.vaultItems.find((item) => item.id === selectedId) ?? profile.vaultItems[0],
    [profile.vaultItems, selectedId]
  );

  const proofStrength = profile.vaultItems.length
    ? Math.round(profile.vaultItems.reduce((sum, item) => sum + item.strengthScore, 0) / profile.vaultItems.length)
    : 0;

  function addItem() {
    const next: VaultItem = {
      id: uid("vault"),
      title: "New proof item",
      type: "Website",
      relatedActivity: "",
      link: "",
      filePlaceholder: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      strengthScore: 45
    };
    updateProfile({ vaultItems: [next, ...profile.vaultItems] });
    setSelectedId(next.id);
  }

  function updateItem(id: string, patch: Partial<VaultItem>) {
    updateProfile({ vaultItems: profile.vaultItems.map((item) => (item.id === id ? { ...item, ...patch } : item)) });
  }

  function removeItem(id: string) {
    updateProfile({ vaultItems: profile.vaultItems.filter((item) => item.id !== id) });
  }

  const warnings = selected ? warningFor(selected) : [];

  return (
    <AppShell title="Proof Vault" subtitle="Keep the evidence behind your strongest claims.">
      <div className="grid min-w-0 gap-5">
        <section className="hero-metal">
          <div className="relative z-10 grid gap-5 p-6 md:grid-cols-[1fr_220px] md:items-end md:p-8">
            <div>
              <Badge variant="warning">Proof first</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-normal">Save evidence while you build.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                A strong portfolio is not louder. It is easier to verify.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>
                  <Term label="Proof strength">How verifiable and useful your stored evidence is.</Term>
                </span>
                <span>{proofStrength}/100</span>
              </div>
              <Progress value={proofStrength} className="mt-3 bg-white/15" />
              <Button variant="accent" className="mt-5 w-full" onClick={addItem}>
                <FilePlus2 className="h-4 w-4" />
                Add proof
              </Button>
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[340px_minmax(0,1fr)]">
          <Card>
            <CardContent className="p-3">
              <div className="grid gap-2">
                {profile.vaultItems.map((item) => {
                  const active = item.id === selected?.id;
                  const itemWarnings = warningFor(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`rounded-md border p-3 text-left transition ${
                        active ? "border-slate-950 bg-slate-950 text-white shadow-metal" : "bg-white/[0.72] hover:border-cyan-700/40 hover:bg-white"
                      }`}
                    >
                      <span className="block truncate text-sm font-semibold">{item.title}</span>
                      <span className={`mt-1 flex items-center justify-between text-xs ${active ? "text-slate-300" : "text-muted-foreground"}`}>
                        <span>{item.type}</span>
                        <span>{item.strengthScore}/100</span>
                      </span>
                      {itemWarnings.length ? (
                        <span className={`mt-2 block text-xs ${active ? "text-amber-200" : "text-amber-700"}`}>
                          {itemWarnings.length} warning{itemWarnings.length > 1 ? "s" : ""}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
                {profile.vaultItems.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Add proof for your first claim.</div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {selected ? (
            <Card className="bg-white/[0.82]">
              <CardContent className="grid gap-6 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="section-kicker">Selected proof</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-normal">{selected.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant={selected.strengthScore >= 75 ? "success" : selected.strengthScore >= 55 ? "warning" : "rose"}>
                        Strength {selected.strengthScore}
                      </Badge>
                      <Badge variant="secondary">{selected.type}</Badge>
                      <Badge variant="outline">{formatDate(selected.date)}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(selected.id)} aria-label="Remove proof item">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Title</Label>
                    <Input value={selected.title} onChange={(event) => updateItem(selected.id, { title: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={selected.type} onChange={(event) => updateItem(selected.id, { type: event.target.value as VaultItem["type"] })}>
                      {vaultTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" value={selected.date} onChange={(event) => updateItem(selected.id, { date: event.target.value })} />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="space-y-2">
                      <Label className="inline-flex items-center gap-1.5">
                        Source link
                        <InfoTip label="Source link">A URL that lets someone verify the work, result, artifact, or recognition.</InfoTip>
                      </Label>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" value={selected.link} onChange={(event) => updateItem(selected.id, { link: event.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Related activity</Label>
                    <Input value={selected.relatedActivity} onChange={(event) => updateItem(selected.id, { relatedActivity: event.target.value })} />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-2">
                    <Label className="inline-flex items-center gap-1.5">
                      Context
                      <InfoTip label="Context">A short explanation of what the proof shows, what you did, and why it matters.</InfoTip>
                    </Label>
                    <Textarea
                      value={selected.description}
                      onChange={(event) => updateItem(selected.id, { description: event.target.value })}
                      className="min-h-32"
                      placeholder="What is this, what did you do, what result does it verify?"
                    />
                  </div>
                  <div className="rounded-lg border bg-white/70 p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between text-sm font-medium">
                      <span>Strength score</span>
                      <span>{selected.strengthScore}</span>
                    </div>
                    <input
                      aria-label="Strength score"
                      type="range"
                      min={0}
                      max={100}
                      value={selected.strengthScore}
                      onChange={(event) => updateItem(selected.id, { strengthScore: Number(event.target.value) })}
                      className="w-full accent-teal-700"
                    />
                    <Progress value={selected.strengthScore} className="mt-3" />
                    <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
                      <p className="flex items-center gap-2 text-sm font-semibold text-amber-950">
                        <AlertTriangle className="h-4 w-4" />
                        Watch-outs
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(warnings.length ? warnings : ["Looks verifiable"]).map((warning) => (
                          <Badge key={warning} variant={warnings.length ? "warning" : "success"}>
                            {warning}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
