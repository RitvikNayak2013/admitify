import { createHash } from "node:crypto";

type UsageBucket = {
  day: string;
  count: number;
  lastRequestAt: number;
};

type UsageStore = {
  global: UsageBucket;
  clients: Map<string, UsageBucket>;
};

export type UsageLimitResult =
  | {
      allowed: true;
      remainingGlobal: number;
      remainingClient: number;
    }
  | {
      allowed: false;
      reason: string;
      retryAfterSeconds?: number;
      remainingGlobal: number;
      remainingClient: number;
    };

const globalForUsage = globalThis as typeof globalThis & {
  __admitifyAiUsageStore?: UsageStore;
};

function getStore(): UsageStore {
  if (!globalForUsage.__admitifyAiUsageStore) {
    globalForUsage.__admitifyAiUsageStore = {
      global: freshBucket(),
      clients: new Map()
    };
  }
  return globalForUsage.__admitifyAiUsageStore;
}

function freshBucket(): UsageBucket {
  return {
    day: new Date().toISOString().slice(0, 10),
    count: 0,
    lastRequestAt: 0
  };
}

function resetIfNewDay(bucket: UsageBucket) {
  const today = new Date().toISOString().slice(0, 10);
  if (bucket.day !== today) {
    bucket.day = today;
    bucket.count = 0;
    bucket.lastRequestAt = 0;
  }
}

function numberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function getAiUsageConfig() {
  return {
    openAiEnabled: process.env.AI_OPENAI_ENABLED !== "false",
    dailyGlobalLimit: numberEnv("AI_DAILY_REQUEST_LIMIT", 40),
    dailyClientLimit: numberEnv("AI_DAILY_REQUEST_LIMIT_PER_CLIENT", 5),
    minSecondsBetweenClientRequests: numberEnv("AI_MIN_SECONDS_BETWEEN_REQUESTS", 12),
    maxContextChars: numberEnv("AI_MAX_CONTEXT_CHARS", 16000),
    maxOutputTokens: numberEnv("AI_MAX_OUTPUT_TOKENS", 1200)
  };
}

export function getClientIdFromRequest(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? forwardedFor ?? "local-demo";
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";
  return createHash("sha256").update(`${ip}:${userAgent}`).digest("hex").slice(0, 24);
}

export function checkAndRecordAiUsage(clientId = "anonymous"): UsageLimitResult {
  const config = getAiUsageConfig();

  if (!config.openAiEnabled) {
    return {
      allowed: false,
      reason: "OpenAI calls are disabled for this demo.",
      remainingGlobal: 0,
      remainingClient: 0
    };
  }

  const store = getStore();
  resetIfNewDay(store.global);

  const clientBucket = store.clients.get(clientId) ?? freshBucket();
  resetIfNewDay(clientBucket);

  const remainingGlobal = Math.max(0, config.dailyGlobalLimit - store.global.count);
  const remainingClient = Math.max(0, config.dailyClientLimit - clientBucket.count);

  if (config.dailyGlobalLimit === 0) {
    return {
      allowed: false,
      reason: "The demo-wide OpenAI quota is set to zero.",
      remainingGlobal: 0,
      remainingClient
    };
  }

  if (config.dailyClientLimit === 0) {
    return {
      allowed: false,
      reason: "Per-client OpenAI usage is disabled for this demo.",
      remainingGlobal,
      remainingClient: 0
    };
  }

  if (store.global.count >= config.dailyGlobalLimit) {
    return {
      allowed: false,
      reason: "The demo-wide OpenAI daily quota has been reached.",
      remainingGlobal: 0,
      remainingClient
    };
  }

  if (clientBucket.count >= config.dailyClientLimit) {
    return {
      allowed: false,
      reason: "This visitor has reached the OpenAI daily quota for the demo.",
      remainingGlobal,
      remainingClient: 0
    };
  }

  const now = Date.now();
  const elapsedSeconds = clientBucket.lastRequestAt ? Math.floor((now - clientBucket.lastRequestAt) / 1000) : Number.POSITIVE_INFINITY;
  if (elapsedSeconds < config.minSecondsBetweenClientRequests) {
    const retryAfterSeconds = Math.max(1, config.minSecondsBetweenClientRequests - elapsedSeconds);
    return {
      allowed: false,
      reason: "Please wait before sending another OpenAI request.",
      retryAfterSeconds,
      remainingGlobal,
      remainingClient
    };
  }

  store.global.count += 1;
  clientBucket.count += 1;
  clientBucket.lastRequestAt = now;
  store.clients.set(clientId, clientBucket);

  return {
    allowed: true,
    remainingGlobal: Math.max(0, config.dailyGlobalLimit - store.global.count),
    remainingClient: Math.max(0, config.dailyClientLimit - clientBucket.count)
  };
}

export function truncateForAi(value: unknown) {
  const maxContextChars = getAiUsageConfig().maxContextChars;
  const text = JSON.stringify(value) ?? "";
  if (text.length <= maxContextChars) return text;
  return `${text.slice(0, maxContextChars)}\n\n[Context truncated by Admitify demo usage limits.]`;
}
