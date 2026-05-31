import { NextResponse } from "next/server";
import { createAiCoachResponse } from "@/lib/ai/server";
import { getClientIdFromRequest } from "@/lib/ai/usage-limit";
import type { StudentProfile } from "@/lib/types";

function formatCounselorReply(result: Awaited<ReturnType<typeof createAiCoachResponse>>) {
  const sections = [
    result.summary,
    result.insights.length ? `What I notice:\n${result.insights.map((item) => `- ${item}`).join("\n")}` : "",
    result.actions.length ? `Next steps:\n${result.actions.map((item) => `- ${item}`).join("\n")}` : "",
    result.cautions.length ? `Keep honest:\n${result.cautions.map((item) => `- ${item}`).join("\n")}` : ""
  ].filter(Boolean);

  return sections.join("\n\n");
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    message?: string;
    profile?: StudentProfile;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  const message = body.message?.trim() ?? "";
  const profile = body.profile;

  if (!message || !profile) {
    return NextResponse.json({ reply: "Please send a question and profile context." }, { status: 400 });
  }

  const result = await createAiCoachResponse({
    kind: "counselor",
    profile,
    prompt: message,
    clientId: getClientIdFromRequest(request),
    context: {
      recentConversation: body.history?.slice(-8) ?? []
    }
  });

  return NextResponse.json({
    reply: formatCounselorReply(result),
    mode: result.mode,
    model: result.model,
    usageLimited: result.usageLimited,
    limitReason: result.limitReason,
    retryAfterSeconds: result.retryAfterSeconds,
    quota: result.quota
  });
}
