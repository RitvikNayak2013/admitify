import type { Exam } from "@/lib/types";

export const exams: Exam[] = [
  {
    id: "sat",
    name: "SAT",
    relevantCountries: ["United States", "Singapore", "Hong Kong", "Canada"],
    relevantMajors: ["All majors"],
    idealTargetScore: "1500+ for highly selective US targets; verify each institution.",
    preparationTimeline: "12-20 weeks with weekly diagnostics and targeted practice.",
    priority: "High",
    expectation: "Recommended"
  },
  {
    id: "act",
    name: "ACT",
    relevantCountries: ["United States", "Canada"],
    relevantMajors: ["All majors"],
    idealTargetScore: "34+ for highly selective US targets; verify each institution.",
    preparationTimeline: "12-20 weeks with section-specific practice.",
    priority: "Medium",
    expectation: "Recommended"
  },
  {
    id: "ap-calculus-bc",
    name: "AP Calculus BC",
    relevantCountries: ["United States", "Canada", "Singapore", "Hong Kong"],
    relevantMajors: ["Computer Science", "Engineering", "Mathematics", "Economics"],
    idealTargetScore: "5 as a strong signal when APs fit your curriculum.",
    preparationTimeline: "Full academic year or 16-week focused review.",
    priority: "High",
    expectation: "Recommended"
  },
  {
    id: "ap-cs-a",
    name: "AP Computer Science A",
    relevantCountries: ["United States", "Canada", "Singapore", "Hong Kong"],
    relevantMajors: ["Computer Science", "Data Science", "Engineering"],
    idealTargetScore: "5 when available and aligned with school plan.",
    preparationTimeline: "12-16 weeks if you already code; longer for first programming course.",
    priority: "High",
    expectation: "Recommended"
  },
  {
    id: "ap-physics-c",
    name: "AP Physics C Mechanics",
    relevantCountries: ["United States", "Canada", "Singapore", "Hong Kong"],
    relevantMajors: ["Engineering", "Physics", "Computer Science"],
    idealTargetScore: "5 for STEM-heavy portfolios when available.",
    preparationTimeline: "16-24 weeks with calculus-based problem sets.",
    priority: "Medium",
    expectation: "Recommended"
  },
  {
    id: "ielts",
    name: "IELTS",
    relevantCountries: ["United Kingdom", "Canada", "Singapore", "Hong Kong", "Switzerland"],
    relevantMajors: ["All majors"],
    idealTargetScore: "7.0-7.5+ depending on university and program.",
    preparationTimeline: "6-10 weeks for fluent students, longer if writing/speaking need work.",
    priority: "High",
    expectation: "Situational"
  },
  {
    id: "toefl",
    name: "TOEFL",
    relevantCountries: ["United States", "Canada", "United Kingdom", "Singapore", "Hong Kong", "Switzerland"],
    relevantMajors: ["All majors"],
    idealTargetScore: "100+ often reads as strong; verify program minimums.",
    preparationTimeline: "6-10 weeks with speaking and writing practice.",
    priority: "High",
    expectation: "Situational"
  },
  {
    id: "a-levels",
    name: "A Levels",
    relevantCountries: ["United Kingdom", "Singapore", "Hong Kong", "Canada", "Switzerland"],
    relevantMajors: ["All majors"],
    idealTargetScore: "A*/A profile for highly selective targets; subject choices matter.",
    preparationTimeline: "Full curriculum timeline with early predicted-grade planning.",
    priority: "High",
    expectation: "Required"
  },
  {
    id: "ib",
    name: "IB Diploma",
    relevantCountries: ["United States", "United Kingdom", "Canada", "Singapore", "Hong Kong", "Switzerland"],
    relevantMajors: ["All majors"],
    idealTargetScore: "38-42+ can be competitive for many selective targets; verify by course.",
    preparationTimeline: "Two-year program with IA/EE planning and exam review.",
    priority: "High",
    expectation: "Required"
  },
  {
    id: "tmua",
    name: "TMUA",
    relevantCountries: ["United Kingdom"],
    relevantMajors: ["Computer Science", "Economics", "Mathematics"],
    idealTargetScore: "Strong percentile performance; verify course-specific use.",
    preparationTimeline: "10-16 weeks with timed mathematical reasoning practice.",
    priority: "Medium",
    expectation: "Situational"
  },
  {
    id: "step",
    name: "STEP",
    relevantCountries: ["United Kingdom"],
    relevantMajors: ["Mathematics", "Computer Science"],
    idealTargetScore: "Course-specific grades vary. Treat as advanced proof of math readiness.",
    preparationTimeline: "20+ weeks with deep problem-solving practice.",
    priority: "High",
    expectation: "Situational"
  },
  {
    id: "mat",
    name: "MAT",
    relevantCountries: ["United Kingdom"],
    relevantMajors: ["Mathematics", "Computer Science"],
    idealTargetScore: "Strong performance for Oxford-related courses; verify current test usage.",
    preparationTimeline: "12-18 weeks with past-paper strategy.",
    priority: "High",
    expectation: "Situational"
  },
  {
    id: "lnat",
    name: "LNAT",
    relevantCountries: ["United Kingdom", "Hong Kong", "Singapore"],
    relevantMajors: ["Law"],
    idealTargetScore: "Strong multiple-choice score plus disciplined essay practice.",
    preparationTimeline: "8-12 weeks with reading, argument, and timed essay practice.",
    priority: "High",
    expectation: "Situational"
  },
  {
    id: "ucat",
    name: "UCAT",
    relevantCountries: ["United Kingdom", "Singapore", "Hong Kong"],
    relevantMajors: ["Medicine", "Dentistry"],
    idealTargetScore: "High band and strong situational judgment; verify medical school policies.",
    preparationTimeline: "8-12 weeks of timed drills and mocks.",
    priority: "High",
    expectation: "Situational"
  }
];
