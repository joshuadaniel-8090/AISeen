export type Plan = "free" | "indie" | "pro";

export const PLAN_LIMITS: Record<
  Plan,
  {
    maxPrompts: number;
    maxCompetitors: number;
    engines: string[];
    historyDays: number;
    alerts: boolean;
    csvExport: boolean;
  }
> = {
  free: {
    maxPrompts: 3,
    maxCompetitors: 0,
    engines: ["chatgpt"],
    historyDays: 7,
    alerts: false,
    csvExport: false,
  },
  indie: {
    maxPrompts: 25,
    maxCompetitors: 1,
    engines: ["chatgpt", "perplexity", "google_aio"],
    historyDays: 7,
    alerts: true,
    csvExport: false,
  },
  pro: {
    maxPrompts: 100,
    maxCompetitors: 5,
    engines: ["chatgpt", "perplexity", "google_aio"],
    historyDays: 30,
    alerts: true,
    csvExport: true,
  },
};

export function getLimits(plan: Plan) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export function canAddPrompt(plan: Plan, currentCount: number): boolean {
  return currentCount < PLAN_LIMITS[plan].maxPrompts;
}

export function canAddCompetitor(plan: Plan, currentCount: number): boolean {
  return currentCount < PLAN_LIMITS[plan].maxCompetitors;
}

export function getAllowedEngines(plan: Plan): string[] {
  return PLAN_LIMITS[plan].engines;
}
