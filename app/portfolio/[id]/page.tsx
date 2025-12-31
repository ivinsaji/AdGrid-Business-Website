import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PORTFOLIO_PROJECTS } from '../data';
import SignalBackground from '@/components/SignalBackground';

// Generate static params for all projects
export function generateStaticParams() {
    return PORTFOLIO_PROJECTS.map((project) => ({
        id: project.id,
    }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = PORTFOLIO_PROJECTS.find((p) => p.id === id);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white font-mono selection:bg-violet-500/30">
            {/* AMBIENT BACKGROUND - CALM MODE */}
            <SignalBackground intensity={0.15} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 md:py-32 flex flex-col gap-24">

                {/* SECTION 1: HEADER */}
                <header className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center gap-4">
                        <Link href="/portfolio" className="text-[10px] font-bold tracking-[0.2em] text-white/40 hover:text-violet-400 transition-colors uppercase">
                            ← Portfolio
                        </Link>
                        <div className="h-px w-8 bg-white/10"></div>
                        <span className="text-[10px] font-bold tracking-[0.2em] text-violet-400 uppercase">
                            Case File: {project.id.toUpperCase()}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white uppercase">
                            {project.client}
                        </h1>
                        <span className="text-sm md:text-base font-bold tracking-[0.2em] text-violet-300 uppercase">
                            {project.engagement}
                        </span>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-violet-500/50 to-transparent mt-4"></div>
                </header>

                {/* SECTION 2: CONTEXT & OBJECTIVE */}
                <section className="grid md:grid-cols-[1fr_2fr] gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                            Objective
                        </h2>
                        <p className="text-lg md:text-xl font-light text-white leading-relaxed">
                            {project.objective}
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                            Context
                        </h2>
                        <p className="text-base text-white/70 leading-relaxed max-w-lg">
                            {project.context}
                        </p>
                    </div>
                </section>

                {/* SECTION 3: STRATEGY */}
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <div className="border-l-2 border-white/10 pl-8 md:pl-12 py-2">
                        <h2 className="text-xs font-bold tracking-[0.2em] text-violet-400 uppercase mb-8">
                            Strategic Execution
                        </h2>
                        <ul className="flex flex-col gap-6">
                            {project.strategy.map((item, idx) => (
                                <li key={idx} className="flex gap-4 items-start group">
                                    <span className="text-xs font-mono text-white/30 pt-1">0{idx + 1}</span>
                                    <p className="text-lg text-white/90 group-hover:text-white transition-colors">
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* SECTION 4: SIGNALS */}
                <section className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-8 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
                        Signals & Insights
                    </h2>
                    <ul className="grid md:grid-cols-2 gap-8">
                        {project.signals.map((signal, idx) => (
                            <li key={idx} className="flex gap-4">
                                <span className="text-violet-500/50">→</span>
                                <p className="text-sm text-white/80 font-mono leading-relaxed">
                                    {signal}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* SECTION 5: IMPACT */}
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                    <h2 className="text-xs font-bold tracking-[0.2em] text-white/40 uppercase mb-8">
                        Impact & Results
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {project.metrics.map((m, idx) => (
                            <div key={idx} className="
                                border border-white/10 bg-black/40 
                                p-6 rounded-lg flex flex-col gap-2
                                hover:border-violet-500/30 transition-colors
                            ">
                                <span className="text-3xl md:text-4xl font-mono font-light text-white">
                                    {m.value}
                                </span>
                                <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                                    {m.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 6: BACK NAVIGATION */}
                <footer className="pt-24 pb-12 flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    <Link
                        href="/portfolio"
                        className="
                            group relative px-8 py-4 
                            rounded-full border border-white/10 
                            bg-white/5 backdrop-blur-sm
                            hover:bg-violet-500/10 hover:border-violet-500/50 
                            transition-all duration-300
                            flex items-center gap-3
                        "
                    >
                        <span className="text-violet-400 group-hover:-translate-x-1 transition-transform duration-300">←</span>
                        <span className="text-xs font-bold tracking-[0.2em] text-white uppercase group-hover:text-violet-200 transition-colors">
                            Return to Archive
                        </span>
                    </Link>
                </footer>

            </div>
        </main>
    );
}
