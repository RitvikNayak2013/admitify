import type { StudentProfile } from "@/lib/types";

export const sampleProfile: StudentProfile = {
  id: "sample-student",
  name: "Ari",
  grade: "Grade 11",
  country: "Indonesia",
  curriculum: "IB Diploma",
  intendedMajor: "Computer Science",
  targetCountries: ["United States", "United Kingdom", "Singapore"],
  dreamUniversities: ["mit", "stanford", "imperial", "nus"],
  currentGrades: "IB predicted 39/45, HL Math AA 6, HL Physics 6, HL Computer Science 7",
  testScores: [
    { exam: "IELTS", score: "7.5", date: "2025-11-12" },
    { exam: "SAT practice", score: "1460", date: "2026-04-01" }
  ],
  plannedExams: [
    {
      id: "plan-sat",
      examId: "sat",
      targetScore: "1520+",
      testDate: "2026-08-22",
      status: "Preparing"
    },
    {
      id: "plan-ap-cs",
      examId: "ap-cs-a",
      targetScore: "5",
      testDate: "2027-05-08",
      status: "Planning"
    }
  ],
  activities: [
    {
      id: "activity-robotics",
      name: "School Robotics Team",
      category: "STEM",
      role: "Software lead",
      startDate: "2024-08-01",
      endDate: "",
      hoursPerWeek: 5,
      impactMetrics: "Led autonomous navigation module; team placed 2nd regionally.",
      evidenceLinks: ["https://example.com/robotics-demo"],
      description: "Builds robot control code, mentors junior programmers, and documents match strategy.",
      depthScore: 78,
      leadershipScore: 72,
      uniquenessScore: 58,
      proofScore: 62
    },
    {
      id: "activity-tutoring",
      name: "Peer Coding Tutoring",
      category: "Service",
      role: "Founder",
      startDate: "2025-01-15",
      endDate: "",
      hoursPerWeek: 3,
      impactMetrics: "Tutored 18 students; created 12 worksheets; average student quiz score improved by 21%.",
      evidenceLinks: [],
      description: "Runs weekly Python sessions for younger students.",
      depthScore: 66,
      leadershipScore: 76,
      uniquenessScore: 46,
      proofScore: 38
    }
  ],
  awards: [
    {
      id: "award-hackathon",
      title: "Regional Student Hackathon Finalist",
      level: "Regional",
      date: "2025-09-10",
      description: "Built a disaster response routing prototype with a three-person team.",
      proofLink: "https://example.com/hackathon-finalist"
    }
  ],
  projects: [
    {
      id: "project-studyflow",
      title: "StudyFlow AI Planner",
      relatedMajor: "Computer Science",
      description: "A planning tool that turns exam syllabi into weekly practice blocks.",
      proofLinks: ["https://github.com/example/studyflow"],
      impact: "Used by 34 classmates during mock exam season.",
      status: "Launched"
    }
  ],
  research: [
    {
      id: "research-traffic",
      topic: "Using simple computer vision to estimate school parking congestion",
      mentor: "Physics teacher",
      output: "Draft poster and data notebook",
      proofLink: ""
    }
  ],
  leadership: [
    {
      id: "leadership-coding-club",
      role: "Co-president",
      organization: "Coding Club",
      impact: "Organized six workshops and one internal hack night.",
      proofLink: ""
    }
  ],
  volunteering: "Monthly community tech support sessions for older residents.",
  weeklyAvailableHours: 10,
  applicationYear: 2027,
  strengths: ["Programming initiative", "STEM coursework", "Peer teaching"],
  weaknesses: ["Need stronger project proof", "Need clearer research output", "SAT not official yet"],
  savedOpportunityIds: ["global-hack-lab", "machine-learning-foundations"],
  vaultItems: [
    {
      id: "vault-github-studyflow",
      title: "StudyFlow GitHub repository",
      type: "GitHub",
      relatedActivity: "StudyFlow AI Planner",
      link: "https://github.com/example/studyflow",
      filePlaceholder: "",
      description: "Code, README, and issue tracker for StudyFlow.",
      date: "2026-03-01",
      strengthScore: 72
    },
    {
      id: "vault-robotics-video",
      title: "Robotics autonomous demo",
      type: "Video",
      relatedActivity: "School Robotics Team",
      link: "https://example.com/robotics-demo",
      filePlaceholder: "",
      description: "Short demo of autonomous navigation route.",
      date: "2025-10-19",
      strengthScore: 64
    }
  ]
};
