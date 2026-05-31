import type { StudentProfile } from "@/lib/types";

export type AiCoachKind =
  | "dashboard"
  | "roadmap"
  | "activity"
  | "opportunity"
  | "vault"
  | "profile"
  | "exam"
  | "counselor";

export interface AiCoachRequest {
  kind: AiCoachKind;
  prompt?: string;
  profile: StudentProfile;
  context?: unknown;
  clientId?: string;
}

export interface AiCoachResponse {
  mode: "openai" | "mock";
  model: string;
  source?: "openai" | "missing_key" | "quota" | "api_error" | "fallback";
  title: string;
  summary: string;
  insights: string[];
  actions: string[];
  cautions: string[];
  usageLimited?: boolean;
  limitReason?: string;
  retryAfterSeconds?: number;
  quota?: {
    remainingGlobal: number;
    remainingClient: number;
  };
}
