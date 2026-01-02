'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useAssistantState } from './useAssistantState';
import AssistantPanel from './AssistantPanel';
import ReactDOM from 'react-dom';



export default function PricingAssistant() {
    const { state, messages, handleAction, openAssistant, closeAssistant, resetAssistant, handleTextQuery } = useAssistantState();
    const [isMounted, setIsMounted] = useState(false);

    // Discovery State
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [whisperVisible, setWhisperVisible] = useState(false);
    const [whisperText, setWhisperText] = useState("");

    // Refs
    const panelRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLButtonElement>(null);
    const whisperRef = useRef<HTMLDivElement>(null);

    // 1. Mount & Discovery Sequence
    useEffect(() => {
        setIsMounted(true);

        // Random whisper text selection
        const hints = [
            "Need help choosing a plan?",
            "Compare plans in seconds.",
            "Not sure where you fit?",
            "Start a quick comparison."
        ];
        setWhisperText(hints[Math.floor(Math.random() * hints.length)]);

        // SEQUENCE:
        // 1. Initial Delay (1.5s) -> Show Bubble
        const t1 = setTimeout(() => {
            setBubbleVisible(true);

            // 2. Secondary Delay (1.0s after bubble) -> Show Whisper
            const t2 = setTimeout(() => {
                setWhisperVisible(true);

                // 3. Duration (2.5s) -> Hide Whisper
                const t3 = setTimeout(() => {
                    setWhisperVisible(false);
                }, 2500);

                return () => clearTimeout(t3);
            }, 1000);

            return () => clearTimeout(t2);
        }, 1500);

        // Ambient Pulse Animation (GSAP)
        // 6-8s loop, very subtle
        let pulseAnim: gsap.core.Tween;
        if (bubbleRef.current) {
            pulseAnim = gsap.to(bubbleRef.current, {
                boxShadow: "0 0 15px rgba(139,92,246,0.15)",
                duration: 4,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        }

        const handleNavOpen = () => handleClose(); // Close/Hide if nav opens
        window.addEventListener('nav:open', handleNavOpen);

        return () => {
            clearTimeout(t1);
            window.removeEventListener('nav:open', handleNavOpen);
            window.dispatchEvent(new Event('chatbot:close'));
            if (pulseAnim) pulseAnim.kill();
        };
    }, []);

    // 2. Broadcast State
    useEffect(() => {
        if (state !== "IDLE") {
            window.dispatchEvent(new Event('chatbot:open'));
            setWhisperVisible(false); // Ensure whisper is gone
        } else {
            window.dispatchEvent(new Event('chatbot:close'));
        }
    }, [state]);

    // 3. Panel Transitions
    const handleOpen = () => {
        openAssistant();

        // Bubble Exit (Scale Down)
        if (bubbleRef.current) {
            gsap.to(bubbleRef.current, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(1.5)" });
        }

        // Panel Enter
        setTimeout(() => {
            if (panelRef.current && overlayRef.current) {
                gsap.to(overlayRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
                gsap.fromTo(panelRef.current,
                    { x: "100%" },
                    { x: "0%", duration: 0.4, ease: "power2.out" }
                );
            }
        }, 100);
    };

    const handleClose = () => {
        // Panel Exit
        if (panelRef.current && overlayRef.current) {
            gsap.to(panelRef.current, {
                x: "100%",
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    closeAssistant();
                    // Bubble Enter - Only if allowed (handled by state check in render, but nice to animate)
                    if (bubbleRef.current) {
                        gsap.set(bubbleRef.current, { scale: 0, opacity: 0 });
                        gsap.to(bubbleRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
                    }
                }
            });
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, delay: 0.1 });
        } else {
            closeAssistant();
            // Fallback
            if (bubbleRef.current) {
                gsap.to(bubbleRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" });
            }
        }
    };

    // Ambient Bubble Component
    // w-11 h-11 (44px)
    const Bubble = (
        <div className={`fixed bottom-8 right-8 z-30 flex items-center justify-end pointer-events-none transition-opacity duration-1000 ${bubbleVisible ? 'opacity-100' : 'opacity-0'}`}>

            {/* Whisper Dialogue */}
            <div
                ref={whisperRef}
                className={`mr-4 px-4 py-2 bg-[#0c0c0c]/90 border border-white/10 backdrop-blur-md rounded-lg shadow-xl
                            text-xs text-white/90 tracking-wide select-none
                            transition-all duration-700 ease-out transform origin-right
                            ${whisperVisible ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 translate-x-4 blur-[2px]'}`}
            >
                {whisperText}
            </div>

            {/* Core Node Bubble */}
            <button
                ref={bubbleRef}
                onClick={handleOpen}
                className="pointer-events-auto group relative w-11 h-11 rounded-full 
                           bg-[#0c0c0c]/80 backdrop-blur-md 
                           flex items-center justify-center
                           transition-all duration-300 cursor-pointer overflow-hidden
                           hover:scale-105 active:scale-95"
            >
                {/* 1px Gradient Border (Inner) */}
                <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-br from-violet-500/30 to-indigo-500/10 opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="w-full h-full rounded-full bg-[#0c0c0c]/90"></div>
                </div>

                {/* Ambient Glow (Pulse handled by GSAP, Hover handled here) */}
                <div className="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></div>

                {/* Minimal Intelligence Glyph */}
                <div className="relative z-10 text-violet-300 opacity-90 group-hover:text-white transition-colors duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                </div>
            </button>
        </div>
    );

    const Panel = state !== "IDLE" ? (
        <>
            {/* Backdrop */}
            <div
                ref={overlayRef}
                onClick={handleClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 opacity-0"
            />

            {/* Drawer */}
            <div
                ref={panelRef}
                className="fixed top-0 right-0 z-50 h-[100dvh] w-full md:w-[400px] flex flex-col shadow-2xl translate-x-full"
                style={{ clipPath: 'inset(0 0 0 -1000px)' }} // Allow shadow to flow out
            >
                <div className="flex-1 bg-[#0c0c0c] relative flex flex-col border-l border-white/5">
                    <button
                        onClick={handleClose}
                        className="absolute top-5 right-6 z-50 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/30 hover:text-white hover:bg-white/5 transition-all outline-none"
                    >
                        ✕
                    </button>
                    <AssistantPanel
                        state={state}
                        messages={messages}
                        onAction={handleAction}
                        onReset={resetAssistant}
                        onQuery={handleTextQuery}
                    />
                </div>
            </div>
        </>
    ) : null;

    if (!isMounted) return null;

    return (
        <>
            {state === "IDLE" && ReactDOM.createPortal(Bubble, document.body)}
            {state !== "IDLE" && ReactDOM.createPortal(Panel, document.body)}
        </>
    );
}
