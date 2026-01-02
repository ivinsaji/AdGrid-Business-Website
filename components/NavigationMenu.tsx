'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

interface NavItem {
    label: string;
    href: string;
    subItems?: NavItem[];
}

const NAV_structure: NavItem[] = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/about' },
    {
        label: 'SERVICES',
        href: '#', // Placeholder, acts as a toggle
        subItems: [
            { label: 'DIGITAL MARKETING', href: '/services/digital-marketing' },
            { label: 'ANALYTICS TOOL', href: '/services/analytics-tool' },
        ]
    },
    { label: 'PORTFOLIO', href: '/portfolio' },
    { label: 'BLOG', href: '/blog' },
    { label: 'PRICING', href: '/pricing' },
    { label: 'CONTACT', href: '/contact' },
];

export const NavigationMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false); // Synchronization state

    const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Animation Timeline
    const tl = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            tl.current = gsap.timeline({ paused: true })
                .to(overlayRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.inOut" })
                .to(menuRef.current, { x: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, "-=0.3")
                .fromTo(linksRef.current.filter(Boolean),
                    { x: 50, autoAlpha: 0 },
                    { x: 0, autoAlpha: 1, stagger: 0.05, duration: 0.5, ease: "power2.out" },
                    "-=0.4"
                );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // State Synchronization with Chatbot
    // Hide menu trigger when chatbot is open to avoid clutter/conflict
    useEffect(() => {
        const handleChatbotOpen = () => setIsChatbotOpen(true);
        const handleChatbotClose = () => setIsChatbotOpen(false);

        window.addEventListener('chatbot:open', handleChatbotOpen);
        window.addEventListener('chatbot:close', handleChatbotClose);

        return () => {
            window.removeEventListener('chatbot:open', handleChatbotOpen);
            window.removeEventListener('chatbot:close', handleChatbotClose);
        };
    }, []);

    // Broadcast Nav State
    useEffect(() => {
        if (isOpen) {
            window.dispatchEvent(new Event('nav:open'));
            tl.current?.timeScale(1).play();
        } else {
            window.dispatchEvent(new Event('nav:close'));
            tl.current?.timeScale(1.5).reverse();
            setExpandedItem(null); // Reset expanded items on close
        }
    }, [isOpen]);

    const handleOpen = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsOpen(true);
    };

    const handleClose = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    // Submenu handling
    const toggleSubmenu = (label: string) => {
        setExpandedItem(prev => prev === label ? null : label);
    };

    return (
        <div ref={containerRef} className="font-mono tracking-tight text-sm uppercase">
            {/* Trigger Button */}
            <div
                className={`fixed top-8 right-8 md:top-12 md:right-12 z-[60] p-4 cursor-pointer group transition-all duration-500 ease-out ${isChatbotOpen ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100 translate-x-0'}`}
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="space-y-1.5 mix-blend-difference">
                    <span className={`block w-8 h-0.5 bg-white transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-8 h-0.5 bg-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'group-hover:w-6 ml-auto'}`}></span>
                    <span className={`block w-8 h-0.5 bg-white transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
            </div>

            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm opacity-0 invisible pointer-events-none data-[open=true]:pointer-events-auto"
                data-open={isOpen}
                onClick={() => setIsOpen(false)}
            />

            {/* Menu Sidebar */}
            <div
                ref={menuRef}
                className="fixed inset-y-0 right-0 z-50 w-full md:w-[480px] bg-[#0c0c0c] border-l border-white/10 flex flex-col justify-center px-12 md:px-20 translate-x-full opacity-0 invisible pointer-events-none data-[open=true]:pointer-events-auto"
                data-open={isOpen}
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" />

                <nav className="relative z-10 flex flex-col space-y-4">
                    {NAV_structure.map((item, i) => (
                        <div key={item.label} className="flex flex-col">
                            {item.subItems ? (
                                <div
                                    // @ts-ignore
                                    ref={el => linksRef.current[i] = el}
                                    className="group cursor-pointer"
                                    onClick={() => toggleSubmenu(item.label)}
                                    onMouseEnter={() => setExpandedItem(item.label)}
                                    onMouseLeave={() => setExpandedItem(null)}
                                >
                                    <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors duration-300">
                                        <span className="text-xs text-violet-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            {`//`}
                                        </span>
                                        <span className="text-xl md:text-2xl font-bold">{item.label}</span>
                                        <span className={`text-[10px] text-violet-400 transform transition-transform duration-300 ${expandedItem === item.label ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </div>

                                    {/* Submenu */}
                                    <div
                                        className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedItem === item.label ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="flex flex-col space-y-2 pl-8 border-l border-violet-500/30 ml-2 py-1">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.label}
                                                    href={subItem.href}
                                                    className="text-white/50 hover:text-violet-300 transition-colors duration-200 text-sm block"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    // @ts-ignore
                                    ref={el => linksRef.current[i] = el}
                                    href={item.href}
                                    className="group flex items-center gap-4 text-white/60 hover:text-white transition-colors duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span className="text-xs text-violet-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        {`//`}
                                    </span>
                                    <span className="text-xl md:text-2xl font-bold">{item.label}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="absolute bottom-12 left-12 md:left-20">
                    <p className="text-[10px] text-white/30">
                        PINNACLE ADGRID &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

