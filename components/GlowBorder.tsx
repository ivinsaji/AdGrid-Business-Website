'use client';

import React from 'react';

interface GlowBorderProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
}

const GlowBorder = ({ children, className = "", duration = 10 }: GlowBorderProps) => {
    // Calculate delays based on duration (in seconds)
    // The travel time per side is 50% of the total duration keyframe (0-50% travel).
    // So shift each subsequent side by duration/2.
    const halfDuration = duration / 2;

    return (
        <div className={`relative group/glow rounded-xl border border-white/10 ${className}`}>

            {/* CSS-based Traveling Highlight Implementation */}
            <div className="absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden">
                {/* The "Head" of the light */}
                <div
                    className="absolute top-0 left-0 w-[50%] h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-trace-top"
                    style={{ animationDuration: `${duration}s` }}
                />
                <div
                    className="absolute top-0 right-0 w-[2px] h-[50%] bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-trace-right"
                    style={{ animationDuration: `${duration}s`, animationDelay: `${halfDuration}s` }}
                />
                <div
                    className="absolute bottom-0 right-0 w-[50%] h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-trace-bottom"
                    style={{ animationDuration: `${duration}s`, animationDelay: `${duration}s` }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[2px] h-[50%] bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-trace-left"
                    style={{ animationDuration: `${duration}s`, animationDelay: `${duration + halfDuration}s` }}
                />
            </div>

            {/* Inner Content Container - ensuring it sits on top */}
            <div className="relative z-10 rounded-[inherit] h-full">
                {children}
            </div>
        </div>
    );
};

export default GlowBorder;
