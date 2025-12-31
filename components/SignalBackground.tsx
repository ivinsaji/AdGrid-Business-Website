'use client';

import React, { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SignalBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // --- LAYER 2: SCROLL PARALLAX RESPONSE ---
        // Moves the particle container opposite to scroll
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                y: -30, // Move up as we scroll down (or relative shifts)
                ease: "none",
                scrollTrigger: {
                    trigger: document.body, // Watch whole page
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0 // Instant response (no lag/settle jitter)
                }
            });
        }

        // --- LAYER 3: SIGNAL SHIMMER (COMPUTATION PULSE) ---
        // Subtle opacity pulse on the canvas itself
        if (canvasRef.current) {
            gsap.to(canvasRef.current, {
                opacity: 0.6,
                keyframes: {
                    "0%": { opacity: 0.5 },
                    "10%": { opacity: 0.6 }, // Subtle bright pulse
                    "20%": { opacity: 0.5 },
                    "100%": { opacity: 0.5 }
                },
                duration: 8,
                repeat: -1,
                ease: "power1.inOut",
                delay: 2
            });
        }
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;

        // Configuration
        const PARTICLE_COUNT = 400; // 300-600 range
        const PARTICLES: Particle[] = [];

        // Resize handler
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // Very slow drift: 0.02 - 0.05 units/sec
                // At 60fps, that's incredibly slow per frame: 0.0003 - 0.0008
                // Let's assume units/sec means pixels/sec? "Speed: 0.02–0.05 units/sec"
                // That is effectively stationary. Maybe user meant 0.2? 
                // "Motion should take 20–40 seconds to complete a loop" -> If screen is 1000px, 1000/40 = 25px/sec.
                // So 0.02 is likely relative coord? Or just very slow px.
                // Let's aim for ~10-20px per second for a "drift". 
                // 0.2 - 0.5 px/frame.
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;

                this.size = Math.random() < 0.8 ? 1 : 1.5; // Revert to small size

                // Increased opacity for higher visibility
                const isBright = Math.random() > 0.7;
                this.color = isBright
                    ? `rgba(216, 180, 254, ${0.7 + Math.random() * 0.25})`
                    : `rgba(91, 33, 182, ${0.5 + Math.random() * 0.25})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw(ctx: CanvasRenderingContext2D) {
                // Revert to simple draw - no blur/halo
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
        }

        const initParticles = () => {
            PARTICLES.length = 0;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                PARTICLES.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            PARTICLES.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        // Init
        handleResize();
        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
            {/* BASE LAYER: Dark radial falloff */}
            <div className="absolute inset-0 bg-[#0c0c0c]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-[#0c0c0c] to-[#0c0c0c] opacity-60"></div>
            </div>

            {/* LAYER 1: CANVAS PARTICLES */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen"
                style={{ opacity: 0.5 }} // Base opacity
            />
        </div>
    );
};

export default SignalBackground;
