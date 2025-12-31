export interface Article {
    slug: string;
    category: string;
    title: string;
    summary: string;
    date: string;
    readTime: string;
    content: React.ReactNode; // Using React Node to allow simplified HTML/component structured content
}

export const CATEGORIES = ["ALL", "MARKETING", "ANALYTICS", "DOOH", "STRATEGY", "GROWTH", "DATA", "CULTURE"];

export const ALL_ARTICLES: Article[] = [
    // --- EXISTING ARTICLES ---
    {
        category: "STRATEGY",
        title: "The Architecture of Confidence",
        summary: "Why high-growth brands are going quiet in an era of noise.",
        date: "OCT 12",
        readTime: "8 MIN",
        slug: "architecture-of-confidence",
        content: `
            <p>In an ecosystem defined by loudness, silence has become a luxury good. The most confident brands of the next decade won't be the ones shouting the loudest—they will be the ones that speak with the most precision.</p>
            <h3>The Noise Floor</h3>
            <p>We are currently operating at a digital noise floor that is historically unprecedented. B2B decision makers are flooded with an average of 4,000 marketing messages per day. In this environment, "more" is not a strategy. It is merely a contribution to the entropy.</p>
            <p>High-growth brands are pivoting. They are moving away from volume-based content strategies toward density-based insight sharing. The goal is no longer to be seen everywhere, but to be understood deeply by the few who matter.</p>
            <h3>Strategic Quiet</h3>
            <p>This is not about disappearing. It is about signal-to-noise ratio. When you release a piece of intelligence, it should arrest the feed. It should require attention, not just attract it.</p>
        `
    },
    {
        category: "DATA",
        title: "The Death of the Dashboard",
        summary: "Reimagining data visualization for decision velocity.",
        date: "OCT 10",
        readTime: "6 MIN",
        slug: "death-of-dashboard",
        content: `
            <p>The dashboard was a promise: "See everything at once." In reality, it became a curse: "Stare at everything, see nothing."</p>
            <p>Modern analytics is not about aggregation; it is about curation. The C-suite does not need another pie chart. They need a directional vector.</p>
            <h3>Context Over Content</h3>
            <p>Data without narrative is just noise. We are seeing a shift towards "Data Stories"—linear, narrative-driven reports that guide the viewer through the logic of the anomaly, rather than just displaying the anomaly itself.</p>
        `
    },
    {
        category: "GROWTH",
        title: "Algorithmic Scaling Laws",
        summary: "A mathematical framework for predictable ad spend efficiency.",
        date: "OCT 05",
        readTime: "12 MIN",
        slug: "algorithmic-scaling",
        content: `
            <p>Scaling is effective only when it is predictable. If doubling spend yields random results, you are not scaling—you are gambling.</p>
            <p>By applying physics-based constraints to algorithmic bidding, we can define a "Safe Scale Velocity." This is the maximum rate at which budget can be increased without breaking the machine learning optimization loop.</p>
        `
    },
    {
        category: "ANALYTICS",
        title: "Beyond the Dashboard",
        summary: "Most dashboards are graveyards of context. How to restructure reporting for decision velocity.",
        date: "SEP 28",
        readTime: "6 MIN",
        slug: "beyond-dashboard",
        content: `
            <p>The second iteration of our analytics thesis.</p>
            <p>We explore how "Decision Velocity" is the only metric that truly matters for an internal data team. If a report takes 3 days to generate and 30 minutes to read, but results in zero decisions, its value is negative.</p>
        `
    },
    {
        category: "PERFORMANCE",
        title: "The 90-Day Loop",
        summary: "Why quarterly planning cycles are killing your ad spend efficiency.",
        date: "SEP 15",
        readTime: "12 MIN",
        slug: "90-day-loop",
        content: `
            <p>The market does not respect your fiscal quarter. Consumer behavior flows in continuous overlapping wavelengths, not 90-day jagged steps.</p>
            <p>We propose the "Rolling 14" model: A continuous 14-day optimization window that slides forward every single morning. Strategy is reviewed weekly, not quarterly.</p>
        `
    },
    {
        category: "DOOH",
        title: "Physical Retargeting",
        summary: "Navigating the ethical and technical boundaries of real-world identity resolution.",
        date: "AUG 30",
        readTime: "9 MIN",
        slug: "physical-retargeting",
        content: `
            <p>If someone sees your billboard, can you show them an Instagram ad 5 minutes later?</p>
            <p>Technically: Yes. <br>Ethically: Complicated. <br>Strategically: Powerful if done correctly.</p>
            <p>This note unpacks the geofencing lattice required to make OOH (Out of Home) a truly performance-drive channel.</p>
        `
    },
    {
        category: "CULTURE",
        title: "Notes on Engineering Velocity",
        summary: "Internal memo: How we reduced deployment friction by 60% without breaking things.",
        date: "AUG 12",
        readTime: "5 MIN",
        slug: "engineering-velocity",
        content: `
            <p>Speed is a function of confidence. You can drive faster if you trust your brakes.</p>
            <p>Our engineering team stopped trying to prevent all bugs, and started optimizing for "Mean Time To Recovery" (MTTR). It turns out, if you can fix a bug in 4 minutes, you can ship 10x faster.</p>
        `
    },

    // --- NEW ARTICLES (10) ---
    {
        category: "STRATEGY",
        title: "The ROI of Silence",
        summary: "When the smartest move is to stop marketing entirely for a month.",
        date: "AUG 01",
        readTime: "7 MIN",
        slug: "roi-of-silence",
        content: `
            <p>Counter-intuitive strategy note: The "Dark Month".</p>
            <p>We tested shutting off all top-of-funnel acquisition for 30 days. The result? A 14% increase in organic baseline understanding and a resetting of ad frequency fatigue. Sometimes you have to let the room get quiet to be heard again.</p>
        `
    },
    {
        category: "DATA",
        title: "First-Party Sovereignty",
        summary: "Owning your audience graph before the cookie sunset is complete.",
        date: "JUL 22",
        readTime: "10 MIN",
        slug: "first-party-sovereignty",
        content: `
            <p>The walls are closing in on third-party data. This is not news.</p>
            <p>The news is what you do about it. We discuss the "Sovereign Graph" architecture: a method of storing customer intent data that relies on zero external dependencies.</p>
        `
    },
    {
        category: "GROWTH",
        title: "Vertical vs. Horizontal Scale",
        summary: "Knowing when to add budget vs. when to add channels.",
        date: "JUL 15",
        readTime: "6 MIN",
        slug: "vertical-horizontal-scale",
        content: `
            <p>Most brands try to scale horizontally (TikTok, LinkedIn, YouTube) before they have finished scaling vertically (maxing out Facebook/Google).</p>
            <p>This is an efficiency leak. Vertical scale is cheaper. Horizontal scale is expensive but necessary for resilience. Know the difference.</p>
        `
    },
    {
        category: "CULTURE",
        title: "The Asynchronous Office",
        summary: "Why real-time meetings are a failure of documentation.",
        date: "JUL 08",
        readTime: "4 MIN",
        slug: "asynchronous-office",
        content: `
            <p>If you have to say it in a meeting, you didn't write it down clearly enough.</p>
            <p>We moved to a "Read First, Talk Second" culture. No meeting occurs without a pre-read brief. It cut our meeting time by 70%.</p>
        `
    },
    {
        category: "MARKETING",
        title: "Brand is Supply Chain",
        summary: "Your brand is not your logo. It is the reliability of your logistics.",
        date: "JUN 30",
        readTime: "8 MIN",
        slug: "brand-is-supply-chain",
        content: `
            <p>For DTC brands, the unboxing experience is marketing. But the shipping time is also marketing. The return policy is marketing.</p>
            <p>We argue that Operations should report to Brand, not the other way around.</p>
        `
    },
    {
        category: "ANALYTICS",
        title: "Attribution is a Myth",
        summary: "Stop looking for the 'silver bullet' credit. Start looking for incrementality.",
        date: "JUN 22",
        readTime: "14 MIN",
        slug: "attribution-myth",
        content: `
            <p>Last-click is a lie. Multi-touch is a guess. Data-driven is a black box.</p>
            <p>The only truth is Incrementality Testing. Turn it off. See what happens. Turn it on. Measure the lift. Everything else is just accounting.</p>
        `
    },
    {
        category: "STRATEGY",
        title: "Pricing Power",
        summary: "The ultimate indicator of brand equity is the ability to raise prices.",
        date: "JUN 10",
        readTime: "9 MIN",
        slug: "pricing-power",
        content: `
            <p>If you raise prices by 10% and lose 10% of your volume, you have zero brand equity. You are a commodity.</p>
            <p>If you raise prices by 10% and lose 0% of your volume, you have a brand.</p>
        `
    },
    {
        category: "DOOH",
        title: "The Urban Canvas",
        summary: "Using digital billboards as high-frequency storytelling devices.",
        date: "MAY 28",
        readTime: "5 MIN",
        slug: "urban-canvas",
        content: `
            <p>Don't just put a static image on a digital board.</p>
            <p>We ran a campaign that changed copy based on the real-time traffic density of the road below it. Frustrated drivers saw different messages than free-flowing ones. Context is king.</p>
        `
    },
    {
        category: "GROWTH",
        title: "The 40% Rule",
        summary: "Why you should spend 40% of your time on creative, and 60% on distribution.",
        date: "MAY 15",
        readTime: "7 MIN",
        slug: "40-percent-rule",
        content: `
            <p>Actually, swap that. In 2025, Creative is the new Targeting.</p>
            <p>The algorithms are good enough at finding people. Your job is to make something they want to watch. Spend 80% on creative.</p>
        `
    },
    {
        category: "DATA",
        title: "Dark Social",
        summary: "Measuring the unmeasurable sharing that happens in DMs and Slack groups.",
        date: "MAY 02",
        readTime: "11 MIN",
        slug: "dark-social",
        content: `
            <p>The most valuable shares happen where you can't see them.</p>
            <p>We analyze the "Direct Traffic" anomaly as a proxy for Dark Social velocity. If direct traffic is rising, your brand is being talked about behind closed doors.</p>
        `
    }
];
