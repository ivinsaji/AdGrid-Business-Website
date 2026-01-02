'use client';

import React, { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import SignalBackground from '@/components/SignalBackground';

import { ALL_ARTICLES, CATEGORIES } from '@/app/blog/data';

export default function BlogPage() {
    const headerRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // State
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    // Filtered Data
    const filteredArticles = useMemo(() => {
        return ALL_ARTICLES.filter(article => {
            const matchesCategory = selectedCategory === "ALL" || article.category === selectedCategory;
            const matchesSearch =
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Initial Entrance Animation
    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

            // 1. Header Fade In
            tl.from(headerRef.current, {
                y: 20,
                opacity: 0,
                duration: 1.2,
                delay: 0.2
            })
                // 2. Filter Row Fade In
                .from(filterRef.current, {
                    opacity: 0,
                    y: 10,
                    duration: 0.8
                }, "-=0.8")
                // 3. Grid Entrance
                .from(gridRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8
                }, "-=0.6");

        });
        return () => ctx.revert();
    }, []);

    // Handle Category Change with Transition
    const handleCategoryChange = (category: string) => {
        if (category === selectedCategory || isAnimating) return;

        setIsAnimating(true);

        // Fade OUT
        gsap.to(gridRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
                setSelectedCategory(category);
            }
        });
    };

    // Fade IN effect whenever filteredArticles changes
    useEffect(() => {
        if (!gridRef.current) return;

        gsap.to(gridRef.current, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => setIsAnimating(false)
        });

    }, [filteredArticles]);


    return (
        <main className="min-h-screen bg-[#0c0c0c] text-[#e0e0e0] font-mono selection:bg-violet-500/30 selection:text-white relative overflow-x-hidden">
            <SignalBackground intensity={0.3} />

            {/* VIGNETTE */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-0"></div>

            <div className="relative z-10 flex flex-col min-h-screen">

                <div className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-20">

                    {/* SECTION 1: HEADER */}
                    <header ref={headerRef} className="mb-20 max-w-4xl">
                        <div className="flex items-center gap-3 mb-6 opacity-60">
                            <div className="h-px w-8 bg-violet-500/50"></div>
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-300">Insights</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none text-white">
                            STRATEGY, DATA<br />& GROWTH
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-white/50 max-w-2xl leading-relaxed">
                            Breakdowns, experiments, and lessons from building modern campaigns.
                        </p>
                    </header>

                    {/* SECTION 2: FILTER & SEARCH ROW */}
                    {/* Sticky top capability optional, but keeping static for now to match 'calm' feel */}
                    <div ref={filterRef} className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4 mb-12 border-b border-white/5 pb-8">

                        {/* FILTERS */}
                        <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={`
                                        text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300
                                        ${selectedCategory === category
                                            ? 'text-violet-400'
                                            : 'text-white/30 hover:text-white/60'
                                        }
                                    `}
                                >
                                    {category}
                                    {selectedCategory === category && (
                                        <div className="h-px w-full bg-violet-500/50 mt-1 opacity-100 transition-all duration-300"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* SEARCH */}
                        <div className="w-full md:w-auto relative group">
                            <input
                                type="text"
                                placeholder="Search insights"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-64 bg-transparent border-b border-white/10 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors duration-300 placeholder:text-white/20 placeholder:transition-opacity italic font-light"
                            />
                        </div>

                    </div>

                    {/* SECTION 3: UNIFIED CARD GRID */}
                    <div className="min-h-[400px]">
                        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((article, index) => (
                                    <Link key={article.slug} href={`/blog/${article.slug}`} className="group relative block bg-white/[0.02] border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:-translate-y-1 h-full">
                                        <div className="p-8 h-full flex flex-col">
                                            {/* Top Meta */}
                                            <div className="flex items-center justify-between mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-300">
                                                    {article.category}
                                                </span>
                                                <span className="text-[10px] tracking-widest text-white/50 font-mono">
                                                    {article.readTime}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-violet-100 transition-colors">
                                                {article.title}
                                            </h3>

                                            {/* Summary */}
                                            <p className="text-sm text-white/50 font-light leading-relaxed mb-8 flex-grow">
                                                {article.summary}
                                            </p>

                                            {/* Footer */}
                                            <div className="flex items-center gap-2 pt-6 border-t border-white/5 group-hover:border-violet-500/20 transition-colors mt-auto">
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-white/30 group-hover:text-violet-400 transition-colors">
                                                    Read Article
                                                </span>
                                                <span className="text-violet-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    &rarr;
                                                </span>
                                            </div>
                                        </div>

                                        {/* Glass sheen on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-white/30 font-light italic">
                                    No insights found.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-20 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                        <button className="text-xs font-bold tracking-[0.2em] text-white/30 hover:text-white uppercase transition-colors duration-300 pb-1 border-b border-transparent hover:border-white/50">
                            Load Archive
                        </button>
                    </div>

                </div>

                <footer className="w-full py-8 text-center text-white/20 text-[10px] uppercase tracking-widest border-t border-white/5">
                    &copy; 2025 AdGrid Intelligence.
                </footer>
            </div>
        </main>
    );
}
