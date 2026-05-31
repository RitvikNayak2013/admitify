import type {
  GapAnalysis,
  ReadinessScore,
  ScoreLabel,
  ScoreResult,
  StudentProfile,
  University,
  WeeklyAction
} from "@/lib/types";
import { clamp } from "@/lib/utils";

export const readinessWeights = {
  academics: 25,
  tests: 15,
  extracurricularDepth: 20,
  awards: 10,
  projectsAndProof: 15,
  leadership: 10,
  narrativeFit: 5
};

function labelFor(score: number): ScoreLabel {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Competitive";
  if (score >= 50) return "Developing";
  return "Needs focus";
}

function score(numeric: number, explanation: string, recommendedImprovements: string[]): ScoreResult {
  const normalized = Math.round(clamp(numeric));
  return {
    numeric: normalized,
    label: labelFor(normalized),
    explanation,
    recommendedImprovements
  };
}

function textIncludesAny(text: string, terms: string[]) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function allProfileText(profile: StudentProfile) {
  return [
    profile.currentGrades,
    profile.intendedMajor,
    profile.volunteering,
    ...profile.strengths,
    ...profile.weaknesses,
    ...profile.activities.flatMap((activity) => [
      activity.name,
      activity.category,
      activity.role,
      activity.description,
      activity.impactMetrics
    ]),
    ...profile.projects.flatMap((project) => [
      project.title,
      project.relatedMajor,
      project.description,
      project.impact
    ]),
    ...profile.research.flatMap((research) => [research.topic, research.output]),
    ...profile.leadership.flatMap((leadership) => [
      leadership.role,
      leadership.organization,
      leadership.impact
    ])
  ].join(" ");
}

export function calculateAcademicScore(profile: StudentProfile): ScoreResult {
  const grades = profile.currentGrades.toLowerCase();
  let base = 48;

  const ibMatch = grades.match(/(?:ib|predicted)?\s*(\d{2})\s*\/\s*45/);
  if (ibMatch) {
    base = Number(ibMatch[1]) >= 42 ? 92 : Number(ibMatch[1]) >= 39 ? 82 : Number(ibMatch[1]) >= 36 ? 70 : 56;
  }

  const gpaMatch = grades.match(/(\d(?:\.\d+)?)\s*\/\s*4/);
  if (gpaMatch) {
    const gpa = Number(gpaMatch[1]);
    base = Math.max(base, gpa >= 3.9 ? 90 : gpa >= 3.7 ? 78 : gpa >= 3.4 ? 64 : 50);
  }

  if (/(a\*|a\+|high distinction|top|rank|valedictorian)/i.test(profile.currentGrades)) base += 8;
  if (/(hl math|calculus|physics|chemistry|advanced|honors|ap|a level)/i.test(profile.currentGrades)) base += 7;
  if (profile.currentGrades.length < 28) base -= 10;

  return score(
    base,
    "Academic readiness is based on the rigor and clarity of the grades you entered, with extra credit for advanced subject alignment.",
    [
      "Add exact current or predicted grades with course rigor.",
      "Prioritize the highest-level math or subject prerequisite available for your target major.",
      "Collect a transcript or school report in the Portfolio Vault."
    ]
  );
}

export function calculateTestScore(profile: StudentProfile, targetUniversities: University[]): ScoreResult {
  const testText = profile.testScores.map((test) => `${test.exam} ${test.score}`).join(" ").toLowerCase();
  const planned = profile.plannedExams.length;
  const targetsExpectTesting = targetUniversities.some(
    (university) => university.testingExpectations === "Required" || university.testingExpectations === "Recommended"
  );

  let base = planned > 0 ? 54 : 38;
  const sat = testText.match(/(?:sat|digital sat|sat practice)\D*(1[0-6]\d{2})/);
  if (sat) {
    const value = Number(sat[1]);
    base = Math.max(base, value >= 1530 ? 92 : value >= 1480 ? 82 : value >= 1400 ? 68 : 54);
  }
  const act = testText.match(/act\D*(\d{2})/);
  if (act) {
    const value = Number(act[1]);
    base = Math.max(base, value >= 35 ? 92 : value >= 33 ? 80 : value >= 30 ? 66 : 52);
  }
  const ielts = testText.match(/ielts\D*(\d(?:\.\d)?)/);
  if (ielts) {
    const value = Number(ielts[1]);
    base = Math.max(base, value >= 8 ? 84 : value >= 7.5 ? 76 : value >= 7 ? 66 : 54);
  }
  const toefl = testText.match(/toefl\D*(\d{2,3})/);
  if (toefl) {
    const value = Number(toefl[1]);
    base = Math.max(base, value >= 110 ? 86 : value >= 100 ? 76 : value >= 90 ? 62 : 50);
  }
  if (!targetsExpectTesting && planned > 0) base += 4;
  if (targetsExpectTesting && profile.testScores.length === 0) base -= 10;

  return score(
    base,
    "Testing readiness reflects current scores, planned exams, and how strongly your selected target universities tend to value testing.",
    [
      "Convert practice scores into an official test date plan.",
      "Attach score reports or diagnostic screenshots in the Portfolio Vault.",
      "Use one weekly review loop: diagnostic, error log, focused drills, timed section."
    ]
  );
}

export function calculateActivityScore(profile: StudentProfile): ScoreResult {
  if (profile.activities.length === 0) {
    return score(24, "No current activities were entered, so extracurricular depth needs immediate attention.", [
      "Choose one activity connected to your intended major and commit weekly hours.",
      "Define measurable impact before adding more activities."
    ]);
  }

  const average =
    profile.activities.reduce(
      (sum, activity) =>
        sum + activity.depthScore * 0.35 + activity.leadershipScore * 0.25 + activity.uniquenessScore * 0.2 + activity.proofScore * 0.2,
      0
    ) / profile.activities.length;
  const depthBonus = profile.activities.some((activity) => activity.hoursPerWeek >= 4) ? 8 : 0;
  const impactBonus = profile.activities.some((activity) => /\d|%|students|users|revenue|hours/i.test(activity.impactMetrics)) ? 7 : 0;

  return score(
    average + depthBonus + impactBonus,
    "Extracurricular depth considers sustained time, role, uniqueness, measurable impact, and evidence quality.",
    [
      "Upgrade one activity into a signature commitment with measurable outcomes.",
      "Add proof links for activities with low evidence scores.",
      "Connect at least one activity more clearly to your intended major."
    ]
  );
}

export function calculateAwardsScore(profile: StudentProfile): ScoreResult {
  const levelPoints = {
    School: 14,
    Regional: 24,
    National: 36,
    International: 46,
    Other: 16
  };
  const total = profile.awards.reduce((sum, award) => sum + levelPoints[award.level], 20);
  const proofBonus = profile.awards.filter((award) => award.proofLink).length * 6;
  const base = Math.min(94, total + proofBonus);

  return score(
    profile.awards.length ? base : 32,
    "Award strength reflects level, relevance, and whether each recognition has proof attached.",
    [
      "Enter one relevant competition or award pathway this term.",
      "Save certificates, ranking pages, or organizer emails in the Portfolio Vault.",
      "Prioritize quality and relevance over a long list of weak awards."
    ]
  );
}

export function calculateProjectProofScore(profile: StudentProfile): ScoreResult {
  const projectBase = Math.min(54, profile.projects.length * 18);
  const proofLinks = profile.projects.reduce((sum, project) => sum + project.proofLinks.length, 0);
  const proofBonus = Math.min(22, proofLinks * 7);
  const launchedBonus = profile.projects.some((project) => project.status === "Launched" || project.status === "Documented") ? 12 : 0;
  const vaultAverage =
    profile.vaultItems.length > 0
      ? profile.vaultItems.reduce((sum, item) => sum + item.strengthScore, 0) / profile.vaultItems.length
      : 35;
  const base = projectBase + proofBonus + launchedBonus + vaultAverage * 0.18;

  return score(
    base,
    "Project and proof strength measures whether your achievements have public, verifiable artifacts and documented impact.",
    [
      "Add a public demo, GitHub repository, user results, or written case study.",
      "Turn one project into a concise portfolio page with problem, process, result, and proof.",
      "Attach evidence for leadership, awards, and research outputs."
    ]
  );
}

export function calculateLeadershipScore(profile: StudentProfile): ScoreResult {
  const activityLeadership =
    profile.activities.length > 0
      ? profile.activities.reduce((sum, activity) => sum + activity.leadershipScore, 0) / profile.activities.length
      : 25;
  const formalLeadership = Math.min(30, profile.leadership.length * 15);
  const impactBonus = textIncludesAny(
    profile.leadership.map((item) => item.impact).join(" ") + " " + profile.activities.map((item) => item.impactMetrics).join(" "),
    ["led", "founded", "organized", "students", "users", "%", "raised", "launched", "mentored"]
  )
    ? 12
    : 0;

  return score(
    activityLeadership * 0.65 + formalLeadership + impactBonus,
    "Leadership readiness looks for ownership, initiative, and outcomes that affected other people.",
    [
      "Document the before-and-after impact of one leadership role.",
      "Collect testimonials, attendance logs, photos, or product metrics.",
      "Move beyond titles by showing decisions you made and results you caused."
    ]
  );
}

export function calculateNarrativeFitScore(profile: StudentProfile): ScoreResult {
  const profileText = allProfileText(profile);
  const majorTerms = [
    profile.intendedMajor,
    ...profile.intendedMajor.split(/\s+/),
    profile.intendedMajor.includes("Computer") ? "coding" : "",
    profile.intendedMajor.includes("Engineering") ? "prototype" : "",
    profile.intendedMajor.includes("Economics") ? "policy" : ""
  ].filter(Boolean);

  const alignmentHits = majorTerms.filter((term) => textIncludesAny(profileText, [term])).length;
  const strengths = profile.strengths.length * 5;
  const weaknessesClarity = profile.weaknesses.length > 0 ? 8 : 0;
  const base = 38 + Math.min(34, alignmentHits * 7) + Math.min(12, strengths) + weaknessesClarity;

  return score(
    base,
    "Narrative fit reflects how clearly your academics, activities, projects, and reflection point toward your intended major.",
    [
      "Write a one-sentence theme that connects your major, activities, and proof.",
      "Add one project or reading habit that explains why this major matters to you.",
      "Remove vague claims and replace them with concrete evidence."
    ]
  );
}

export function calculateOverallReadiness(profile: StudentProfile, targetUniversities: University[]): ReadinessScore {
  const academics = calculateAcademicScore(profile);
  const tests = calculateTestScore(profile, targetUniversities);
  const extracurricularDepth = calculateActivityScore(profile);
  const awards = calculateAwardsScore(profile);
  const projectsAndProof = calculateProjectProofScore(profile);
  const leadership = calculateLeadershipScore(profile);
  const narrativeFit = calculateNarrativeFitScore(profile);

  const weighted =
    academics.numeric * readinessWeights.academics +
    tests.numeric * readinessWeights.tests +
    extracurricularDepth.numeric * readinessWeights.extracurricularDepth +
    awards.numeric * readinessWeights.awards +
    projectsAndProof.numeric * readinessWeights.projectsAndProof +
    leadership.numeric * readinessWeights.leadership +
    narrativeFit.numeric * readinessWeights.narrativeFit;

  const totalWeight = Object.values(readinessWeights).reduce((sum, value) => sum + value, 0);
  const overall = score(
    weighted / totalWeight,
    "Dream Fit Readiness Score summarizes profile strength against your goals. It is a planning signal, not an outcome forecast.",
    [
      "Use the biggest gap and weekly actions to decide what to build next.",
      "Keep proof for every claim you expect to include in applications.",
      "Review university-specific requirements directly before application season."
    ]
  );

  return {
    overall,
    academics,
    tests,
    extracurricularDepth,
    awards,
    projectsAndProof,
    leadership,
    narrativeFit,
    weights: readinessWeights
  };
}

export function generateGapAnalysis(profile: StudentProfile, targetUniversities: University[]): GapAnalysis {
  const readiness = calculateOverallReadiness(profile, targetUniversities);
  const entries = [
    ["Academics", readiness.academics],
    ["Tests", readiness.tests],
    ["Extracurricular depth", readiness.extracurricularDepth],
    ["Awards", readiness.awards],
    ["Projects and proof", readiness.projectsAndProof],
    ["Leadership", readiness.leadership],
    ["Narrative fit", readiness.narrativeFit]
  ] as const;

  const sorted = [...entries].sort((a, b) => a[1].numeric - b[1].numeric);
  const gaps = sorted.map(([category, result]) => ({
    category,
    severity: result.numeric < 55 ? ("High" as const) : result.numeric < 72 ? ("Medium" as const) : ("Low" as const),
    explanation: result.explanation,
    nextStep: result.recommendedImprovements[0]
  }));

  return {
    biggestGap: gaps[0]?.category ?? "Profile proof",
    summary: `${gaps[0]?.category ?? "Profile proof"} is the clearest improvement area right now. Focus on visible, verifiable progress before adding more scattered commitments.`,
    gaps
  };
}

export function generateWeeklyActions(profile: StudentProfile, gapAnalysis: GapAnalysis): WeeklyAction[] {
  const hours = Math.max(4, profile.weeklyAvailableHours || 6);
  const templates: Record<string, WeeklyAction> = {
    "Projects and proof": {
      id: "weekly-proof",
      title: "Publish one proof artifact for your strongest project",
      category: "Portfolio Proof",
      estimatedHours: Math.min(4, hours),
      whyItMatters: "A clear artifact makes your work verifiable and easier to evaluate."
    },
    Tests: {
      id: "weekly-test",
      title: "Complete one timed diagnostic and update your exam plan",
      category: "Exam",
      estimatedHours: Math.min(3, hours),
      whyItMatters: "Diagnostics turn vague preparation into a targeted score-improvement loop."
    },
    Awards: {
      id: "weekly-award",
      title: "Choose one competition or award pathway and register interest",
      category: "Opportunity",
      estimatedHours: Math.min(2, hours),
      whyItMatters: "Relevant external validation strengthens profile credibility."
    },
    "Extracurricular depth": {
      id: "weekly-activity",
      title: "Upgrade one activity with a measurable impact target",
      category: "Extracurricular",
      estimatedHours: Math.min(3, hours),
      whyItMatters: "Depth is built through sustained ownership, not activity count."
    },
    Leadership: {
      id: "weekly-leadership",
      title: "Document the result of one leadership decision",
      category: "Leadership",
      estimatedHours: Math.min(2, hours),
      whyItMatters: "Leadership proof shows actual responsibility and effect."
    },
    Academics: {
      id: "weekly-academic",
      title: "Create a recovery or stretch plan for your hardest subject",
      category: "Academic",
      estimatedHours: Math.min(3, hours),
      whyItMatters: "Academic consistency is the base layer of readiness."
    },
    "Narrative fit": {
      id: "weekly-narrative",
      title: "Write a one-paragraph major-fit story with evidence",
      category: "Essay",
      estimatedHours: Math.min(2, hours),
      whyItMatters: "A coherent story helps connect your work into a believable direction."
    }
  };

  const fromGaps = gapAnalysis.gaps.slice(0, 4).map((gap) => templates[gap.category]);
  const defaults: WeeklyAction[] = [
    {
      id: "weekly-roadmap-review",
      title: "Review roadmap progress and mark completed tasks",
      category: "Academic",
      estimatedHours: 1,
      whyItMatters: "A weekly review keeps the roadmap grounded in actual behavior."
    },
    {
      id: "weekly-vault",
      title: "Add one missing transcript, certificate, link, or screenshot to the vault",
      category: "Portfolio Proof",
      estimatedHours: 1,
      whyItMatters: "Proof collected early prevents last-minute scrambling."
    }
  ];

  return [...fromGaps, ...defaults].filter(Boolean).slice(0, 5);
}
