"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Compass, Plus, Search, ShieldCheck, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { InfoTip, Term } from "@/components/info-tip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { universities } from "@/lib/seed/universities";
import { exams } from "@/lib/seed/exams";
import { useProfile } from "@/lib/storage";
import type { Activity, Award, ExamPlan, Project, StudentProfile } from "@/lib/types";
import { splitList, uid } from "@/lib/utils";

const steps = [
  {
    name: "Basics",
    title: "Start with the student",
    helper: "Your year, country, curriculum, and time budget shape what a realistic roadmap can ask from you.",
    unlock: "Admitify can pace the plan around your school year and weekly capacity."
  },
  {
    name: "Targets",
    title: "Choose the destination",
    helper: "Pick a focused set of dream universities so Admitify can build around fit, not random prestige.",
    unlock: "Your scores and roadmap can point toward specific countries, systems, and programs."
  },
  {
    name: "Academics",
    title: "Add grades and exams",
    helper: "Scores and planned tests help the roadmap decide what to prioritize and when.",
    unlock: "Admitify can separate official requirements from useful but optional preparation."
  },
  {
    name: "Experience",
    title: "Add activities and proof",
    helper: "Activities, projects, leadership, and awards become stronger when they have measurable evidence.",
    unlock: "The app can find proof gaps and suggest concrete upgrades."
  },
  {
    name: "Reflection",
    title: "Name strengths and gaps",
    helper: "Honest reflection helps Admitify recommend the next useful action, not just more tasks.",
    unlock: "Your dashboard can focus on the few moves that matter this week."
  }
];

function Field({ label, help, hint, children }: { label: string; help?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="inline-flex items-center gap-1.5">
        {label}
        {help ? <InfoTip label={label}>{help}</InfoTip> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs leading-5 text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<StudentProfile>(profile);
  const [universityQuery, setUniversityQuery] = useState("");

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const progress = ((step + 1) / steps.length) * 100;
  const activeStep = steps[step];
  const visibleUniversities = useMemo(() => {
    const query = universityQuery.trim().toLowerCase();
    return universities
      .filter(
        (university) =>
          !query ||
          university.name.toLowerCase().includes(query) ||
          university.country.toLowerCase().includes(query) ||
          university.strongMajors.some((major) => major.toLowerCase().includes(query))
      )
      .slice(0, 18);
  }, [universityQuery]);

  function update<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggleUniversity(id: string) {
    setDraft((current) => ({
      ...current,
      dreamUniversities: current.dreamUniversities.includes(id)
        ? current.dreamUniversities.filter((universityId) => universityId !== id)
        : [...current.dreamUniversities, id]
    }));
  }

  function addActivity() {
    const next: Activity = {
      id: uid("activity"),
      name: "New activity",
      category: "STEM",
      role: "Member",
      startDate: "",
      endDate: "",
      hoursPerWeek: 2,
      impactMetrics: "",
      evidenceLinks: [],
      description: "",
      depthScore: 45,
      leadershipScore: 35,
      uniquenessScore: 40,
      proofScore: 25
    };
    update("activities", [...draft.activities, next]);
  }

  function addAward() {
    const next: Award = {
      id: uid("award"),
      title: "New award",
      level: "School",
      date: "",
      description: "",
      proofLink: ""
    };
    update("awards", [...draft.awards, next]);
  }

  function addProject() {
    const next: Project = {
      id: uid("project"),
      title: "New project",
      relatedMajor: draft.intendedMajor,
      description: "",
      proofLinks: [],
      impact: "",
      status: "Idea"
    };
    update("projects", [...draft.projects, next]);
  }

  function addExamPlan() {
    const firstExam = exams[0];
    const next: ExamPlan = {
      id: uid("exam-plan"),
      examId: firstExam.id,
      targetScore: firstExam.idealTargetScore.split(";")[0],
      status: "Planning",
      testDate: ""
    };
    update("plannedExams", [...draft.plannedExams, next]);
  }

  function complete() {
    setProfile(draft);
    router.push("/dashboard");
  }

  return (
    <main className="app-noise min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Badge variant="info">Guided setup</Badge>
        </div>

        <div className="hero-metal mt-8 p-6 md:p-8">
          <div className="relative z-10">
          <div className="flex flex-wrap gap-2">
            <span className="metal-chip">3 minute setup</span>
            <span className="metal-chip">Editable later</span>
            <span className="metal-chip">Honest profile only</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-normal text-white md:text-5xl">Build the profile your roadmap can trust.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Admitify needs just enough context to create a useful plan: goals, current work, evidence, and weekly capacity.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }} className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Compass className="h-4 w-4 text-cyan-200" />
                Goal first
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Start with target schools and major, then work backward.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-cyan-200" />
                Useful, not perfect
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">You can leave fields rough and improve them later.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-cyan-200" />
                Honest only
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Use real grades, real work, and proof you can verify.</p>
            </motion.div>
          </div>
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap gap-2">
              {steps.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => setStep(index)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    index === step ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/[0.08] text-slate-300 hover:text-white"
                  }`}
                >
                  {index + 1}. {item.name}
                </button>
              ))}
            </div>
            <Progress value={progress} className="bg-white/15" />
          </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-xl">{activeStep.title}</CardTitle>
                <CardDescription>
                  Step {step + 1} of {steps.length}: {activeStep.helper}
                </CardDescription>
                <div className="mt-3 rounded-lg border border-cyan-100 bg-cyan-50 p-3 text-sm leading-6 text-cyan-950">
                  <span className="font-semibold">Why this matters: </span>
                  {activeStep.unlock}
                </div>
              </CardHeader>
              <CardContent>
            {step === 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name">
                  <Input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Student name" />
                </Field>
                <Field label="Grade or year level" help="Your school year helps Admitify time the roadmap before applications.">
                  <Input value={draft.grade} onChange={(event) => update("grade", event.target.value)} placeholder="Grade 11" />
                </Field>
                <Field label="Country">
                  <Input value={draft.country} onChange={(event) => update("country", event.target.value)} placeholder="Indonesia" />
                </Field>
                <Field label="Curriculum" help="The academic system your school follows, such as IB, A Levels, AP, CBSE, or a national curriculum.">
                  <Input value={draft.curriculum} onChange={(event) => update("curriculum", event.target.value)} placeholder="IB, A Levels, AP, national" />
                </Field>
                <Field label="Intended major" help="The subject or field you plan to study at university. It can change later.">
                  <Input value={draft.intendedMajor} onChange={(event) => update("intendedMajor", event.target.value)} placeholder="Computer Science" />
                </Field>
                <Field label="Application year" help="The calendar year when you expect to submit applications.">
                  <Input
                    type="number"
                    value={draft.applicationYear}
                    onChange={(event) => update("applicationYear", Number(event.target.value))}
                  />
                </Field>
                <Field label="Weekly available hours" help="The realistic number of hours you can protect each week for exams, projects, activities, and proof.">
                  <Input
                    type="number"
                    min={1}
                    value={draft.weeklyAvailableHours}
                    onChange={(event) => update("weeklyAvailableHours", Number(event.target.value))}
                  />
                </Field>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-6">
                <Field label="Target countries" help="Countries where you might apply, such as the US, UK, Canada, Singapore, Hong Kong, or Europe.">
                  <Input
                    value={draft.targetCountries.join(", ")}
                    onChange={(event) => update("targetCountries", splitList(event.target.value))}
                    placeholder="United States, United Kingdom, Singapore"
                  />
                </Field>
                <div>
                  <Label className="inline-flex items-center gap-1.5">
                    Dream universities
                    <InfoTip label="Dream universities">Schools you are excited about. This is for planning fit and gaps, not predicting results.</InfoTip>
                  </Label>
                  <div className="relative mt-3">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      value={universityQuery}
                      onChange={(event) => setUniversityQuery(event.target.value)}
                      placeholder="Search MIT, Singapore, design, medicine..."
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Showing up to 18 matches. You can add more later from Dream Schools.</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {visibleUniversities.map((university) => {
                      const selected = draft.dreamUniversities.includes(university.id);
                      return (
                        <button
                          key={university.id}
                          type="button"
                          onClick={() => toggleUniversity(university.id)}
                          className={`rounded-lg border bg-white p-4 text-left transition-colors ${
                            selected ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{university.name}</p>
                              <p className="mt-1 text-sm text-muted-foreground">{university.country}</p>
                            </div>
                            {selected ? <Check className="h-5 w-5 text-primary" /> : null}
                          </div>
                          <p className="mt-3 text-xs leading-5 text-muted-foreground">{university.dataNote}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-6">
                <Field
                  label="Current grades"
                  help="A short summary of your recent grades or predicted grades. Use the format your school uses."
                  hint="Example: IB predicted 39/45, GPA 3.8/4.0, A Level predicted A*A*A."
                >
                  <Textarea
                    value={draft.currentGrades}
                    onChange={(event) => update("currentGrades", event.target.value)}
                    placeholder="IB predicted 39/45, GPA 3.8/4.0, A Level predicted A*A*A..."
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Current test scores" help="Scores you already have, including official scores or clearly marked practice scores.">
                    <Textarea
                      value={draft.testScores.map((item) => `${item.exam}: ${item.score}`).join("\n")}
                      onChange={(event) =>
                        update(
                          "testScores",
                          event.target.value
                            .split("\n")
                            .filter(Boolean)
                            .map((line) => {
                              const [exam, ...scoreParts] = line.split(":");
                              return { exam: exam.trim(), score: scoreParts.join(":").trim() };
                            })
                        )
                      }
                      placeholder={"SAT: 1480\nIELTS: 7.5"}
                    />
                  </Field>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <Label className="inline-flex items-center gap-1.5">
                        Planned exams
                        <InfoTip label="Planned exams">Tests you may take later, such as SAT, ACT, IELTS, AP, A Levels, TMUA, STEP, MAT, UCAT, or TOEFL.</InfoTip>
                      </Label>
                      <Button type="button" variant="outline" size="sm" onClick={addExamPlan}>
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 space-y-3">
                      {draft.plannedExams.map((plan) => (
                        <div key={plan.id} className="grid gap-2 rounded-lg border bg-white p-3">
                          <Select
                            value={plan.examId}
                            onChange={(event) =>
                              update(
                                "plannedExams",
                                draft.plannedExams.map((item) => (item.id === plan.id ? { ...item, examId: event.target.value } : item))
                              )
                            }
                          >
                            {exams.map((exam) => (
                              <option key={exam.id} value={exam.id}>
                                {exam.name}
                              </option>
                            ))}
                          </Select>
                          <Input
                            value={plan.targetScore}
                            onChange={(event) =>
                              update(
                                "plannedExams",
                                draft.plannedExams.map((item) => (item.id === plan.id ? { ...item, targetScore: event.target.value } : item))
                              )
                            }
                            placeholder="Target score"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="inline-flex items-center gap-1.5">
                      Current extracurriculars
                      <InfoTip label="Extracurriculars">Activities outside regular class, such as clubs, sports, service, research, jobs, projects, competitions, or family responsibilities.</InfoTip>
                    </Label>
                    <Button type="button" variant="outline" size="sm" onClick={addActivity}>
                      <Plus className="h-4 w-4" />
                      Add activity
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-3">
                    {draft.activities.map((activity) => (
                      <div key={activity.id} className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-2">
                        <Input
                          value={activity.name}
                          onChange={(event) =>
                            update(
                              "activities",
                              draft.activities.map((item) => (item.id === activity.id ? { ...item, name: event.target.value } : item))
                            )
                          }
                          placeholder="Activity name"
                        />
                        <Input
                          value={activity.role}
                          onChange={(event) =>
                            update(
                              "activities",
                              draft.activities.map((item) => (item.id === activity.id ? { ...item, role: event.target.value } : item))
                            )
                          }
                          placeholder="Role"
                        />
                        <Input
                          value={activity.category}
                          onChange={(event) =>
                            update(
                              "activities",
                              draft.activities.map((item) => (item.id === activity.id ? { ...item, category: event.target.value } : item))
                            )
                          }
                          placeholder="Category"
                        />
                        <Input
                          type="number"
                          value={activity.hoursPerWeek}
                          onChange={(event) =>
                            update(
                              "activities",
                              draft.activities.map((item) =>
                                item.id === activity.id ? { ...item, hoursPerWeek: Number(event.target.value) } : item
                              )
                            )
                          }
                          placeholder="Hours per week"
                        />
                        <Textarea
                          className="md:col-span-2"
                          value={activity.impactMetrics}
                          onChange={(event) =>
                            update(
                              "activities",
                              draft.activities.map((item) => (item.id === activity.id ? { ...item, impactMetrics: event.target.value } : item))
                            )
                          }
                          placeholder="Impact metrics: numbers or evidence of what changed"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <Label className="inline-flex items-center gap-1.5">
                        Awards
                        <InfoTip label="Awards">Recognition from a school, region, country, competition, program, publication, or community.</InfoTip>
                      </Label>
                      <Button type="button" variant="outline" size="sm" onClick={addAward}>
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 space-y-3">
                      {draft.awards.map((award) => (
                        <div key={award.id} className="rounded-lg border bg-white p-3">
                          <Input
                            value={award.title}
                            onChange={(event) =>
                              update(
                                "awards",
                                draft.awards.map((item) => (item.id === award.id ? { ...item, title: event.target.value } : item))
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <Label className="inline-flex items-center gap-1.5">
                        Projects
                        <InfoTip label="Projects">Work you created or built, such as apps, research posters, writing, prototypes, campaigns, designs, or experiments.</InfoTip>
                      </Label>
                      <Button type="button" variant="outline" size="sm" onClick={addProject}>
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    <div className="mt-3 space-y-3">
                      {draft.projects.map((project) => (
                        <div key={project.id} className="rounded-lg border bg-white p-3">
                          <Input
                            value={project.title}
                            onChange={(event) =>
                              update(
                                "projects",
                                draft.projects.map((item) => (item.id === project.id ? { ...item, title: event.target.value } : item))
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <Field label="Research experience" help="Any investigation, paper, poster, lab work, data project, or mentor-guided inquiry. It does not need to be published.">
                  <Textarea
                    value={draft.research.map((item) => `${item.topic} - ${item.output}`).join("\n")}
                    onChange={(event) =>
                      update(
                        "research",
                        event.target.value
                          .split("\n")
                          .filter(Boolean)
                          .map((line) => ({ id: uid("research"), topic: line, output: line }))
                      )
                    }
                  />
                </Field>
                <Field label="Leadership experience" help="Times you made decisions, organized people, owned an outcome, or improved something for others.">
                  <Textarea
                    value={draft.leadership.map((item) => `${item.role}, ${item.organization}: ${item.impact}`).join("\n")}
                    onChange={(event) =>
                      update(
                        "leadership",
                        event.target.value
                          .split("\n")
                          .filter(Boolean)
                          .map((line) => ({ id: uid("leadership"), role: line, organization: "", impact: line }))
                      )
                    }
                  />
                </Field>
                <Field label="Volunteering or community work" help="Service or contribution to people outside yourself, including local, school, family, or online communities.">
                  <Textarea value={draft.volunteering} onChange={(event) => update("volunteering", event.target.value)} />
                </Field>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Strengths" help="Areas already working well, such as academics, initiative, writing, discipline, leadership, or technical skill.">
                  <Textarea
                    value={draft.strengths.join(", ")}
                    onChange={(event) => update("strengths", splitList(event.target.value))}
                    placeholder="Programming initiative, writing, leadership..."
                  />
                </Field>
                <Field label="Weaknesses" help="Honest gaps Admitify should help you improve. Think proof, exams, depth, leadership, writing, or consistency.">
                  <Textarea
                    value={draft.weaknesses.join(", ")}
                    onChange={(event) => update("weaknesses", splitList(event.target.value))}
                    placeholder="Need stronger proof, exam score not official..."
                  />
                </Field>
                <div className="rounded-lg border bg-slate-50 p-4 md:col-span-2">
                  <p className="font-semibold">Profile summary</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Admitify will use this to create a <Term label="roadmap">A timeline of specific tasks with deadlines, hours, and proof to collect.</Term>
                  </p>
                  <div className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
                    <p>{draft.dreamUniversities.length} dream universities selected</p>
                    <p>{draft.activities.length} activities tracked</p>
                    <p>{draft.projects.length} projects and {draft.awards.length} awards entered</p>
                  </div>
                </div>
              </div>
            ) : null}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={complete}>
              Save and open dashboard
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
