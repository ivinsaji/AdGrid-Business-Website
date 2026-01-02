import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AssistantMessageProps {
    text: string;
    type: 'assistant' | 'user';
}

export default function AssistantMessage({ text, type }: AssistantMessageProps) {
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (el.current) {
            gsap.fromTo(el.current,
                { opacity: 0, y: 8 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    }, []);

    const isAssistant = type === 'assistant';

    return (
        <div ref={el} className={`flex w-full mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed backdrop-blur-md
                ${isAssistant
                        ? 'bg-white/5 text-white/90 border border-white/5 rounded-tl-sm'
                        : 'bg-violet-500/10 text-violet-200 border border-violet-500/20 rounded-tr-sm shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                    }`}
            >
                {text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                ))}
            </div>
        </div>
    );
}
