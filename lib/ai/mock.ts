import type { AiCoachKind, AiCoachResponse } from "@/lib/ai/types";
import type { StudentProfile } from "@/lib/types";

const model = "deterministic-fallback";

function base(kind: AiCoachKind, profile: StudentProfile): AiCoachResponse {
  const major = profile.intendedMajor || "your intended major";
  const weeklyHours = profile.weeklyAvailableHours || 8;

  const defaults: Record<AiCoachKind, AiCoachResponse> = {
    dashboard: {
      mode: "mock",
      model,
      title: "Strategic focus",
      summary: `Use this week to convert profile strength into visible proof. With ${weeklyHours} hours available, protect time for one project artifact and one assessment or academic review loop.`,
      insights: [
        "Your strongest profile gains will come from evidence quality, not adding more unrelated commitments.",
        `The ${major} story needs artifacts that show build skill, reflection, and measurable use.`,
        "Short weekly reviews keep the roadmap honest and prevent vague progress."
      ],
      actions: [
        "Publish or improve one project artifact with a clear README, demo, or case study.",
        "Add one missing certificate, score report, screenshot, or link to the Portfolio Vault.",
        "Choose one roadmap task that can be completed in a single focused block."
      ],
      cautions: ["Do not frame readiness as an outcome guarantee.", "Verify official university requirements before final planning."]
    },
    roadmap: {
      mode: "mock",
      model,
      title: "Roadmap refinement",
      summary: "The roadmap should stay narrow enough to execute and concrete enough to produce proof every week.",
      insights: [
        "The best roadmap tasks include a deliverable, a deadline, and evidence to collect.",
        "A strong weekly plan should not exceed the hours the student can realistically protect.",
        "Before application season, every important claim should map to a vault item."
      ],
      actions: [
        "Mark one task as the non-negotiable task of the week.",
        "Split any task over 6 hours into two smaller proof-producing milestones.",
        "Attach a proof requirement to each leadership, project, and award task."
      ],
      cautions: ["Avoid adding tasks that only sound impressive but create no real achievement."]
    },
    activity: {
      mode: "mock",
      model,
      title: "Activity upgrade",
      summary: "Make the activity more specific, measurable, and connected to authentic interests.",
      insights: [
        "Generic activity descriptions weaken profile strength because they hide ownership.",
        "Impact metrics make an activity easier to evaluate and remember.",
        "Evidence links should show both the work and the student's role."
      ],
      actions: [
        "Define one before-and-after metric for the next four weeks.",
        "Add a proof link, photo, attendance log, testimonial, or public artifact.",
        "Rewrite the role description around decisions made and outcomes caused."
      ],
      cautions: ["Do not exaggerate title, scope, user count, or impact."]
    },
    opportunity: {
      mode: "mock",
      model,
      title: "Opportunity strategy",
      summary: "Prioritize opportunities that produce real artifacts, external feedback, or major-aligned validation.",
      insights: [
        "The best opportunity is the one the student can finish with proof.",
        "Major alignment matters more than prestige when time is limited.",
        "Deadlines should create useful urgency, not scattered applications."
      ],
      actions: [
        "Shortlist three opportunities and rank them by fit, proof value, and deadline risk.",
        "Save one opportunity that directly supports the intended major.",
        "Write the evidence you expect to collect before applying."
      ],
      cautions: ["Do not pay for expensive programs without checking value, fit, and alternatives."]
    },
    vault: {
      mode: "mock",
      model,
      title: "Proof audit",
      summary: "A strong vault item should verify the claim, show the student's role, and include a measurable result.",
      insights: [
        "Weak proof usually lacks source, context, role, or result.",
        "Project proof is strongest when it includes a public artifact and user or reviewer feedback.",
        "Collecting proof early makes activity descriptions and recommendation context more accurate."
      ],
      actions: [
        "Upgrade one weak vault item with source, date, role, and metric.",
        "Add a case study for the strongest project.",
        "Link each major activity to at least one proof item."
      ],
      cautions: ["Never fabricate certificates, screenshots, links, testimonials, or metrics."]
    },
    profile: {
      mode: "mock",
      model,
      title: "Profile strength lens",
      summary: "Improve the weakest score category with proof-backed work before broadening the profile.",
      insights: [
        "Readiness improves fastest when weak categories are tied to concrete artifacts.",
        "Narrative fit should emerge from real work, not a forced slogan.",
        "A clear gap analysis keeps the student from over-optimizing already strong areas."
      ],
      actions: [
        "Pick the lowest readiness category and define one proof-producing action.",
        "Write a one-sentence profile theme backed by three real artifacts.",
        "Review targets for official subject and assessment requirements."
      ],
      cautions: ["Do not interpret score as a result forecast."]
    },
    exam: {
      mode: "mock",
      model,
      title: "Exam priority",
      summary: "Prioritize official requirements, then signal value, then preparation feasibility.",
      insights: [
        "Diagnostics are more useful than passive study time.",
        "Language tests should be scheduled early if they are required.",
        "Major-specific assessments should match the student's target countries and programs."
      ],
      actions: [
        "Take one diagnostic and write an error log.",
        "Schedule two focused practice blocks this week.",
        "Attach official score reports or diagnostic evidence to the vault."
      ],
      cautions: ["Do not overload exam plans beyond available weekly hours."]
    },
    counselor: {
      mode: "mock",
      model,
      title: "Counselor response",
      summary: `For ${major}, focus on one real artifact, one measurable improvement, and one proof update this week.`,
      insights: [
        "The strongest next move is specific enough to complete.",
        "Proof turns effort into credible evidence.",
        "Ethical applications start with honest records."
      ],
      actions: [
        "Complete one roadmap task.",
        "Add proof to the vault.",
        "Ask for feedback from a teacher, mentor, or user."
      ],
      cautions: ["No fake achievements, dishonest essays, or inflated claims."]
    }
  };

  return defaults[kind];
}

export function mockAiCoach(kind: AiCoachKind, profile: StudentProfile, prompt?: string): AiCoachResponse {
  const response = base(kind, profile);
  if (!prompt) return response;
  return {
    ...response,
    summary: `${response.summary} For your prompt: "${prompt.slice(0, 140)}", start with the smallest proof-producing action.`
  };
}
