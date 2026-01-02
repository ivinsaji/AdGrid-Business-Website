// Simple keyword-based intent resolver
// No LLM, deterministic logic only.

export type IntentType =
    | "COMPARE_PLANS"
    | "PLAN_RECOMMENDATION"
    | "FEATURE_EXPLANATION"
    | "PRICING_QUESTION"
    | "CUSTOM_REQUIREMENT"
    | "GENERAL_OVERVIEW"
    | "SCALE_SPECIFIC"
    | "GROWTH_SPECIFIC"
    | "STARTER_SPECIFIC"
    | "UNKNOWN";

export interface IntentResult {
    intent: IntentType;
    confidence: number; // 0 to 1
    action?: string; // FSM Action to trigger
    directResponse?: string; // Immediate text response
}

const KEYWORDS: Record<IntentType, string[]> = {
    COMPARE_PLANS: ["compare", "difference", "vs", "versus", "better", "comparison"],
    PLAN_RECOMMENDATION: ["recommend", "best for", "which plan", "choose", "help me", "guide", "suggestion", "advice"],
    FEATURE_EXPLANATION: ["features", "analytics", "tracking", "attribution", "dashboard", "reporting", "intelligence", "channels"],
    PRICING_QUESTION: ["cost", "price", "expensive", "cheap", "rates", "billing", "afford", "budget", "month"],
    CUSTOM_REQUIREMENT: ["enterprise", "custom", "white label", "api", "volume", "large", "agency"],
    GENERAL_OVERVIEW: ["plans", "overview", "options", "what do you have", "list", "show me"],
    SCALE_SPECIFIC: ["scale", "enterprise plan", "multi-region", "dedicated"],
    GROWTH_SPECIFIC: ["growth", "performance plan", "middle"],
    STARTER_SPECIFIC: ["starter", "basic plan", "small"],
    UNKNOWN: []
};

export function resolveIntent(query: string): IntentResult {
    const text = query.toLowerCase().trim();

    // 1. Check for specific plan mentions first (Highest Priority)
    if (matches(text, KEYWORDS.SCALE_SPECIFIC)) {
        return {
            intent: "SCALE_SPECIFIC",
            confidence: 0.9,
            directResponse: "Scale is our enterprise solution. It includes custom data warehousing, multi-region support, and a dedicated account manager."
        };
    }
    if (matches(text, KEYWORDS.GROWTH_SPECIFIC)) {
        return {
            intent: "GROWTH_SPECIFIC",
            confidence: 0.9,
            directResponse: "Growth is our most popular plan for active advertisers. It unlocks real-time attribution, audience segmentation, and unlimited campaign flows."
        };
    }
    if (matches(text, KEYWORDS.STARTER_SPECIFIC)) {
        return {
            intent: "STARTER_SPECIFIC",
            confidence: 0.9,
            directResponse: "Starter creates a foundation for visibility. You get basic analytics, monthly reports, and standard API access."
        };
    }

    // 2. Map to FSM Actions
    if (matches(text, KEYWORDS.COMPARE_PLANS)) {
        return { intent: "COMPARE_PLANS", confidence: 0.8, action: "START_COMPARE" };
    }
    if (matches(text, KEYWORDS.PLAN_RECOMMENDATION)) {
        return { intent: "PLAN_RECOMMENDATION", confidence: 0.8, action: "START_GUIDED" };
    }
    if (matches(text, KEYWORDS.CUSTOM_REQUIREMENT)) {
        return { intent: "CUSTOM_REQUIREMENT", confidence: 0.8, action: "START_CUSTOM" };
    }

    // 3. Information Queries
    if (matches(text, KEYWORDS.GENERAL_OVERVIEW)) {
        return {
            intent: "GENERAL_OVERVIEW",
            confidence: 0.7,
            action: "ALL_PLANS" // Reusing the "All Plans" action which prints the summary
        };
    }
    if (matches(text, KEYWORDS.FEATURE_EXPLANATION)) {
        return {
            intent: "FEATURE_EXPLANATION",
            confidence: 0.7,
            directResponse: "All plans include our AdGrid Intelligence Core for real-time tracking. Higher tiers unlock deeper attribution, segmentation, and custom warehousing."
        };
    }
    if (matches(text, KEYWORDS.PRICING_QUESTION)) {
        return {
            intent: "PRICING_QUESTION",
            confidence: 0.7,
            directResponse: "Starter is $2,000/mo. Growth is $4,500/mo. Scale is $8,000/mo. All plans are billed monthly with no lock-in contracts."
        };
    }

    // 4. Fallback
    return {
        intent: "UNKNOWN",
        confidence: 0,
        directResponse: "I focus strictly on pricing strategy and plan comparisons. For detailed service inquiries, please contact our team directly."
    };
}

function matches(text: string, keywords: string[]): boolean {
    return keywords.some(kw => text.includes(kw));
}
