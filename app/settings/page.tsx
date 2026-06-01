"use client";

import { Check, RotateCcw, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sampleProfile } from "@/lib/seed/sampleProfile";
import { universities } from "@/lib/seed/universities";
import { resetDemoData, useProfile } from "@/lib/storage";
import { splitList } from "@/lib/utils";

export default function SettingsPage() {
  const { profile, updateProfile, setProfile } = useProfile();

  function toggleUniversity(id: string) {
    updateProfile({
      dreamUniversities: profile.dreamUniversities.includes(id)
        ? profile.dreamUniversities.filter((item) => item !== id)
        : [...profile.dreamUniversities, id]
    });
  }

  return (
    <AppShell title="Settings" subtitle="Edit profile basics, targets, capacity, and application timing.">
      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle>Profile basics</CardTitle>
                <CardDescription>Changes save locally and update readiness calculations across the app.</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  resetDemoData();
                  setProfile(sampleProfile);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset demo data
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Grade or year level</Label>
              <Input value={profile.grade} onChange={(event) => updateProfile({ grade: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={profile.country} onChange={(event) => updateProfile({ country: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Curriculum</Label>
              <Input value={profile.curriculum} onChange={(event) => updateProfile({ curriculum: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Intended major</Label>
              <Input value={profile.intendedMajor} onChange={(event) => updateProfile({ intendedMajor: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Application year</Label>
              <Input
                type="number"
                value={profile.applicationYear}
                onChange={(event) => updateProfile({ applicationYear: Number(event.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Weekly available hours</Label>
              <Input
                type="number"
                value={profile.weeklyAvailableHours}
                onChange={(event) => updateProfile({ weeklyAvailableHours: Number(event.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Target countries</Label>
              <Input value={profile.targetCountries.join(", ")} onChange={(event) => updateProfile({ targetCountries: splitList(event.target.value) })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Current grades</Label>
              <Textarea value={profile.currentGrades} onChange={(event) => updateProfile({ currentGrades: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Strengths</Label>
              <Textarea value={profile.strengths.join(", ")} onChange={(event) => updateProfile({ strengths: splitList(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Weaknesses</Label>
              <Textarea value={profile.weaknesses.join(", ")} onChange={(event) => updateProfile({ weaknesses: splitList(event.target.value) })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dream universities</CardTitle>
            <CardDescription>Selected targets feed the scoring engine, roadmap, and dashboard planning context.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {universities.map((university) => {
              const selected = profile.dreamUniversities.includes(university.id);
              return (
                <button
                  key={university.id}
                  type="button"
                  onClick={() => toggleUniversity(university.id)}
                  className={`rounded-lg border bg-white/[0.72] p-4 text-left shadow-sm transition ${
                    selected ? "border-cyan-700 ring-2 ring-cyan-700/20" : "hover:border-cyan-700/40 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{university.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{university.country}</p>
                    </div>
                    {selected ? (
                      <Badge variant="success">
                        <Check className="mr-1 h-3 w-3" />
                        Selected
                      </Badge>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-950">
              <Save className="h-5 w-5" />
              Local MVP storage
            </CardTitle>
            <CardDescription className="text-emerald-900">
              Admitify currently uses localStorage through a clean storage abstraction, so Supabase can replace it later without redesigning the UI.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </AppShell>
  );
}
