export interface UserContext {
    spend?: "LOW" | "MID" | "HIGH" | "ENTERPRISE";
    channels?: "ONLINE" | "OFFLINE" | "BOTH";
    goal?: "VISIBILITY" | "PERFORMANCE" | "ANALYTICS";
}

export type PlanRecommendation = "STARTER" | "GROWTH" | "SCALE";

export const SPEND_OPTIONS = [
    { label: "Under $2,000", value: "LOW" },
    { label: "$2,000 – $5,000", value: "MID" },
    { label: "$5,000 – $15,000", value: "HIGH" },
    { label: "$15,000+", value: "ENTERPRISE" }
] as const;

export const CHANNEL_OPTIONS = [
    { label: "Online only", value: "ONLINE" },
    { label: "Offline only", value: "OFFLINE" },
    { label: "Online + Offline", value: "BOTH" }
] as const;

export const GOAL_OPTIONS = [
    { label: "Visibility & awareness", value: "VISIBILITY" },
    { label: "Performance & conversions", value: "PERFORMANCE" },
    { label: "Analytics & attribution", value: "ANALYTICS" }
] as const;

export function recommendPlan(ctx: UserContext): PlanRecommendation {
    if (ctx.spend === "ENTERPRISE") return "SCALE";

    if (ctx.channels === "BOTH") return "GROWTH";
    if (ctx.goal === "ANALYTICS") return "GROWTH";
    if (ctx.goal === "PERFORMANCE") return "GROWTH";

    return "STARTER";
}
