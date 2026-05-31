export type Selectivity = "Highly selective" | "Selective" | "Moderate";
export type TestingExpectation = "Required" | "Recommended" | "Optional" | "Situational";
export type CostLevel = "High" | "Medium" | "Lower";
export type ApplicationSystem =
  | "Common App"
  | "Coalition"
  | "UC Application"
  | "UCAS"
  | "Direct"
  | "OUAC";

export type ScoreLabel = "Needs focus" | "Developing" | "Competitive" | "Excellent";

export interface ScoreResult {
  numeric: number;
  label: ScoreLabel;
  explanation: string;
  recommendedImprovements: string[];
}

export interface ReadinessScore {
  overall: ScoreResult;
  academics: ScoreResult;
  tests: ScoreResult;
  extracurricularDepth: ScoreResult;
  awards: ScoreResult;
  projectsAndProof: ScoreResult;
  leadership: ScoreResult;
  narrativeFit: ScoreResult;
  weights: Record<string, number>;
}

export interface GapAnalysis {
  biggestGap: string;
  summary: string;
  gaps: Array<{
    category: string;
    severity: "High" | "Medium" | "Low";
    explanation: string;
    nextStep: string;
  }>;
}

export interface WeeklyAction {
  id: string;
  title: string;
  category: RoadmapCategory;
  estimatedHours: number;
  whyItMatters: string;
}

export interface Program {
  name: string;
  school?: string;
  sampleExpectations: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  region: string;
  logoDomain?: string;
  strongMajors: string[];
  selectivity: Selectivity;
  academicExpectations: string;
  testingExpectations: TestingExpectation;
  portfolioExpectations: string;
  suggestedStudentProfile: string;
  deadlinesPlaceholder: string;
  costLevel: CostLevel;
  applicationSystem: ApplicationSystem;
  programs: Program[];
  dataNote: string;
}

export interface Exam {
  id: string;
  name: string;
  relevantCountries: string[];
  relevantMajors: string[];
  idealTargetScore: string;
  preparationTimeline: string;
  priority: "High" | "Medium" | "Low";
  expectation: TestingExpectation;
}

export interface TestScore {
  exam: string;
  score: string;
  date?: string;
}

export interface ExamPlan {
  id: string;
  examId: string;
  targetScore: string;
  testDate?: string;
  status: "Considering" | "Planning" | "Preparing" | "Completed";
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  role: string;
  startDate?: string;
  endDate?: string;
  hoursPerWeek: number;
  impactMetrics: string;
  evidenceLinks: string[];
  description: string;
  depthScore: number;
  leadershipScore: number;
  uniquenessScore: number;
  proofScore: number;
}

export interface Award {
  id: string;
  title: string;
  level: "School" | "Regional" | "National" | "International" | "Other";
  date?: string;
  description: string;
  proofLink?: string;
}

export interface Project {
  id: string;
  title: string;
  relatedMajor: string;
  description: string;
  proofLinks: string[];
  impact: string;
  status: "Idea" | "Building" | "Launched" | "Documented";
}

export interface ResearchExperience {
  id: string;
  topic: string;
  mentor?: string;
  output: string;
  proofLink?: string;
}

export interface LeadershipExperience {
  id: string;
  role: string;
  organization: string;
  impact: string;
  proofLink?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  type:
    | "Hackathon"
    | "Olympiad"
    | "Research program"
    | "Summer school"
    | "Internship"
    | "Scholarship"
    | "Volunteering"
    | "Online course"
    | "Writing competition";
  country: string;
  mode: "Online" | "In person" | "Hybrid";
  deadline: string;
  ageRange: string;
  cost: "Free" | "Low" | "Medium" | "High";
  difficulty: "Introductory" | "Intermediate" | "Competitive";
  relevantMajors: string[];
  linkPlaceholder: string;
  whyItHelps: string;
}

export type RoadmapCategory =
  | "Academic"
  | "Exam"
  | "Extracurricular"
  | "Project"
  | "Research"
  | "Leadership"
  | "Essay"
  | "Portfolio Proof"
  | "Opportunity";

export interface RoadmapTask {
  id: string;
  timeframe: "This week" | "This month" | "Next 3 months" | "Next 6 months" | "Before applications";
  title: string;
  category: RoadmapCategory;
  priority: "High" | "Medium" | "Low";
  estimatedHours: number;
  deadline: string;
  whyItMatters: string;
  evidenceToCollect: string[];
  completed: boolean;
}

export interface VaultItem {
  id: string;
  title: string;
  type:
    | "Certificate"
    | "GitHub"
    | "Website"
    | "Paper"
    | "Blog"
    | "Video"
    | "Photo"
    | "Recommendation"
    | "Transcript"
    | "Test Score"
    | "Award"
    | "Media";
  relatedActivity?: string;
  link?: string;
  filePlaceholder?: string;
  description: string;
  date?: string;
  strengthScore: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  country: string;
  curriculum: string;
  intendedMajor: string;
  targetCountries: string[];
  dreamUniversities: string[];
  currentGrades: string;
  testScores: TestScore[];
  plannedExams: ExamPlan[];
  activities: Activity[];
  awards: Award[];
  projects: Project[];
  research: ResearchExperience[];
  leadership: LeadershipExperience[];
  volunteering: string;
  weeklyAvailableHours: number;
  applicationYear: number;
  strengths: string[];
  weaknesses: string[];
  savedOpportunityIds: string[];
  vaultItems: VaultItem[];
}
