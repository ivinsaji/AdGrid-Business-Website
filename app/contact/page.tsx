'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import SignalBackground from '@/components/SignalBackground';
import { NavigationMenu } from '@/components/NavigationMenu';

// --- Floating Input Component ---
interface FloatingInputProps {
    label: string;
    type?: string;
    id: string;
    as?: 'input' | 'textarea' | 'select';
    options?: string[];
}

const FloatingInput = ({ label, type = "text", id, as = "input", options }: FloatingInputProps) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState("");

    const isFloating = focused || value.length > 0;

    // Common classes
    const baseClasses = `block w-full px-5 py-5 bg-white/[0.04] border rounded-2xl text-white outline-none transition-all duration-300 ease-out font-light tracking-wide
        shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] selection:bg-violet-500/30
    `;
    const stateClasses = focused
        ? 'border-violet-500/60 shadow-[0_0_30px_rgba(124,58,237,0.18)] bg-white/[0.06]'
        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]';

    return (
        <div className="relative group">
            {/* Input Element */}
            {as === 'textarea' ? (
                <textarea
                    id={id}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`${baseClasses} ${stateClasses} min-h-[140px] resize-none leading-relaxed`}
                />
            ) : as === 'select' ? (
                <div className="relative">
                    <select
                        id={id}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className={`${baseClasses} ${stateClasses} appearance-none cursor-pointer`}
                    >
                        <option value="" disabled className="bg-[#0c0c0c] text-white/30"></option>
                        {options?.map(opt => (
                            <option key={opt} value={opt} className="bg-[#1a1a1a] text-white hover:bg-violet-900">{opt}</option>
                        ))}
                    </select>
                    <div className={`absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300 ${focused ? 'text-violet-400' : 'text-white/20'}`}>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            ) : (
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    className={`${baseClasses} ${stateClasses}`}
                />
            )}

            {/* Label - Fixed Background Color */}
            <label
                htmlFor={id}
                className={`absolute left-5 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] origin-left
                    ${isFloating
                        ? '-top-3 text-[10px] bg-[#0e0e14] px-2 text-violet-400 font-bold tracking-widest uppercase transform scale-100' // Floating
                        : 'top-5 text-white/30 text-sm font-light tracking-wider' // Placeholder
                    }
                `}
            >
                {label}
            </label>

            {/* Focus Glow Overlay */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none transition-opacity duration-500 ${focused ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>
    );
};

export default function ContactPage() {
    const container = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const [submitted, setSubmitted] = useState(false);

    // GSAP Submission Sequence
    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);

        const tl = gsap.timeline();

        // 1. Form Fade Out
        tl.to(".form-content", {
            opacity: 0,
            y: -10,
            filter: "blur(10px)",
            duration: 0.6,
            ease: "power2.in",
            pointerEvents: "none"
        })
            // 2. CTA Morph (Hide button, showing pulse implied by success state)
            // We'll handle the visual swap via state, but animate the transition

            // 3. Success Message Fade In
            .to(".success-message", {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1.0,
                ease: "power2.out", // Calm ease
                delay: 0.2
            })

            // 4. Subtle Pulse Ring Expansion (Visual cue)
            .fromTo(".success-pulse",
                { scale: 0.5, opacity: 0.8 },
                { scale: 2, opacity: 0, duration: 1.5, ease: "power2.out" },
                "<"
            );
    };

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance Seq
            const tl = gsap.timeline({ delay: 0.2 });

            tl.from(headingRef.current, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })
                .from(formRef.current, {
                    y: 40,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=0.6");

            // Micro Parallax (Desktop)
            const onMouseMove = (e: MouseEvent) => {
                if (!formRef.current) return;
                const x = (e.clientX / window.innerWidth - 0.5) * 6;
                const y = (e.clientY / window.innerHeight - 0.5) * 6;

                gsap.to(formRef.current, {
                    x: x,
                    y: y,
                    duration: 1.5,
                    ease: "power2.out"
                });
            };

            if (window.innerWidth > 1024) {
                window.addEventListener('mousemove', onMouseMove);
            }

            return () => {
                window.removeEventListener('mousemove', onMouseMove);
            };

        }, container);
        return () => ctx.revert();
    }, []);

    return (
        <main ref={container} className="min-h-screen bg-[#0c0c0c] text-white font-mono selection:bg-violet-500/30 selection:text-white relative overflow-x-hidden">
            <SignalBackground />

            {/* PAGE VIGNETTE: Focus control */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] z-0"></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                <NavigationMenu />

                <div className="flex-grow flex items-center justify-center p-6 md:p-12 pt-32">
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                        {/* LEFT COLUMN: Headings */}
                        <div ref={headingRef} className="lg:col-span-5 lg:sticky lg:top-40 pt-4 lg:pt-10">
                            <div className="mb-8 flex items-center gap-4 opacity-70">
                                <div className="h-px w-10 bg-violet-500/50"></div>
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-300">Start a Conversation</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[0.9]">
                                LET’S TALK <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">GROWTH.</span>
                            </h1>

                            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-sm border-l border-white/10 pl-6">
                                Tell us about your goals. We’ll map the strategy to achieve them.
                            </p>
                        </div>

                        {/* RIGHT COLUMN: Form Panel - REFINED */}
                        <div ref={formRef} className="lg:col-span-7 w-full group/form">
                            <div className="relative p-8 md:p-12 rounded-[32px] border border-white/10 
                                bg-gradient-to-br from-[#0e0e14]/90 via-[#0c0c0c]/80 to-[#09090b]/90
                                backdrop-blur-2xl transition-all duration-700 ease-out 
                                shadow-[0_20px_80px_rgba(0,0,0,0.6)]
                                hover:border-white/20 hover:shadow-[0_30px_100px_rgba(0,0,0,0.7)]
                                focus-within:border-violet-500/30 focus-within:shadow-[0_0_60px_rgba(124,58,237,0.12)]
                            ">
                                {/* Ambient Energy Layer (Always On but reactive) */}
                                <div className="absolute top-0 right-0 w-[80%] h-[80%] opacity-40 group-focus-within/form:opacity-70 transition-opacity duration-1000 pointer-events-none
                                    bg-[radial-gradient(80%_60%_at_70%_20%,rgba(124,58,237,0.15),transparent_70%)] rounded-[32px]
                                "></div>

                                {/* Form Content Wrapper */}
                                <form
                                    className={`relative z-10 flex flex-col gap-8 form-content ${submitted ? 'pointer-events-none' : ''}`}
                                    onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FloatingInput id="name" label="Full Name" />
                                        <FloatingInput id="email" label="Work Email" type="email" />
                                    </div>
                                    <FloatingInput id="company" label="Company / Brand" />
                                    <FloatingInput id="service" label="Service Interest" as="select" options={["Performance Marketing", "Creative & Branding", "DOOH Advertising", "Offline → Online Analytics"]} />
                                    <FloatingInput id="details" label="Project Details" as="textarea" />

                                    <div className="pt-6">
                                        {/* REFINED CTA BUTTON (HOMEPAGE STYLE) */}
                                        <button className="group relative w-full md:w-auto inline-flex items-center justify-center px-14 py-6 overflow-hidden rounded-full backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] shadow-[0_0_20px_rgba(0,0,0,0.2)]">

                                            {/* Subtle Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

                                            {/* Inner Highlight (Glass effect) */}
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"></div>

                                            <span className="relative z-10 text-sm font-bold tracking-[0.25em] text-white uppercase group-hover:tracking-[0.3em] transition-all duration-300">
                                                Contact Us
                                            </span>
                                        </button>
                                    </div>
                                </form>

                                {/* SUCCESS STATE OVERLAY */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none success-message opacity-0 scale-95 translate-y-4">
                                    {/* Violet Radial Pulse */}
                                    <div className="absolute w-[200px] h-[200px] bg-violet-500/20 rounded-full blur-[50px] success-pulse"></div>
                                    <div className="relative z-10 text-center space-y-4">
                                        <div className="w-16 h-16 mx-auto rounded-full border border-violet-500/50 flex items-center justify-center bg-violet-500/10 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
                                            <svg className="w-6 h-6 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white tracking-tight">Message Received.</h3>
                                        <p className="text-white/60 text-sm tracking-wide">We’ll be in touch shortly.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <footer className="w-full py-8 text-center text-white/20 text-[10px] uppercase tracking-widest">
                    &copy; 2025 AdGrid Intelligence.
                </footer>
            </div>
        </main>
    );
}
