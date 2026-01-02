import { useState, useCallback } from 'react';
import { recommendPlan, UserContext } from './rules';
import { resolveIntent } from './intentResolver';

export type AssistantState =
    | "IDLE"
    | "OPEN"
    | "ACTION_SELECTED"
    | "QUESTION_1"
    | "QUESTION_2"
    | "QUESTION_3"
    | "RECOMMENDATION"
    | "COMPARE_PLANS"
    | "SCALE_INFO"
    | "CUSTOM_REQUIREMENTS";

export interface Message {
    id: string;
    type: 'assistant' | 'user';
    text: string;
    delay?: number;
}

export interface AssistantContext {
    state: AssistantState;
    messages: Message[];
    userContext: UserContext;
    openAssistant: () => void;
    closeAssistant: () => void;
    resetAssistant: () => void;
    handleAction: (action: string, payload?: any) => void;
    handleTextQuery: (text: string) => void;
}

const INITIAL_MESSAGE: Message = {
    id: 'init-1',
    type: 'assistant',
    text: 'I can help you compare plans or guide you to the right option based on your goals.',
    delay: 0
};

export function useAssistantState() {
    const [state, setState] = useState<AssistantState>("IDLE");
    const [messages, setMessages] = useState<Message[]>([]);
    const [userContext, setUserContext] = useState<UserContext>({});

    const addMessage = useCallback((text: string, type: 'assistant' | 'user', delay = 0) => {
        const id = Math.random().toString(36).substr(2, 9);
        setMessages(prev => [...prev, { id, text, type, delay }]);
    }, []);

    const openAssistant = useCallback(() => {
        setState("OPEN");
        setMessages([INITIAL_MESSAGE]);
        setUserContext({});
    }, []);

    const closeAssistant = useCallback(() => {
        setState("IDLE");
        setTimeout(() => {
            setMessages([]);
            setUserContext({});
        }, 500); // Wait for exit animation
    }, []);

    const resetAssistant = useCallback(() => {
        setState("OPEN");
        setMessages([INITIAL_MESSAGE]);
        setUserContext({});
    }, []);

    const handleAction = useCallback((action: string, payload?: any) => {
        // Add user selection as message if needed, or just process state
        // For specific flows, we might want to show what the user clicked as a "user message" 
        // but the design says "User actions shown as buttons / chips (not free text input)"
        // Typically in these UIs, when a user clicks a chip, it effectively becomes their "message".

        // However, the design doc says "Assistant messages left-aligned", "User actions shown as buttons".
        // It doesn't explicitly say the user action *becomes* a message bubble history, but that's standard.
        // I will assume for "Conversation" feel, we might want to log it, or we just transition state and show next assistant message.
        // The design lists "Example Response" which implies a conversation flow.

        switch (state) {
            case "OPEN":
                if (action === "COMPARE_PLANS") {
                    addMessage("Unknown Action", "user"); // Placeholder, replaced below
                    // actually we should process the specific text for the bubble
                }
                break;
            // ... handled below in specific logic block
        }

        // State Machine Logic
        if (action === "START_COMPARE") {
            setState("COMPARE_PLANS");
            addMessage("Compare plans", "user");
            setTimeout(() => addMessage("Which plans would you like to compare?", "assistant"), 400);
        }
        else if (action === "START_GUIDED") {
            setState("QUESTION_1");
            addMessage("Which plan fits my business?", "user");
            setTimeout(() => addMessage("What’s your approximate monthly marketing spend?", "assistant"), 400);
        }
        else if (action === "START_SCALE") {
            setState("SCALE_INFO");
            addMessage("What’s included in Scale?", "user");
            setTimeout(() => {
                addMessage("Scale is built for brands operating across regions or channels that need deep intelligence.", "assistant");
            }, 400);
        }
        else if (action === "START_CUSTOM") {
            setState("CUSTOM_REQUIREMENTS");
            addMessage("Custom requirements", "user");
            setTimeout(() => {
                addMessage("Custom setups vary based on channels, regions, and data depth.", "assistant");
                setTimeout(() => addMessage("The fastest way to evaluate this is a short conversation with our team.", "assistant"), 800);
            }, 400);
        }

        // COMPARE FLOW
        else if (state === "COMPARE_PLANS") {
            addMessage(payload?.label || action, "user");

            let response = "";
            if (action === "STARTER_VS_GROWTH") {
                response = "Starter is designed for establishing visibility and structured reporting.\n\nGrowth is built for performance optimization, attribution, and scaling campaigns with intelligence.\n\nIf you’re actively spending on ads and need deeper analytics, Growth is usually the right move.";
            } else if (action === "GROWTH_VS_SCALE") {
                response = "Growth offers full intelligence and attribution for single-region dominance.\n\nScale adds multi-region warehousing, dedicated management, and custom enterprise integrations.";
            } else if (action === "ALL_PLANS") {
                response = "Starter: Validation & Visibility.\nGrowth: Performance & Attribution.\nScale: Enterprise Intelligence & Custom Data.";
            }

            setTimeout(() => {
                addMessage(response, "assistant");
                setTimeout(() => addMessage("Want help deciding?", "assistant"), 1200);
            }, 500);
            // We might want to offer the guided flow here as a "next step"? 
            // Logic says "CTA: Which plan fits my business?" after the response.
        }

        // GUIDED FLOW
        else if (state === "QUESTION_1") {
            const spendVal = payload?.value;
            const label = payload?.label;
            setUserContext(prev => ({ ...prev, spend: spendVal }));
            addMessage(label, "user");

            setState("QUESTION_2");
            setTimeout(() => addMessage("Which channels are you currently using?", "assistant"), 400);
        }
        else if (state === "QUESTION_2") {
            const channelVal = payload?.value;
            const label = payload?.label;
            setUserContext(prev => ({ ...prev, channels: channelVal }));
            addMessage(label, "user");

            setState("QUESTION_3");
            setTimeout(() => addMessage("What’s your primary goal right now?", "assistant"), 400);
        }
        else if (state === "QUESTION_3") {
            const goalVal = payload?.value;
            const label = payload?.label;
            const newCtx = { ...userContext, goal: goalVal }; // Need immediate access
            setUserContext(newCtx);
            addMessage(label, "user");

            // Calculate Recommendation
            const rec = recommendPlan(newCtx as any);

            setState("RECOMMENDATION");
            setTimeout(() => {
                addMessage(`Based on your inputs, ${rec.charAt(0) + rec.slice(1).toLowerCase()} is the best fit.`, "assistant");

                let reasoning = "";
                if (rec === "SCALE") {
                    reasoning = "Your spend volume requires enterprise-grade infrastructure and dedicated support.";
                } else if (rec === "GROWTH") {
                    reasoning = "You’re actively running campaigns and need performance optimization with real-time attribution.\nGrowth gives you full intelligence without enterprise overhead.";
                } else {
                    reasoning = "You are in the early stages of building visibility. Starter gives you the structured reporting you need without over-investing.";
                }

                setTimeout(() => addMessage(reasoning, "assistant"), 600);
            }, 500);
        }

    }, [state, userContext, addMessage]);

    const handleTextQuery = useCallback((text: string) => {
        addMessage(text, "user");

        // Artificial delay for "thinking"
        setTimeout(() => {
            const result = resolveIntent(text);

            if (result.directResponse) {
                addMessage(result.directResponse, "assistant");
                // Check if we should suggest a follow up after a direct response
                if (result.intent === "PRICING_QUESTION" || result.intent === "FEATURE_EXPLANATION") {
                    setTimeout(() => addMessage("Would you like to compare the plans?", "assistant"), 1500);
                }
            } else if (result.action) {
                handleAction(result.action);
            }
        }, 600);
    }, [addMessage, handleAction]);

    return {
        state,
        messages,
        userContext,
        openAssistant,
        closeAssistant,
        resetAssistant,
        handleAction,
        handleTextQuery
    };
}
