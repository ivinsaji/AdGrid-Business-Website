import React from 'react';

interface ActionChipProps {
    label: string;
    onClick: () => void;
    delay?: number;
}

export default function ActionChip({ label, onClick, delay = 0 }: ActionChipProps) {
    return (
        <button
            onClick={onClick}
            className="group relative inline-flex items-center justify-center px-4 py-2 
                       bg-white/5 border border-white/5 rounded-full 
                       hover:bg-violet-500/10 hover:border-violet-500/30 
                       transition-all duration-300 cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
        >
            <span className="text-[10px] md:text-xs text-white/50 font-medium tracking-wide uppercase group-hover:text-violet-200 transition-colors">
                {label}
            </span>
        </button>
    );
}
