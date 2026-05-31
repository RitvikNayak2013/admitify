import { NextResponse } from "next/server";
import { createAiCoachResponse } from "@/lib/ai/server";
import { getClientIdFromRequest } from "@/lib/ai/usage-limit";
import type { AiCoachRequest } from "@/lib/ai/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AiCoachRequest>;

  if (!body.kind || !body.profile) {
    return NextResponse.json({ error: "Missing AI coach kind or profile." }, { status: 400 });
  }

  const result = await createAiCoachResponse({
    kind: body.kind,
    profile: body.profile,
    prompt: body.prompt,
    clientId: getClientIdFromRequest(request),
    context: body.context
  });

  return NextResponse.json(result);
}
