"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Plus, Trash2, WandSparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InfoTip, Term } from "@/components/info-tip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/lib/storage";
import type { Activity } from "@/lib/types";
import { splitList, uid } from "@/lib/utils";

function activityWarnings(activity: Activity, intendedMajor: string) {
  const warnings: string[] = [];
  const text = `${activity.name} ${activity.category} ${activity.role} ${activity.description} ${activity.impactMetrics}`.toLowerCase();
  if (activity.description.length < 60 || /member|club|participant/.test(activity.role.toLowerCase())) warnings.push("Too generic");
  if (!/\d|%|students|users|raised|hours|people|downloads/i.test(activity.impactMetrics)) warnings.push("Needs measurable impact");
  if (activity.evidenceLinks.length === 0 || activity.proofScore < 55) warnings.push("Needs stronger proof");
  const majorTerms = intendedMajor.toLowerCase().split(/\s+/).filter((item) => item.length > 3);
  if (majorTerms.length && !majorTerms.some((term) => text.includes(term))) warnings.push("Weak major link");
  return warnings;
}

function suggestions(activity: Activity) {
  const ideas = [
    "Add one public proof link: page, repository, video, certificate, or case study.",
    "Replace vague responsibility with one result you caused.",
    "Track one metric for the next 4 weeks and update it here."
  ];
  if (activity.leadershipScore < 55) ideas.unshift("Own a concrete subproject, event, curriculum, or team outcome.");
  if (activity.uniquenessScore < 55) ideas.unshift("Narrow this into a more distinctive angle connected to your intended major.");
  return ideas.slice(0, 3);
}

function depthScore(activity: Activity) {
  return Math.round((activity.depthScore + activity.leadershipScore + activity.uniquenessScore + activity.proofScore) / 4);
}

export default function ActivitiesPage() {
  const { profile, updateProfile } = useProfile();
  const [selectedId, setSelectedId] = useState(profile.activities[0]?.id ?? "");

  useEffect(() => {
    if (!profile.activities.some((activity) => activity.id === selectedId)) {
      setSelectedId(profile.activities[0]?.id ?? "");
    }
  }, [profile.activities, selectedId]);

  const selected = useMemo(
    () => profile.activities.find((activity) => activity.id === selectedId) ?? profile.activities[0],
    [profile.activities, selectedId]
  );

  function updateActivity(id: string, patch: Partial<Activity>) {
    updateProfile({
      activities: profile.activities.map((activity) => (activity.id === id ? { ...activity, ...patch } : activity))
    });
  }

  function addActivity() {
    const next: Activity = {
      id: uid("activity"),
      name: "New focused activity",
      category: "Academic",
      role: "Builder",
      startDate: "",
      endDate: "",
      hoursPerWeek: 3,
      impactMetrics: "",
      evidenceLinks: [],
      description: "",
      depthScore: 50,
      leadershipScore: 45,
      uniquenessScore: 45,
      proofScore: 30
    };
    updateProfile({ activities: [next, ...profile.activities] });
    setSelectedId(next.id);
  }

  function removeActivity(id: string) {
    updateProfile({ activities: profile.activities.filter((activity) => activity.id !== id) });
  }

  const warnings = selected ? activityWarnings(selected, profile.intendedMajor) : [];
  const selectedDepth = selected ? depthScore(selected) : 0;

  return (
    <AppShell title="Activities" subtitle="Strengthen one meaningful activity at a time.">
      <div className="grid min-w-0 gap-5">
        <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-soft">
          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge variant="warning">Depth over clutter</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-normal">Make activities prove impact.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Select an activity, tighten the story, add proof, and improve one score at a time.
              </p>
            </div>
            <Button variant="accent" onClick={addActivity}>
              <Plus className="h-4 w-4" />
              Add activity
            </Button>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 2xl:grid-cols-[340px_minmax(0,1fr)]">
          <Card>
            <CardContent className="p-3">
              <div className="grid gap-2">
                {profile.activities.map((activity) => {
                  const active = activity.id === selected?.id;
                  const warningsForActivity = activityWarnings(activity, profile.intendedMajor);
                  return (
                    <button
                      key={activity.id}
                      onClick={() => setSelectedId(activity.id)}
                      className={`rounded-md border p-3 text-left transition ${
                        active ? "border-slate-950 bg-slate-950 text-white" : "bg-white hover:border-primary/40 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block truncate text-sm font-semibold">{activity.name}</span>
                      <span className={`mt-1 flex items-center justify-between text-xs ${active ? "text-slate-300" : "text-muted-foreground"}`}>
                        <span>{activity.role}</span>
                        <span>Depth {depthScore(activity)}</span>
                      </span>
                      {warningsForActivity.length ? (
                        <span className={`mt-2 block text-xs ${active ? "text-amber-200" : "text-amber-700"}`}>
                          {warningsForActivity.length} improvement{warningsForActivity.length > 1 ? "s" : ""}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
                {profile.activities.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Add your first focused activity.</div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {selected ? (
            <Card className="bg-white">
              <CardContent className="grid gap-6 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="section-kicker">Selected activity</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-normal">{selected.name}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant={selectedDepth >= 70 ? "success" : selectedDepth >= 50 ? "warning" : "rose"}>
                        <Term label={`Depth ${selectedDepth}`}>Depth combines commitment, leadership, uniqueness, and proof into one activity-strength signal.</Term>
                      </Badge>
                      {warnings.slice(0, 2).map((warning) => (
                        <Badge key={warning} variant="warning">
                          {warning}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeActivity(selected.id)} aria-label="Remove activity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={selected.name} onChange={(event) => updateActivity(selected.id, { name: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={selected.category} onChange={(event) => updateActivity(selected.id, { category: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={selected.role} onChange={(event) => updateActivity(selected.id, { role: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hours per week</Label>
                    <Input
                      type="number"
                      value={selected.hoursPerWeek}
                      onChange={(event) => updateActivity(selected.id, { hoursPerWeek: Number(event.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="space-y-2">
                    <Label>What you actually do</Label>
                    <Textarea
                      value={selected.description}
                      onChange={(event) => updateActivity(selected.id, { description: event.target.value })}
                      className="min-h-28"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center gap-1.5">
                      Impact metric
                      <InfoTip label="Impact metric">A number or observable result that shows what changed because of your work.</InfoTip>
                    </Label>
                    <Textarea
                      value={selected.impactMetrics}
                      onChange={(event) => updateActivity(selected.id, { impactMetrics: event.target.value })}
                      className="min-h-28"
                      placeholder="Example: taught 24 students, shipped 2 workshops, raised $800..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                    <Label className="inline-flex items-center gap-1.5">
                      Proof links
                      <InfoTip label="Proof links">URLs or documents that verify the activity, result, role, or artifact.</InfoTip>
                    </Label>
                  <Input
                    value={selected.evidenceLinks.join(", ")}
                    onChange={(event) => updateActivity(selected.id, { evidenceLinks: splitList(event.target.value) })}
                    placeholder="https://github.com/..., https://portfolio..."
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                  {[
                    ["Depth", "depthScore"],
                    ["Leadership", "leadershipScore"],
                    ["Uniqueness", "uniquenessScore"],
                    ["Proof", "proofScore"]
                  ].map(([label, key]) => (
                    <div key={key} className="rounded-lg border bg-slate-50 p-3">
                      <div className="mb-2 flex items-center justify-between text-sm font-medium">
                        <span>{label}</span>
                        <span>{selected[key as keyof Activity] as number}</span>
                      </div>
                      <input
                        aria-label={`${label} score`}
                        type="range"
                        min={0}
                        max={100}
                        value={selected[key as keyof Activity] as number}
                        onChange={(event) => updateActivity(selected.id, { [key]: Number(event.target.value) } as Partial<Activity>)}
                        className="w-full accent-teal-700"
                      />
                      <Progress value={selected[key as keyof Activity] as number} className="mt-2" />
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="flex items-center gap-2 font-semibold text-amber-950">
                      <AlertTriangle className="h-4 w-4" />
                      Watch-outs
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(warnings.length ? warnings : ["No major warning"]).map((warning) => (
                        <Badge key={warning} variant={warnings.length ? "warning" : "success"}>
                          {warning}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-emerald-50 p-4">
                    <p className="flex items-center gap-2 font-semibold text-emerald-950">
                      <WandSparkles className="h-4 w-4" />
                      Improve next
                    </p>
                    <div className="mt-3 grid gap-2 text-sm leading-6 text-emerald-900">
                      {suggestions(selected).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
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
