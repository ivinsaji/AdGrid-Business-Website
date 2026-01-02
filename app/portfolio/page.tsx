'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioTunnel from '@/components/PortfolioTunnel';
import { PORTFOLIO_PROJECTS } from './data';

export default function PortfolioPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollProgress = useRef<number>(0);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Animation Refs
    const overlayWrapperRef = useRef<HTMLDivElement>(null);
    const overlayContentRef = useRef<HTMLDivElement>(null);
    const scrollHintWrapperRef = useRef<HTMLDivElement>(null);
    const scrollHintContentRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // 0. INITIAL ENTRANCE
            gsap.to([overlayContentRef.current, scrollHintContentRef.current], {
                opacity: 1,
                y: 0,
                duration: 1.5,
                delay: 0.5,
                ease: "power3.out",
                stagger: 0.2
            });

            // 1. SCROLL TRIGGER (Moved to CSS Sticky)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                    // No pin: true! CSS Sticky handles the viewport locking.
                    onUpdate: (self) => {
                        scrollProgress.current = self.progress;
                    }
                }
            });

            // 2. SCROLL EXIT
            tl.fromTo([overlayWrapperRef.current, scrollHintWrapperRef.current],
                { opacity: 1, y: 0 },
                { opacity: 0, y: -50, duration: 0.2, ease: "power1.in" },
                0
            );

            // 3. CARD ORCHESTRATION
            PORTFOLIO_PROJECTS.forEach((_, i) => {
                const card = cardsRef.current[i];
                if (!card) return;

                const startTime = i * 2.5 + 0.5;

                // Entrance
                tl.fromTo(card,
                    { scale: 0.8, opacity: 0, z: -100, rotateX: 10, pointerEvents: 'none' },
                    {
                        scale: 1,
                        opacity: 1,
                        z: 0,
                        rotateX: 0,
                        pointerEvents: 'auto',
                        duration: 1.5,
                        ease: "power3.out"
                    },
                    startTime
                )
                    // Hold/Drift
                    .to(card, { z: 50, duration: 1, ease: "none" }, ">")
                    // Exit
                    .to(card, {
                        opacity: 0,
                        scale: 1.1,
                        filter: "blur(10px)",
                        pointerEvents: 'none',
                        duration: 0.6
                    }, ">");
            });

            // 4. END SEQUENCE REVEAL
            // Strictly AFTER the last card ("+0.5" gap)
            // Using z-50 in CSS to ensure visibility
            tl.fromTo(footerRef.current,
                { opacity: 0, scale: 0.95, pointerEvents: 'none' },
                { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 1.5, ease: "power2.out" },
                ">+0.5"
            );

            // 5. HOLDING PHASE
            // Massive hold duration to keep footer visible for the entire remaining scroll
            tl.to({}, { duration: 10 });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <main className="bg-black text-white selection:bg-violet-500/30 font-mono">
            <PortfolioTunnel scrollProgress={scrollProgress} />

            {/* CSS STICKY CONTAINER - 2000vh of scroll travel */}
            <div ref={containerRef} className="h-[2000vh] relative z-10">
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-1000">

                    {/* INITIAL LAYERS */}
                    <div ref={overlayWrapperRef} className="absolute left-6 md:left-20 bottom-32 md:bottom-1/3 z-20 max-w-2xl select-none pointer-events-none">
                        <div ref={overlayContentRef} className="flex flex-col gap-6 opacity-0 translate-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-px w-8 bg-violet-500"></div>
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-violet-300">Portfolio</span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white mix-blend-difference">
                                SELECTED WORK & <br />
                                <span className="text-white/50">CASE STUDIES.</span>
                            </h1>
                        </div>
                    </div>

                    <div ref={scrollHintWrapperRef} className="absolute left-6 md:left-20 bottom-12 z-20 select-none pointer-events-none">
                        <div ref={scrollHintContentRef} className="flex items-center gap-4 opacity-0 translate-y-8">
                            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 animate-pulse">Scroll to Enter</div>
                            <div className="h-px w-24 bg-gradient-to-r from-white/40 to-transparent"></div>
                        </div>
                    </div>

                    {/* CARDS LAYER */}
                    <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center pointer-events-none">
                        {PORTFOLIO_PROJECTS.map((project, i) => (
                            <div
                                key={project.id}
                                ref={el => { cardsRef.current[i] = el; }}
                                className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* CARD LINK WRAPPER */}
                                <Link
                                    href={`/portfolio/${project.id}`}
                                    className="
                                        relative w-full max-w-2xl
                                        rounded-[32px] rounded-tl-sm rounded-br-sm
                                        group cursor-pointer
                                        transition-all duration-500 ease-out
                                        hover:-translate-y-4 hover:scale-[1.02]
                                        perspective-1000
                                        block
                                    "
                                >
                                    {/* Outer Glow (Hover Only) */}
                                    <div className="absolute -inset-1 bg-violet-500/20 rounded-[32px] blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

                                    {/* Main Glass Housing */}
                                    <div className="
                                        relative w-full h-full
                                        bg-[#050505]/60 backdrop-blur-3xl
                                        border border-white/10
                                        rounded-[32px] rounded-tl-sm rounded-br-sm
                                        overflow-hidden
                                        shadow-[0_20px_40px_rgba(0,0,0,0.6)]
                                        group-hover:shadow-[0_30px_60px_rgba(139,92,246,0.15)]
                                        group-hover:border-violet-500/30
                                        transition-all duration-500
                                    ">
                                        {/* Inner Texture / Noise */}
                                        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                                            style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }}>
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>

                                        {/* Content Container */}
                                        <div className="relative p-8 md:p-10 flex flex-col gap-8 h-full">

                                            {/* A. CLIENT IDENTIFIER */}
                                            <div className="flex justify-between items-start z-10">
                                                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase drop-shadow-lg">
                                                    {project.client}
                                                </h3>
                                                <span className="text-[10px] font-mono text-white/40 border border-white/10 bg-white/5 px-2 py-1 rounded backdrop-blur-md">
                                                    {project.year}
                                                </span>
                                            </div>

                                            {/* B. ENGAGEMENT TYPE */}
                                            <div className="z-10 -mt-4 flex items-center gap-3">
                                                <div className="h-px w-6 bg-violet-500/50"></div>
                                                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-violet-300 shadow-black drop-shadow-md">
                                                    {project.engagement}
                                                </span>
                                            </div>

                                            {/* C. STRATEGIC OBJECTIVE */}
                                            <div className="z-10 pl-4 border-l-2 border-violet-500/20">
                                                <p className="text-lg text-white/90 font-light leading-relaxed drop-shadow-md">
                                                    {project.objective}
                                                </p>
                                            </div>

                                            {/* D. METRICS */}
                                            <div className="z-10 mt-auto pt-6 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-6">
                                                {project.metrics.map((m, idx) => (
                                                    <div key={idx} className="flex flex-col">
                                                        <span className="text-2xl md:text-3xl font-mono font-light text-white group-hover:text-violet-200 transition-colors drop-shadow-lg">
                                                            {m.value}
                                                        </span>
                                                        <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase mt-1">
                                                            {m.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* E. INTERACTION CUE */}
                                            <div className="absolute bottom-8 right-8 z-20 flex items-center justify-end gap-2
                                                opacity-50 translate-x-4
                                                group-hover:opacity-100 group-hover:translate-x-0
                                                transition-all duration-300 ease-out"
                                            >
                                                <span className="text-[9px] font-bold tracking-widest text-white uppercase bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                                                    View Breakdown
                                                </span>
                                                <div className="w-6 h-6 rounded-full border border-violet-500/50 flex items-center justify-center bg-violet-500/10 text-violet-300">
                                                    &rarr;
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* END OF SEQUENCE FOOTER (Pinned) */}
                    <footer ref={footerRef} className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-50 pointer-events-none">
                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">
                            End of Sequence
                        </div>

                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="
                                pointer-events-auto group relative px-8 py-4 
                                rounded-full border border-white/10 
                                bg-white/5 backdrop-blur-sm
                                hover:bg-violet-500/10 hover:border-violet-500/50 
                                transition-all duration-500
                            "
                        >
                            <span className="text-xs font-bold tracking-[0.2em] text-white uppercase group-hover:text-violet-200 transition-colors">
                                Return to Origin
                            </span>
                            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-violet-500/20 blur-xl -z-10"></div>
                        </button>
                    </footer>

                </div>
            </div>
        </main>
    );
}
