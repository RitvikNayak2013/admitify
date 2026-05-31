import type { GapAnalysis, RoadmapCategory, RoadmapTask, StudentProfile, University } from "@/lib/types";

function task(
  id: string,
  timeframe: RoadmapTask["timeframe"],
  title: string,
  category: RoadmapCategory,
  priority: RoadmapTask["priority"],
  estimatedHours: number,
  deadline: string,
  whyItMatters: string,
  evidenceToCollect: string[]
): RoadmapTask {
  return {
    id,
    timeframe,
    title,
    category,
    priority,
    estimatedHours,
    deadline,
    whyItMatters,
    evidenceToCollect,
    completed: false
  };
}

function monthOffset(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function targetSummary(targetUniversities: University[]) {
  if (targetUniversities.length === 0) return "your target universities";
  return targetUniversities.slice(0, 3).map((university) => university.name).join(", ");
}

export function generateRoadmap(profile: StudentProfile, targetUniversities: University[], gapAnalysis: GapAnalysis): RoadmapTask[] {
  const major = profile.intendedMajor || "intended major";
  const targets = targetSummary(targetUniversities);
  const weeklyHours = Math.max(5, profile.weeklyAvailableHours || 8);
  const biggestGap = gapAnalysis.biggestGap;

  const tasks: RoadmapTask[] = [
    task(
      "this-week-proof",
      "This week",
      "Add proof for your strongest existing achievement",
      "Portfolio Proof",
      biggestGap.includes("proof") || biggestGap.includes("Projects") ? "High" : "Medium",
      Math.min(3, weeklyHours),
      monthOffset(0),
      "Claims become stronger when supported by a link, document, screenshot, repository, or result.",
      ["Proof link", "Short description", "Impact metric"]
    ),
    task(
      "this-week-exam-diagnostic",
      "This week",
      "Complete one timed exam diagnostic and update target score plan",
      "Exam",
      "High",
      Math.min(4, weeklyHours),
      monthOffset(0),
      `Targets like ${targets} often require clear academic and testing readiness, depending on program and policy.`,
      ["Diagnostic score", "Error log", "Next practice plan"]
    ),
    task(
      "this-week-activity-impact",
      "This week",
      "Choose one activity and define a measurable impact target",
      "Extracurricular",
      "High",
      2,
      monthOffset(0),
      "A focused impact metric turns a generic activity into a stronger commitment.",
      ["Baseline metric", "Target metric", "Weekly action owner"]
    ),
    task(
      "this-week-major-story",
      "This week",
      `Write a one-paragraph ${major} fit story`,
      "Essay",
      "Medium",
      2,
      monthOffset(0),
      "A clear academic direction helps you decide which projects and opportunities deserve time.",
      ["Paragraph draft", "Three supporting proof points"]
    ),
    task(
      "this-month-portfolio-project",
      "This month",
      `Scope one major ${major} portfolio project`,
      "Project",
      "High",
      Math.min(10, weeklyHours * 2),
      monthOffset(1),
      "A signature project gives you a concrete artifact that can connect academics, initiative, and proof.",
      ["Problem statement", "Success metric", "Build plan", "Public repository or project page"]
    ),
    task(
      "this-month-opportunity",
      "This month",
      "Apply to one relevant competition, program, or public challenge",
      "Opportunity",
      "Medium",
      4,
      monthOffset(1),
      "A suitable opportunity can create external validation and a deadline for real work.",
      ["Opportunity link", "Submission plan", "Draft materials"]
    ),
    task(
      "this-month-leadership-proof",
      "This month",
      "Collect stronger proof for one leadership or service role",
      "Leadership",
      "Medium",
      3,
      monthOffset(1),
      "Leadership becomes more credible when another person or measurable result can verify it.",
      ["Attendance log", "Photo or artifact", "Short testimonial", "Impact number"]
    ),
    task(
      "three-month-project-demo",
      "Next 3 months",
      `Launch the first public demo of your ${major} project`,
      "Project",
      "High",
      Math.min(24, weeklyHours * 4),
      monthOffset(3),
      "A demo proves that the project moved beyond an idea and gives you feedback to improve.",
      ["Demo URL", "GitHub repository", "User feedback", "Screenshots"]
    ),
    task(
      "three-month-research-feedback",
      "Next 3 months",
      "Contact a mentor for feedback on a research or project question",
      "Research",
      "Medium",
      5,
      monthOffset(3),
      "Mentor feedback can sharpen your question, methods, and credibility without exaggerating achievements.",
      ["Outreach email", "Feedback notes", "Revised research question"]
    ),
    task(
      "three-month-academics",
      "Next 3 months",
      "Build a subject improvement plan for your hardest prerequisite",
      "Academic",
      "High",
      Math.min(18, weeklyHours * 3),
      monthOffset(3),
      "Academic consistency is the foundation for selective academic environments.",
      ["Baseline grade", "Weekly practice log", "Teacher feedback", "Updated grade"]
    ),
    task(
      "six-month-case-study",
      "Next 6 months",
      "Publish a written case study for your strongest project or activity",
      "Portfolio Proof",
      "High",
      8,
      monthOffset(6),
      "A case study shows problem, process, evidence, impact, and reflection in one artifact.",
      ["Case study URL", "Before/after metrics", "Process screenshots", "Reflection"]
    ),
    task(
      "six-month-award-pathway",
      "Next 6 months",
      "Enter one major-aligned award, olympiad, or showcase",
      "Opportunity",
      "Medium",
      Math.min(16, weeklyHours * 3),
      monthOffset(6),
      "External evaluation can strengthen credibility when it aligns with the student's real interests.",
      ["Registration confirmation", "Preparation schedule", "Submission or result proof"]
    ),
    task(
      "six-month-activity-descriptions",
      "Next 6 months",
      "Draft concise activity descriptions with proof links",
      "Essay",
      "Medium",
      4,
      monthOffset(6),
      "Strong descriptions are specific, honest, and supported by evidence.",
      ["Activity draft", "Impact metric", "Proof link"]
    ),
    task(
      "before-applications-vault-audit",
      "Before applications",
      "Complete a Portfolio Vault audit",
      "Portfolio Proof",
      "High",
      5,
      `${profile.applicationYear - 1}-09-01`,
      "Every important claim should have a reliable proof source before application season.",
      ["Transcript", "Score reports", "Certificates", "Project links", "Recommendation context"]
    ),
    task(
      "before-applications-fit-review",
      "Before applications",
      "Review university fit and official requirements",
      "Academic",
      "High",
      6,
      `${profile.applicationYear - 1}-10-01`,
      "Sample data is only a planning aid; official requirements and deadlines must drive final decisions.",
      ["Official requirement notes", "Deadline list", "Program-specific prerequisites"]
    )
  ];

  return tasks;
}
