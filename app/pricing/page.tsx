'use client';

import { useLayoutEffect, useRef } from "react";
import Link from 'next/link';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlowBorder from "@/components/GlowBorder";
import SystemCore from "@/components/SystemCore";
import SignalBackground from "@/components/SignalBackground";
import PricingAssistant from "@/components/PricingAssistant/PricingAssistant";
import { useState } from "react";

// Act 2 Data
const PLANS = [
    {
        name: "STARTER",
        outcome: "VISIBILITY & FOUNDATION",
        price: 2000,
        desc: "Foundation for visibility",
        features: [
            "Basic Analytics Dashboard",
            "2 Campaign Flows",
            "Monthly Performance Report",
            "Email Support",
            "Standard API Access"
        ]
    },
    {
        name: "GROWTH",
        outcome: "PERFORMANCE & OPTIMIZATION",
        price: 4500,
        desc: "Scaling with intelligence",
        recommended: true,
        features: [
            "Full AdGrid Intelligence",
            "Unlimited Campaign Flows",
            "Real-time Attribution",
            "Priority 24/7 Support",
            "Advanced Audience Segmentation",
            "Integration Assistance"
        ]
    },
    {
        name: "SCALE",
        outcome: "DOMINANCE & DATA INTELLIGENCE",
        price: 8000,
        desc: "Market leadership & domination",
        features: [
            "Custom Data Warehousing",
            "Dedicated Account Manager",
            "Multi-Region Support",
            "White-label Reports",
            "On-premise Deployment Capability"
        ]
    }
];

export default function PricingPage() {
    // Container Refs for Context Scoping
    const container = useRef<HTMLDivElement>(null);
    const [activeFeature, setActiveFeature] = useState(false);

    // Act Refs
    const headerRef = useRef<HTMLDivElement>(null);
    const plansRef = useRef<HTMLDivElement>(null);
    const analyticsRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // --- ACT 1: HEADER / SYSTEM BOOT ---
            const tlHeader = gsap.timeline({ delay: 0.2 });

            // 1. Title Animation
            tlHeader.to(".header-char", {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 0.8,
                ease: "power2.out"
            })
                // 2. Subtitle fade in
                .to(".header-subtitle", {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.4")
                // 3. Context Strip fade & slide
                .to(".header-context", {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.4")
                // 4. Divider draw
                .to(".header-divider", {
                    scaleX: 1,
                    duration: 1.2,
                    ease: "expo.out"
                }, "-=0.6");


            // --- ACT 2: PRICING PLANS ---
            // Trigger: plans container, Start: "top 75%"
            const plans = gsap.utils.toArray<HTMLElement>(".plan-card");

            gsap.timeline({
                scrollTrigger: {
                    trigger: plansRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            })
                .to(plans, {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    stagger: 0.2, // Left to right stagger
                    duration: 1.0,
                    ease: "power3.out" // Smoother, no bounce
                });

            // Internal Choreography per card
            plans.forEach((card, i) => {
                const tlCard = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                });

                // 1. Price Count Up (Slow & Smooth)
                const priceVal = PLANS[i].price;
                const priceEl = card.querySelector(".plan-price-value");
                if (priceEl) {
                    // Start from 0, animate to value
                    tlCard.to({ val: 0 }, {
                        val: priceVal,
                        duration: 2.0, // Slower duration
                        ease: "power2.out",
                        onUpdate: function () {
                            priceEl.textContent = "$" + Math.floor(this.targets()[0].val).toLocaleString();
                        }
                    }, 0); // Start immediately
                }

                // 2. Features stagger in (Line-by-line)
                const features = card.querySelectorAll(".plan-feature");
                if (features.length) {
                    tlCard.to(features, {
                        opacity: 1,
                        x: 0,
                        stagger: 0.08,
                        duration: 0.6,
                        ease: "power2.out"
                    }, 0.5); // Delay after price starts
                }

                // 3. CTA fades in last
                const cta = card.querySelector(".plan-cta");
                if (cta) {
                    tlCard.to(cta, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out"
                    }, 1.2); // Start late
                }

                // Recommended label (Growth only) - Independent entry
                if (i === 1) {
                    const label = card.querySelector(".plan-recommended");
                    if (label) {
                        gsap.to(label, {
                            opacity: 1,
                            y: 0,
                            delay: 0.8,
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%"
                            },
                            duration: 0.6,
                            ease: "back.out(1.7)"
                        });
                    }
                }
            });


            // --- ACT 3: ANALYTICS CALLOUT ---
            const tlAnalytics = gsap.timeline({
                scrollTrigger: {
                    trigger: analyticsRef.current,
                    start: "top 80%",
                }
            });

            tlAnalytics
                .to(analyticsRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out"
                })
                .to(".analytics-content", {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8
                }, "-=0.6");


            // --- ACT 4: ENTERPRISE CTA ---
            const tlCTA = gsap.timeline({
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 85%",
                }
            });

            tlCTA
                .to(".cta-line-left", { scaleX: 1, opacity: 1, duration: 1, ease: "expo.out" })
                .to(".cta-line-right", { scaleX: 1, opacity: 1, duration: 1, ease: "expo.out" }, "<")
                .to(".cta-button-container", {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "back.out(1.2)"
                }, "-=0.5")
                .to(".cta-pulse", {
                    opacity: 0,
                    scale: 1.5,
                    duration: 1,
                    ease: "power1.out"
                });

        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <main ref={container} className="min-h-screen bg-[#0c0c0c] text-white font-mono selection:bg-violet-500/30 selection:text-white overflow-hidden relative">
            <SignalBackground />

            <div className="relative z-10">


                {/* PRICING GRID BACKGROUND LAYER (New) */}
                <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                        backgroundSize: '100px 100px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                    }}>
                </div>

                {/* --- ACT 1: HEADER --- */}
                <section ref={headerRef} className="relative pt-32 pb-12 px-6 md:px-12 flex flex-col items-center text-center">
                    <div className="relative mb-4 overflow-hidden">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight flex gap-3 md:gap-4 justify-center">
                            {"PRICING".split("").map((char, i) => (
                                <span key={i} className="header-char inline-block translate-y-2 opacity-0">
                                    {char}
                                </span>
                            ))}
                        </h1>
                    </div>

                    <p className="header-subtitle opacity-0 text-white/40 text-lg md:text-xl font-light tracking-[0.2em] uppercase mb-6 transform translate-y-0">
                        Measurable Growth. Clear Obligations.
                    </p>

                    {/* PRICING CONTEXT STRIP */}
                    <div className="header-context opacity-0 -translate-x-10 mb-8 flex items-center gap-4">
                        <div className="h-px w-8 bg-violet-500/50"></div>
                        <p className="text-violet-300 text-xs tracking-[0.25em] font-bold uppercase">
                            Strategy. Execution. Analytics — Unified.
                        </p>
                        <div className="h-px w-8 bg-violet-500/50"></div>
                    </div>

                    <div className="header-divider w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/20 to-transparent scale-x-0 origin-left"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-900/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
                </section>


                {/* --- ACT 2: PRICING PLANS --- */}
                <section ref={plansRef} className="py-10 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative items-stretch">

                        {PLANS.map((plan, i) => (
                            <div
                                key={plan.name}
                                className={`plan-card relative flex flex-col p-8 md:p-10 border opacity-0 translate-y-[30px] blur-[4px]
                                ${plan.recommended
                                        ? 'border-violet-500/40 bg-[#0e0e14]/90 shadow-[0_20px_60px_rgba(124,58,237,0.15)]'
                                        : 'border-white/10 bg-[#0c0c0c]/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)]'
                                    } 
                                backdrop-blur-xl transition-all duration-500 
                                hover:translate-y-[-5px] hover:border-violet-500/30 hover:shadow-[0_30px_80px_rgba(124,58,237,0.1)] group`}
                            >
                                {/* Recommended Badge */}
                                {plan.recommended && (
                                    <div className="plan-recommended opacity-0 -translate-y-2 absolute top-0 left-1/2 -translate-x-1/2 -mt-3">
                                        <span className="bg-[#0c0c0c] border border-violet-500/50 text-violet-400 text-[10px] font-bold px-3 py-1 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                            Recommended
                                        </span>
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-white mb-2 tracking-widest">{plan.name}</h3>
                                {/* OUTCOME LABEL */}
                                <div className="text-[10px] text-violet-400 font-bold tracking-[0.15em] uppercase mb-2 opacity-80">
                                    {plan.outcome}
                                </div>
                                <div className="text-sm text-white/40 mb-10 h-6 leading-relaxed">{plan.desc}</div>

                                <div className="flex items-baseline mb-12">
                                    <span className="plan-price-value text-4xl md:text-5xl font-bold text-white">$0</span>
                                    <span className="text-white/30 ml-2 text-sm tracking-widest">/MO</span>
                                </div>

                                <ul className="space-y-5 mb-12 flex-grow">
                                    {plan.features.map((feat, j) => (
                                        <li key={j} className="plan-feature flex items-start gap-3 text-sm text-white/70 opacity-0 -translate-x-2">
                                            <span className={`mt-0.5 text-[10px] ${plan.recommended ? 'text-violet-400' : 'text-white/30'}`}>
                                                {plan.recommended ? '●' : '▹'}
                                            </span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <div className="plan-cta opacity-0 translate-y-2">
                                    <Link href="/contact" className="group/btn relative block w-full text-center py-4 overflow-hidden rounded-full backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-500 hover:scale-[1.02] hover:bg-white/10 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] shadow-[0_0_15px_rgba(0,0,0,0.2)]">
                                        {/* Subtle Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 opacity-50 group-hover/btn:opacity-80 transition-opacity duration-500"></div>

                                        {/* Inner Highlight (Glass effect) */}
                                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"></div>

                                        <span className="relative z-10 text-xs font-bold tracking-[0.2em] text-white uppercase group-hover/btn:tracking-[0.25em] transition-all duration-300">
                                            {plan.recommended ? 'Start Growth' : 'Get Started'}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        ))}

                    </div>
                </section>


                {/* --- ACT 3: ANALYTICS CALLOUT --- */}
                <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
                    <div
                        ref={analyticsRef}
                        className="relative opacity-0 translate-y-8 group/panel"
                        onMouseEnter={() => setActiveFeature(true)}
                        onMouseLeave={() => setActiveFeature(false)}
                    >
                        <GlowBorder className="w-full h-full p-8 md:p-16 bg-[#121212] overflow-hidden">
                            {/* Animated Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 via-transparent to-indigo-900/10 opacity-50 animate-pulse-slow"></div>

                            {/* Subtle Border Light Drift */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%] h-[1px] top-0 animate-drift blur-[1px]"></div>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="max-w-2xl space-y-6">
                                    <div className="analytics-content opacity-0 translate-y-4 text-violet-400 text-xs font-bold tracking-[0.25em] uppercase">
                                        Infrastructure Included
                                    </div>
                                    <h2 className="analytics-content opacity-0 translate-y-4 text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        ADGRID INTELLIGENCE CORE
                                    </h2>
                                    <p className="analytics-content opacity-0 translate-y-4 text-white/60 text-sm md:text-base leading-relaxed tracking-wide max-w-xl">
                                        We don’t just run ads. We deploy a sensor network for your brand.
                                        Connect offline visibility to online conversion with our proprietary
                                        real-time dashboard included in every active plan.
                                    </p>

                                    <div className="analytics-content opacity-0 translate-y-4 pt-4 flex flex-wrap gap-4">
                                        {['DOOH Tracking', 'QR Heatmaps', 'Conversion API'].map((item, i) => (
                                            <span
                                                key={i}
                                                className="px-4 py-2 border border-white/10 bg-white/5 rounded-full text-[10px] text-white/70 uppercase tracking-wider transition-all duration-300 ease-out hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white hover:-translate-y-px hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] cursor-default"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* SYSTEM CORE VISUAL */}
                                <div className="analytics-content opacity-0 w-[300px] h-[300px] relative shrink-0 hidden md:block">
                                    <SystemCore active={activeFeature} />
                                </div>
                            </div>
                        </GlowBorder>
                    </div>
                </section>


                {/* --- ACT 4: ENTERPRISE CTA --- */}
                <section ref={ctaRef} className="pb-40 px-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="flex items-center w-full max-w-2xl mb-8">
                        <div className="cta-line-left flex-1 h-px bg-gradient-to-r from-transparent to-white/20 scale-x-0 origin-right opacity-0"></div>
                        <div className="shrink-0 px-4 text-white/30 text-xs tracking-widest uppercase">
                            Custom Service Requirements?
                        </div>
                        <div className="cta-line-right flex-1 h-px bg-gradient-to-l from-transparent to-white/20 scale-x-0 origin-left opacity-0"></div>
                    </div>

                    <div className="cta-button-container relative opacity-0 scale-95">
                        <div className="cta-pulse absolute inset-0 bg-violet-500/30 rounded-full blur-xl pointer-events-none opacity-0"></div>
                        <Link
                            href="/contact"
                            className="group relative inline-flex items-center justify-center px-16 py-6 overflow-hidden rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500"
                        >
                            <span className="relative z-10 text-sm md:text-base font-bold tracking-[0.25em] text-white uppercase group-hover:text-violet-200 transition-colors">
                                Contact Us
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </Link>
                    </div>
                </section>

                <footer className="w-full py-12 border-t border-white/5 bg-[#0c0c0c]">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <p className="text-white/30 text-[10px] font-light tracking-wide uppercase">
                            &copy; {new Date().getFullYear()} AdGrid Intelligence.
                        </p>
                    </div>
                </footer>


                <PricingAssistant />
            </div >
        </main >
    );
}
