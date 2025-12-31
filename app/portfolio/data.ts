export interface Metric {
    value: string;
    label: string;
}

export interface Project {
    id: string;
    client: string;
    engagement: string;
    objective: string;
    metrics: Metric[];
    year: string;
    // New Fields for Case Study Page
    context: string;
    strategy: string[];
    signals: string[];
}

export const PORTFOLIO_PROJECTS: Project[] = [
    {
        id: "p1",
        client: "URBAN MART",
        engagement: "OMNICHANNEL GROWTH",
        objective: "Drive in-store visibility while capturing high-intent digital demand.",
        year: "2024",
        metrics: [
            { value: "+37%", label: "FOOTFALL-TO-CLICK" },
            { value: "920K", label: "INTERACTIONS" },
            { value: "MULTI-TOUCH", label: "ATTRIBUTION" }
        ],
        context: "Urban Mart operates across multiple physical retail locations with limited insight into how offline exposure influenced online behavior.",
        strategy: [
            "Integrated DOOH placements with QR-based tracking",
            "Unified paid social and search campaigns",
            "Built a real-time attribution layer"
        ],
        signals: [
            "High engagement clusters during evening footfall",
            "Offline exposure increased branded search intent",
            "Cross-channel attribution revealed underpriced traffic sources"
        ]
    },
    {
        id: "p2",
        client: "CONFIDENTIAL / FINTECH",
        engagement: "PERFORMANCE MARKETING",
        objective: "Scale paid acquisition while reducing cost volatility.",
        year: "2024",
        metrics: [
            { value: "↓ 28%", label: "CPA" },
            { value: "4.1×", label: "ROAS" },
            { value: "REAL-TIME", label: "OPTIMIZATION" }
        ],
        context: "Rapid growth targets with unstable acquisition costs.",
        strategy: [
            "Channel diversification",
            "Creative testing informed by performance data",
            "Continuous budget reallocation"
        ],
        signals: [
            "Creative fatigue detected early",
            "Certain audience segments showed disproportionate ROAS"
        ]
    },
    {
        id: "p3",
        client: "NEON",
        engagement: "DOOH → DIGITAL CONVERSION",
        objective: "Turn high-traffic outdoor placements into measurable online actions.",
        year: "2024",
        metrics: [
            { value: "1.6M", label: "QR SCANS" },
            { value: "+44%", label: "ENGAGEMENT LIFT" },
            { value: "OFFLINE", label: "ATTRIBUTION" }
        ],
        context: "Strong offline presence with no attribution visibility.",
        strategy: [
            "Smart QR placements",
            "Geo-fenced remarketing",
            "Landing page optimization"
        ],
        signals: [
            "Peak scan times aligned with commute hours",
            "Mobile-first interactions dominated"
        ]
    },
    {
        id: "p4",
        client: "AURA FITNESS",
        engagement: "BRAND + DATA ACTIVATION",
        objective: "Launch a new brand with performance-led visibility.",
        year: "2023",
        metrics: [
            { value: "3×", label: "SEARCH GROWTH" },
            { value: "18K", label: "LEADS" },
            { value: "UNIFIED", label: "TRACKING" }
        ],
        context: "A new market entrant needing immediate brand traction and lead generation.",
        strategy: [
            "High-impact visual campaigns",
            "Data-driven audience targeting",
            "Conversion rate optimization on landing pages"
        ],
        signals: [
            "Video content drove highest brand recall",
            "Retargeting pools showed 2x conversion rate"
        ]
    },
    {
        id: "p5",
        client: "METRO FOODS",
        engagement: "LOCAL PERFORMANCE",
        objective: "Increase regional demand with hyper-local targeting.",
        year: "2023",
        metrics: [
            { value: "+52%", label: "STORE CONVERSIONS" },
            { value: "↓ 33%", label: "CPL" },
            { value: "GEO", label: "INSIGHTS" }
        ],
        context: "Regional player facing stiff competition from national chains.",
        strategy: [
            "Hyper-local geo-targeting",
            "Store-specific offers",
            "Community engagement initiatives"
        ],
        signals: [
            "Proximity to store correlated strongly with conversion",
            "Local imagery outperformed generic stock assets"
        ]
    },
    {
        id: "p6",
        client: "CONFIDENTIAL / EDTECH",
        engagement: "FUNNEL OPTIMIZATION",
        objective: "Improve conversion efficiency across a multi-step funnel.",
        year: "2023",
        metrics: [
            { value: "+29%", label: "SIGNUPS" },
            { value: "↓ 24%", label: "DROP-OFF" },
            { value: "FULL", label: "DIAGNOSTICS" }
        ],
        context: "High traffic volume but low conversion through complex application process.",
        strategy: [
            "Funnel step analysis and simplification",
            "Email nurturing sequences",
            "Retargeting dropped users"
        ],
        signals: [
            "Form length was primary friction point",
            "Testimonials at checkout interactions increased confidence"
        ]
    },
    {
        id: "p7",
        client: "NOVA REALTY",
        engagement: "OFFLINE → ONLINE",
        objective: "Measure the digital impact of physical campaigns.",
        year: "2022",
        metrics: [
            { value: "740K", label: "CAPTURES" },
            { value: "+41%", label: "INQUIRY RATE" },
            { value: "5-CH", label: "ATTRIBUTION" }
        ],
        context: "Significant investment in print and billboard without clear ROI linkage.",
        strategy: [
            "Unique tracking URLs and phone numbers",
            "CRM integration for lead source tracking",
            "Digital twin campaigns"
        ],
        signals: [
            "Billboard locations drove specific neighborhood searches",
            "Weekend print ads had longer attribution tail"
        ]
    },
    {
        id: "p8",
        client: "PULSE RETAIL",
        engagement: "PERFORMANCE SCALING",
        objective: "Scale acquisition without sacrificing efficiency.",
        year: "2022",
        metrics: [
            { value: "2.8×", label: "SPEND SCALE" },
            { value: "STABLE", label: "CPA" },
            { value: "REAL-TIME", label: "CONTROLS" }
        ],
        context: "Need to triple monthly spend while maintaining strict CPA caps.",
        strategy: [
            "Automated bid strategies",
            "Audience expansion lookalikes",
            "Creative velocity increase"
        ],
        signals: [
            "Broad match scaling effective with negative keyword sculpting",
            "Video ads maintained lower CPA at scale"
        ]
    },
    {
        id: "p9",
        client: "CONFIDENTIAL / HEALTH",
        engagement: "DATA INTELLIGENCE",
        objective: "Create visibility across fragmented marketing channels.",
        year: "2022",
        metrics: [
            { value: "UNIFIED", label: "ANALYTICS" },
            { value: "CROSS-CH", label: "ATTRIBUTION" },
            { value: "ACTIONABLE", label: "REPORTING" }
        ],
        context: "Siloed data across social, search, and programmatic preventing holistic view.",
        strategy: [
            "Data warehouse centralization",
            "Unified dashboard creation",
            "Attribution modeling implementation"
        ],
        signals: [
            "Social assisted search conversions significantly",
            "Time-to-conversion was longer than expected"
        ]
    },
    {
        id: "p10",
        client: "ORBIT EVENTS",
        engagement: "EXPERIENTIAL MARKETING",
        objective: "Convert event engagement into sustained digital interest.",
        year: "2021",
        metrics: [
            { value: "112K", label: "ACTIONS" },
            { value: "+46%", label: "REMARKETING" },
            { value: "AUDIENCE", label: "INTEL" }
        ],
        context: "Large scale annual event needing to capture attendee data for year-round engagement.",
        strategy: [
            "Event app gamification",
            "Post-event content drip",
            "Community platform activation"
        ],
        signals: [
            "Gamification participation predicted long-term retention",
            "Photo sharing drove highest organic reach"
        ]
    }
];
