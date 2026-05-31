import { NextResponse } from "next/server";
import { getAiUsageConfig } from "@/lib/ai/usage-limit";

export async function GET() {
  const config = getAiUsageConfig();
  const key = (process.env.OPENAI_API_KEY || process.env.GPT5_API_KEY || process.env.GPT_5_API_KEY)?.trim();
  return NextResponse.json({
    configured: Boolean(key),
    enabled: config.openAiEnabled,
    model: process.env.OPENAI_MODEL || "gpt-5",
    reasoningEffort: process.env.OPENAI_REASONING_EFFORT || "minimal",
    limits: {
      dailyGlobalLimit: config.dailyGlobalLimit,
      dailyClientLimit: config.dailyClientLimit,
      minSecondsBetweenClientRequests: config.minSecondsBetweenClientRequests,
      maxOutputTokens: config.maxOutputTokens
    }
  });
}
