"use client";

import Image from "next/image";
import { Check, ChevronDown, Globe2, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { InfoTip, Term } from "@/components/info-tip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { universities } from "@/lib/seed/universities";
import { useProfile } from "@/lib/storage";
import { getUniversityInitials, getUniversityLogoUrl } from "@/lib/university-assets";

export default function UniversitiesPage() {
  const { profile, updateProfile } = useProfile();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");
  const [major, setMajor] = useState("");
  const [selectivity, setSelectivity] = useState("All");
  const [testing, setTesting] = useState("All");
  const [cost, setCost] = useState("All");
  const [system, setSystem] = useState("All");
  const [visibleCount, setVisibleCount] = useState(18);

  const filtered = useMemo(() => {
    return universities.filter((university) => {
      const matchesQuery =
        !query ||
        university.name.toLowerCase().includes(query.toLowerCase()) ||
        university.country.toLowerCase().includes(query.toLowerCase()) ||
        university.strongMajors.some((item) => item.toLowerCase().includes(query.toLowerCase()));
      const matchesCountry = country === "All" || university.country === country || university.region === country;
      const matchesMajor =
        !major ||
        university.strongMajors.some((item) => item.toLowerCase().includes(major.toLowerCase())) ||
        university.programs.some((program) => program.name.toLowerCase().includes(major.toLowerCase()));
      const matchesSelectivity = selectivity === "All" || university.selectivity === selectivity;
      const matchesTesting = testing === "All" || university.testingExpectations === testing;
      const matchesCost = cost === "All" || university.costLevel === cost;
      const matchesSystem = system === "All" || university.applicationSystem === system;
      return matchesQuery && matchesCountry && matchesMajor && matchesSelectivity && matchesTesting && matchesCost && matchesSystem;
    });
  }, [query, country, major, selectivity, testing, cost, system]);

  useEffect(() => {
    setVisibleCount(18);
  }, [query, country, major, selectivity, testing, cost, system]);

  const countries = Array.from(new Set(universities.map((university) => university.country))).sort();
  const countryChips = ["All", "United States", "United Kingdom", "Canada", "Singapore", "Hong Kong", "Europe"];
  const selectivities = Array.from(new Set(universities.map((university) => university.selectivity)));
  const testingOptions = Array.from(new Set(universities.map((university) => university.testingExpectations)));
  const costOptions = Array.from(new Set(universities.map((university) => university.costLevel)));
  const systems = Array.from(new Set(universities.map((university) => university.applicationSystem)));
  const visibleUniversities = filtered.slice(0, visibleCount);

  function addUniversity(id: string) {
    if (profile.dreamUniversities.includes(id)) return;
    updateProfile({ dreamUniversities: [...profile.dreamUniversities, id] });
  }

  return (
    <AppShell title="Dream Universities" subtitle="Explore editable sample university profiles and add targets to your roadmap.">
      <div className="grid min-w-0 gap-5">
        <Card className="hero-metal border-white/15">
          <CardContent className="relative z-10 grid gap-5 p-6 lg:grid-cols-[1fr_180px] lg:items-end">
            <div>
              <Badge variant="warning">Editable sample data</Badge>
              <h2 className="mt-4 text-2xl font-bold tracking-normal text-white md:text-3xl">Build a focused dream-school list.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Search broadly, save only the schools you want the roadmap to plan around. All requirements here are sample planning data.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <p className="text-4xl font-bold text-white">{filtered.length}</p>
              <p className="mt-1 text-sm text-slate-300">matches</p>
            </div>
          </CardContent>
        </Card>

        <Card className="sticky top-20 z-20 bg-white/[0.86] backdrop-blur-2xl">
          <CardContent className="space-y-4 p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search school, major, country..." />
              </div>
              <details className="group">
                <summary className="inline-flex h-10 cursor-pointer list-none items-center gap-2 rounded-md border bg-white px-4 text-sm font-semibold hover:bg-slate-50">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  More filters
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <div className="mt-4 grid gap-4 rounded-lg border bg-slate-50 p-4 md:grid-cols-2 2xl:grid-cols-5">
                  <div className="space-y-2">
                    <Label>Major</Label>
                    <Input value={major} onChange={(event) => setMajor(event.target.value)} placeholder="Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select value={country} onChange={(event) => setCountry(event.target.value)}>
                      <option>All</option>
                      {countries.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center gap-1.5">
                      Selectivity
                      <InfoTip label="Selectivity">A rough sample label for how competitive a university can be. It is not a probability or guarantee.</InfoTip>
                    </Label>
                    <Select value={selectivity} onChange={(event) => setSelectivity(event.target.value)}>
                      <option>All</option>
                      {selectivities.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center gap-1.5">
                      Testing
                      <InfoTip label="Testing expectation">Whether tests are sample-labeled as required, recommended, optional, or situational. Always verify official pages.</InfoTip>
                    </Label>
                    <Select value={testing} onChange={(event) => setTesting(event.target.value)}>
                      <option>All</option>
                      {testingOptions.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center gap-1.5">
                      System
                      <InfoTip label="Application system">The application platform or route, such as Common App, UCAS, OUAC, UC Application, or direct application.</InfoTip>
                    </Label>
                    <Select value={system} onChange={(event) => setSystem(event.target.value)}>
                      <option>All</option>
                      {systems.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cost</Label>
                    <Select value={cost} onChange={(event) => setCost(event.target.value)}>
                      <option>All</option>
                      {costOptions.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </details>
            </div>
            <div className="scrollbar-soft flex gap-2 overflow-x-auto pb-1">
              {countryChips.map((item) => (
                <button
                  key={item}
                  onClick={() => setCountry(item)}
                  className={`shrink-0 rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    country === item ? "border-slate-950 bg-slate-950 text-white shadow-metal" : "bg-white/70 text-muted-foreground hover:border-cyan-700/40 hover:bg-white hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {visibleUniversities.map((university) => {
            const selected = profile.dreamUniversities.includes(university.id);
            const logo = getUniversityLogoUrl(university);
            return (
              <Card key={university.id} className="interactive-card overflow-hidden bg-white/[0.78]">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg border bg-slate-50">
                        {logo ? (
                          <Image src={logo} alt="" width={32} height={32} unoptimized className="h-8 w-8 object-contain" />
                        ) : (
                          <span className="text-xs font-bold text-primary">{getUniversityInitials(university.name)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate">{university.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Globe2 className="h-3.5 w-3.5" />
                          {university.country}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant={selected ? "secondary" : "default"} size="sm" onClick={() => addUniversity(university.id)}>
                      {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {selected ? "Added" : "Add"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="info">
                      <Term label={university.selectivity}>Sample selectivity label for planning only. It is not an admission prediction.</Term>
                    </Badge>
                    <Badge variant="outline">{university.testingExpectations} testing</Badge>
                    <Badge variant="secondary">{university.applicationSystem}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {university.strongMajors.slice(0, 3).map((majorItem) => (
                      <Badge key={majorItem} variant="secondary">
                        {majorItem}
                      </Badge>
                    ))}
                  </div>
                  <details className="group rounded-lg border bg-slate-50 p-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold">
                      Planning notes
                      <ChevronDown className="float-right h-4 w-4 text-muted-foreground transition group-open:rotate-180" />
                    </summary>
                    <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
                      <p>{university.academicExpectations}</p>
                      <p>{university.portfolioExpectations}</p>
                      <p className="text-amber-800">{university.deadlinesPlaceholder}</p>
                    </div>
                  </details>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-lg font-semibold">No matches yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Try a broader country, major, or testing filter.</p>
            </CardContent>
          </Card>
        ) : null}
        {filtered.length > visibleCount ? (
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setVisibleCount((count) => count + 18)}>
              Show more schools
            </Button>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
