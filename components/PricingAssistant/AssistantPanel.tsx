import React, { useEffect, useRef } from 'react';
import AssistantMessage from './AssistantMessage';
import ActionChip from './ActionChip';
import { AssistantState, Message } from './useAssistantState';
import { SPEND_OPTIONS, CHANNEL_OPTIONS, GOAL_OPTIONS } from './rules';
import Link from 'next/link';

interface AssistantPanelProps {
    state: AssistantState;
    messages: Message[];
    onAction: (action: string, payload?: any) => void;
    onReset: () => void;
    onQuery: (text: string) => void;
}

export default function AssistantPanel({ state, messages, onAction, onReset, onQuery }: AssistantPanelProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            const scrollEl = scrollRef.current;
            scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, state]);

    return (
        <div className="absolute inset-0 flex flex-col w-full bg-[#0c0c0c]/90 backdrop-blur-md border-l border-white/10 shadow-2xl overflow-hidden">

            {/* Header / Top Bar */}
            <div className="flex-shrink-0 h-16 flex items-center px-6 border-b border-white/5 gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500/50"></div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">System Intelligence</span>
                </div>
                {messages.length > 1 && (
                    <button
                        onClick={onReset}
                        className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors border border-white/5 px-2 py-1 rounded hover:bg-white/5"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-6 py-6 scrollbar-premium pr-4">
                {messages.map((msg) => (
                    <AssistantMessage key={msg.id} text={msg.text} type={msg.type} />
                ))}

                {/* Actions Area - Context Sensitive */}
                <div className="mt-6 flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                    {state === "OPEN" && (
                        <>
                            <ActionChip label="Compare plans" onClick={() => onAction("START_COMPARE")} delay={0} />
                            <ActionChip label="Which plan fits my business?" onClick={() => onAction("START_GUIDED")} delay={50} />
                            <ActionChip label="What’s included in Scale?" onClick={() => onAction("START_SCALE")} delay={100} />
                            <ActionChip label="Custom requirements" onClick={() => onAction("START_CUSTOM")} delay={150} />
                        </>
                    )}

                    {state === "COMPARE_PLANS" && (
                        <>
                            <ActionChip label="Starter vs Growth" onClick={() => onAction("STARTER_VS_GROWTH")} delay={0} />
                            <ActionChip label="Growth vs Scale" onClick={() => onAction("GROWTH_VS_SCALE")} delay={50} />
                            <ActionChip label="All plans" onClick={() => onAction("ALL_PLANS")} delay={100} />
                        </>
                    )}

                    {state === "QUESTION_1" && SPEND_OPTIONS.map((opt, i) => (
                        <ActionChip
                            key={opt.value}
                            label={opt.label}
                            onClick={() => onAction("ANSWER", opt)}
                            delay={i * 50}
                        />
                    ))}

                    {state === "QUESTION_2" && CHANNEL_OPTIONS.map((opt, i) => (
                        <ActionChip
                            key={opt.value}
                            label={opt.label}
                            onClick={() => onAction("ANSWER", opt)}
                            delay={i * 50}
                        />
                    ))}

                    {state === "QUESTION_3" && GOAL_OPTIONS.map((opt, i) => (
                        <ActionChip
                            key={opt.value}
                            label={opt.label}
                            onClick={() => onAction("ANSWER", opt)}
                            delay={i * 50}
                        />
                    ))}

                    {(state === "RECOMMENDATION" || state === "SCALE_INFO" || state === "CUSTOM_REQUIREMENTS") && (
                        <Link href="/contact" className="group flex items-center gap-2 pl-4 pr-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-[10px] font-bold tracking-widest uppercase rounded-full transition-all">
                            {state === "CUSTOM_REQUIREMENTS" ? "Start a conversation" : "Contact the team"}
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    )}

                    {(state === "COMPARE_PLANS" && messages[messages.length - 1].type === 'assistant' && messages.length > 3) && (
                        <div className="w-full mt-4 border-t border-white/5 pt-4">
                            <span className="block text-[10px] text-white/20 uppercase tracking-widest mb-3">Next Step</span>
                            <ActionChip label="Which plan fits my business?" onClick={() => onAction("START_GUIDED")} />
                        </div>
                    )}
                </div>
            </div>
            {/* Input Footer */}
            <div className="flex-shrink-0 p-4 border-t border-white/5 bg-[#0c0c0c]/80 backdrop-blur-md">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.currentTarget.elements.namedItem('query') as HTMLInputElement);
                        const value = input.value.trim();
                        if (value) {
                            // Determine if we should treat this as free text or if we need to call a specific handler
                            // We need to pass this up to useAssistantState
                            onQuery(value);
                            input.value = '';
                        }
                    }}
                    className="relative flex items-center"
                >
                    <input
                        name="query"
                        type="text"
                        placeholder="Ask about pricing..."
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 pr-10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-mono"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 text-white/30 hover:text-violet-400 transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
