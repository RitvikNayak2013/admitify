import type { AiCoachKind, AiCoachRequest, AiCoachResponse } from "@/lib/ai/types";
import { mockAiCoach } from "@/lib/ai/mock";
import { checkAndRecordAiUsage, getAiUsageConfig, truncateForAi } from "@/lib/ai/usage-limit";

const ethicalSystemPrompt = `You are Admitify AI, an ethical university-readiness strategist.

Non-negotiable rules:
- Never guarantee outcomes or discuss probabilities.
- Do not discuss result likelihoods or use outcome-prediction framing.
- Use the language Dream Fit Readiness Score, profile strength, gap analysis, roadmap, proof, and fit.
- Never invent, exaggerate, or suggest fake achievements, fake metrics, fake awards, fake research, fake internships, or fake proof.
- Never write dishonest essays or encourage lying.
- Give practical, specific, step-by-step advice that builds real achievements.
- Encourage official requirement verification and measurable evidence.
- Keep the response concise, premium, and useful for a student and family.`;

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 80 },
    summary: { type: "string", maxLength: 360 },
    insights: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string", maxLength: 160 }
    },
    actions: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: { type: "string", maxLength: 160 }
    },
    cautions: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string", maxLength: 160 }
    }
  },
  required: ["title", "summary", "insights", "actions", "cautions"]
};

function promptForKind(kind: AiCoachKind) {
  const prompts: Record<AiCoachKind, string> = {
    dashboard:
      "Create an executive strategy brief for the dashboard. Explain the highest-leverage focus, why it matters, and what the student should do this week.",
    roadmap:
      "Review the roadmap for realism, sequencing, proof quality, weekly workload, and major fit. Recommend refinements without replacing the deterministic roadmap.",
    activity:
      "Coach this activity. Identify how to make it less generic, more measurable, more connected to the intended major, and better supported by proof.",
    opportunity:
      "Rank and explain opportunity strategy. Focus on fit, proof value, deadlines, cost sensitivity, and what evidence the student should collect.",
    vault:
      "Audit portfolio proof. Identify weak evidence patterns and how to make proof stronger, more verifiable, and more useful for future applications.",
    profile:
      "Review profile strength and gap analysis. Identify the clearest improvement areas and the next proof-producing actions.",
    exam:
      "Advise on exam priority. Focus on official requirements, target countries, timing, diagnostics, and realistic weekly preparation.",
    counselor:
      "Answer the student's question as a practical university-readiness coach. Keep it specific, honest, proof-first, and step-by-step."
  };
  return prompts[kind];
}

function extractResponseText(data: unknown) {
  if (typeof data !== "object" || data === null) return "";
  const maybe = data as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        text?: string;
        type?: string;
      }>;
    }>;
  };
  if (typeof maybe.output_text === "string") return maybe.output_text;
  return (
    maybe.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text ?? "")
      .join("\n")
      .trim() ?? ""
  );
}

function normalizeParsed(value: unknown, mode: AiCoachResponse["mode"], model: string): AiCoachResponse | null {
  if (typeof value !== "object" || value === null) return null;
  const parsed = value as Partial<AiCoachResponse>;
  if (!parsed.title || !parsed.summary || !Array.isArray(parsed.insights) || !Array.isArray(parsed.actions)) {
    return null;
  }
  return {
    mode,
    model,
    title: String(parsed.title),
    summary: String(parsed.summary),
    insights: parsed.insights.map(String).slice(0, 5),
    actions: parsed.actions.map(String).slice(0, 5),
    cautions: Array.isArray(parsed.cautions) ? parsed.cautions.map(String).slice(0, 3) : ["Keep all claims honest and proof-backed."]
  };
}

export async function createAiCoachResponse(request: AiCoachRequest): Promise<AiCoachResponse> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.GPT5_API_KEY || process.env.GPT_5_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5";
  const effort = process.env.OPENAI_REASONING_EFFORT || "minimal";

  if (!apiKey) {
    return {
      ...mockAiCoach(request.kind, request.profile, request.prompt),
      source: "missing_key",
      limitReason: "OpenAI is not connected yet. Add OPENAI_API_KEY to .env.local and restart the server.",
      summary:
        "OpenAI is not connected yet, so Admitify is using built-in fallback guidance. Add your API key to `.env.local`, restart the server, and this coach will switch to OpenAI."
    };
  }

  const usage = checkAndRecordAiUsage(request.clientId);
  if (!usage.allowed) {
    const fallback = mockAiCoach(request.kind, request.profile, request.prompt);
    const retryMessage = usage.retryAfterSeconds ? ` Try again in about ${usage.retryAfterSeconds} seconds.` : "";
    return {
      ...fallback,
      source: "quota",
      summary: `${usage.reason}${retryMessage} Admitify used deterministic fallback guidance instead, so the API key is protected.`,
      usageLimited: true,
      limitReason: usage.reason,
      retryAfterSeconds: usage.retryAfterSeconds,
      quota: {
        remainingGlobal: usage.remainingGlobal,
        remainingClient: usage.remainingClient
      }
    };
  }

  const studentContext = {
    profile: request.profile,
    context: request.context,
    userPrompt: request.prompt
  };
  const studentContextText = truncateForAi(studentContext);
  const maxOutputTokens = getAiUsageConfig().maxOutputTokens;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        reasoning: { effort },
        max_output_tokens: maxOutputTokens,
        text: {
          format: {
            type: "json_schema",
            name: "admitify_ai_coach",
            strict: true,
            schema: responseSchema
          }
        },
        input: [
          {
            role: "system",
            content: ethicalSystemPrompt
          },
          {
            role: "user",
            content: `${promptForKind(request.kind)}

Return only JSON matching the schema. Keep every field short and concrete. Student/context data:
${studentContextText}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        ...mockAiCoach(request.kind, request.profile, request.prompt),
        source: "api_error",
        limitReason: `OpenAI request failed with status ${response.status}.`,
        summary: `OpenAI is configured, but the request failed with status ${response.status}. Admitify used fallback guidance. ${errorText ? "Check your key, model name, billing, and project access." : ""}`
      };
    }

    const data = await response.json();
    const outputText = extractResponseText(data);
    const parsed = JSON.parse(outputText);
    const normalized = normalizeParsed(parsed, "openai", model) ?? mockAiCoach(request.kind, request.profile, request.prompt);
    return {
      ...normalized,
      source: "openai",
      quota: {
        remainingGlobal: usage.remainingGlobal,
        remainingClient: usage.remainingClient
      }
    };
  } catch {
    return {
      ...mockAiCoach(request.kind, request.profile, request.prompt),
      source: "api_error",
      limitReason: "OpenAI request could not be completed.",
      summary: "Admitify could not complete the GPT-5 call, so it used deterministic fallback guidance for this panel."
    };
  }
}
