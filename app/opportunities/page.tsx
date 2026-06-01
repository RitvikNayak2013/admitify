"use client";

import { Check, Filter, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { opportunities } from "@/lib/seed/opportunities";
import { useProfile } from "@/lib/storage";
import { formatDate } from "@/lib/utils";

function recommendedBecause(major: string, opportunityMajors: string[]) {
  if (opportunityMajors.includes("All majors")) return "recommended because it can strengthen your general proof and planning discipline.";
  const match = opportunityMajors.find((item) => major.toLowerCase().includes(item.toLowerCase()));
  if (match) return `recommended because it aligns with ${match} and can create evidence for your portfolio.`;
  return "recommended because it can add external validation or a stronger proof artifact.";
}

export default function OpportunitiesPage() {
  const { profile, updateProfile } = useProfile();
  const [type, setType] = useState("All");
  const [major, setMajor] = useState(profile.intendedMajor);
  const [mode, setMode] = useState("All");
  const [age, setAge] = useState("");
  const [deadline, setDeadline] = useState("");

  const filtered = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const typeMatch = type === "All" || opportunity.type === type;
      const majorMatch =
        !major ||
        opportunity.relevantMajors.includes("All majors") ||
        opportunity.relevantMajors.some((item) => item.toLowerCase().includes(major.toLowerCase()) || major.toLowerCase().includes(item.toLowerCase()));
      const modeMatch = mode === "All" || opportunity.mode === mode;
      const deadlineMatch = !deadline || opportunity.deadline <= deadline;
      const ageMatch = !age || opportunity.ageRange.includes(age);
      return typeMatch && majorMatch && modeMatch && deadlineMatch && ageMatch;
    });
  }, [type, major, mode, age, deadline]);

  const types = Array.from(new Set(opportunities.map((opportunity) => opportunity.type)));

  function saveOpportunity(id: string) {
    if (profile.savedOpportunityIds.includes(id)) return;
    updateProfile({ savedOpportunityIds: [...profile.savedOpportunityIds, id] });
  }

  return (
    <AppShell title="Opportunity Matcher" subtitle="Find competitions, programs, courses, volunteering, and scholarships that fit your roadmap.">
      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onChange={(event) => setType(event.target.value)}>
                <option>All</option>
                {types.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Major</Label>
              <Input value={major} onChange={(event) => setMajor(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input value={age} onChange={(event) => setAge(event.target.value)} placeholder="16" />
            </div>
            <div className="space-y-2">
              <Label>Online availability</Label>
              <Select value={mode} onChange={(event) => setMode(event.target.value)}>
                <option>All</option>
                <option>Online</option>
                <option>Hybrid</option>
                <option>In person</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Deadline before</Label>
              <Input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((opportunity) => {
            const saved = profile.savedOpportunityIds.includes(opportunity.id);
            return (
              <Card key={opportunity.id} className="interactive-card bg-white/[0.78]">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{opportunity.title}</CardTitle>
                      <CardDescription>{opportunity.whyItHelps}</CardDescription>
                    </div>
                    <Button variant={saved ? "secondary" : "default"} size="sm" onClick={() => saveOpportunity(opportunity.id)}>
                      {saved ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {saved ? "Saved" : "Save"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="info">{opportunity.type}</Badge>
                    <Badge variant="outline">{opportunity.mode}</Badge>
                    <Badge variant={opportunity.difficulty === "Competitive" ? "warning" : "secondary"}>{opportunity.difficulty}</Badge>
                    <Badge variant="outline">{opportunity.cost}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg border bg-white/70 p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Country</p>
                      <p className="mt-1 text-sm">{opportunity.country}</p>
                    </div>
                    <div className="rounded-lg border bg-white/70 p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Deadline</p>
                      <p className="mt-1 text-sm">{formatDate(opportunity.deadline)}</p>
                    </div>
                    <div className="rounded-lg border bg-white/70 p-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Age range</p>
                      <p className="mt-1 text-sm">{opportunity.ageRange}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Relevant majors</p>
                    <p className="mt-1 text-sm">{opportunity.relevantMajors.join(", ")}</p>
                  </div>
                  <div className="rounded-lg border bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
                    <p className="font-semibold">Recommended because...</p>
                    <p>{recommendedBecause(profile.intendedMajor, opportunity.relevantMajors)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Link placeholder: {opportunity.linkPlaceholder}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
