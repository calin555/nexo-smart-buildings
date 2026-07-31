import "server-only";

import { env } from "@/lib/env";
import { FixturePlanAnalysisProvider } from "@/modules/plan-analysis/fixture-provider";
import { OpenAIPlanAnalysisProvider } from "@/modules/plan-analysis/openai-provider";
import type { PlanAnalysisProvider } from "@/modules/plan-analysis/provider";

export function isPlanAnalysisConfigured(): boolean {
  return Boolean(env.OPENAI_API_KEY) || fixtureEnabled();
}

export function getPlanAnalysisProvider(): PlanAnalysisProvider {
  if (fixtureEnabled()) return new FixturePlanAnalysisProvider();
  if (!env.OPENAI_API_KEY) {
    throw new Error("PLAN_ANALYSIS_NOT_CONFIGURED");
  }
  return new OpenAIPlanAnalysisProvider(env.OPENAI_API_KEY, env.PLAN_ANALYSIS_MODEL);
}

function fixtureEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.E2E_PLAN_ANALYSIS_ENABLED === "1";
}
