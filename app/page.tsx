'use client';

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SignalCore, { SignalControl } from "@/components/SignalCore";
import { OrbitControl } from "@/components/LogoOrbitRing";

import { NavigationMenu } from "@/components/NavigationMenu";

export default function Home() {
  const container = useRef(null);
  const textState0 = useRef(null);
  const textState1 = useRef(null);
  const textRing = useRef(null);
  const textGrid = useRef(null);
  const textGraph = useRef(null);
  const textTrust = useRef(null);
  const textState6 = useRef(null);

  const sections = useRef<(HTMLDivElement | null)[]>([]);
  const orbitControlRef = useRef<OrbitControl>(null);
  const controlRef = useRef<SignalControl>({
    intensity: 0.1,
    speed: 0.5,
    rotationSpeed: 0.001,
    shape: 'sphere'
  });

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Proxy for physics transitions
      const proxy = {
        intensity: 0.1,
        speed: 0.5,
        rotationSpeed: 0.001
      };

      const updateRef = () => {
        if (controlRef.current) {
          controlRef.current.intensity = proxy.intensity;
          controlRef.current.speed = proxy.speed;
          controlRef.current.rotationSpeed = proxy.rotationSpeed;
        }
      };

      // Configuration for each state
      const states = [
        {
          ref: textState0,
          shape: 'sphere',
          physics: { intensity: 0.2, speed: 0.8, rotationSpeed: 0.002 },
          orbit: false
        },
        {
          ref: textState1,
          shape: 'sphere',
          physics: { intensity: 0.4, speed: 1.5, rotationSpeed: 0.005 },
          orbit: false
        },
        {
          ref: textRing,
          shape: 'billboard', // Updated visual: Urban exposure moment
          physics: { intensity: 0.1, speed: 0.2, rotationSpeed: 0.001 },
          orbit: false
        },
        {
          ref: textGrid,
          shape: 'grid',
          physics: { intensity: 0.15, speed: 0.6, rotationSpeed: 0.001 },
          orbit: false
        },
        {
          ref: textGraph,
          shape: 'graph',
          physics: { intensity: 0.15, speed: 0.6, rotationSpeed: 0.001 },
          orbit: false
        },
        {
          ref: textTrust,
          shape: 'sphere',
          physics: { intensity: 0.05, speed: 0.2, rotationSpeed: 0.0005 },
          orbit: true
        },
        {
          ref: textState6,
          shape: 'expansion',
          physics: { intensity: 0.25, speed: 0.3, rotationSpeed: 0.002 },
          orbit: false
        }
      ];

      const activateState = (index: number) => {
        const state = states[index];

        // 1. Text Transitions (Strict Exclusivity)
        states.forEach((s, i) => {
          if (s.ref.current) {
            if (i === index) {
              // Active State: Fade In
              gsap.to(s.ref.current, {
                autoAlpha: 1, // Handles opacity + visibility
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                overwrite: true
              });
            } else {
              // Inactive States: Force Hide
              gsap.to(s.ref.current, {
                autoAlpha: 0,
                y: 15,
                scale: 0.98, // Subtle scale down
                duration: 0.4,
                ease: "power2.in",
                overwrite: true
              });
            }
          }
        });

        // 2. Physics & Shape
        if (controlRef.current) {
          controlRef.current.shape = state.shape as any;

          gsap.to(proxy, {
            ...state.physics,
            duration: 1.2,
            ease: "expo.out", // Snappier physics
            onUpdate: updateRef,
            overwrite: true
          });
        }

        // 3. Orbit Ring
        if (orbitControlRef.current) {
          if (state.orbit) {
            orbitControlRef.current.show();
          } else {
            orbitControlRef.current.hide();
          }
        }
      };

      // Create ScrollTriggers for each section
      sections.current.forEach((section, index) => {
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: "top center", // Activate when section hits center
          end: "bottom center",
          onEnter: () => activateState(index),
          onEnterBack: () => activateState(index),
          // onLeave/onLeaveBack handled by enters of adjacent sections
        });
      });

      // Initialize first state
      activateState(0);

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={container} className="relative bg-[#0c0c0c]">
      {/* Pinned SignalCore */}
      <div className="fixed inset-0 z-0">
        <SignalCore controlRef={controlRef} orbitRef={orbitControlRef} />
      </div>

      {/* --- FIXED CONTENT LAYERS --- */}

      {/* State 0: Intro */}
      <div ref={textState0} className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-center px-10 md:px-24 opacity-0">
        <div className="max-w-4xl">
          <h1 className="text-[12vw] leading-[0.85] font-bold tracking-tighter text-white mb-8 mix-blend-exclusion">
            AdGrid
          </h1>
          <p className="text-xl md:text-3xl font-light text-white/80 tracking-wide max-w-2xl leading-relaxed">
            Where offline impact meets <br className="hidden md:block" />
            <span className="text-white">digital intelligence</span>
          </p>
        </div>
      </div>

      {/* State 1: Value */}
      <div ref={textState1} className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-center px-10 md:px-24 opacity-0">
        <div className="max-w-5xl">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
            Marketing built on <br />
            <span className="text-white/60">intelligence</span>, not intuition.
          </h2>
          <p className="text-lg md:text-2xl font-light text-white/70 tracking-wide max-w-xl">
            Designed for reach. Engineered for insight.
          </p>
        </div>
      </div>

      {/* State 2: Ring Annotation */}
      <div ref={textRing} className="fixed bottom-12 right-12 z-20 pointer-events-none opacity-0 mix-blend-difference max-w-sm">
        <div className="text-right">
          <div className="text-xs font-bold text-violet-300 tracking-[0.2em] mb-2">01 // VISIBILITY</div>
          <div className="text-2xl font-bold text-white tracking-tight uppercase mb-2">Are your campaigns<br />actually being seen?</div>
          <p className="text-sm font-light text-white/70">We plan and execute digital marketing that cuts through real-world noise and earns attention where it matters.</p>
        </div>
      </div>

      {/* State 3: Grid Annotation */}
      <div ref={textGrid} className="fixed bottom-12 left-12 z-20 pointer-events-none opacity-0 mix-blend-difference max-w-sm">
        <div className="text-left">
          <div className="text-xs font-bold text-cyan-300 tracking-[0.2em] mb-2">02 // ENGAGEMENT</div>
          <div className="text-2xl font-bold text-white tracking-tight uppercase mb-2">Turning visibility<br />into action</div>
          <p className="text-sm font-light text-white/70">From QR to DOOH and integrated touchpoints, we design experiences that move audiences from awareness to engagement.</p>
        </div>
      </div>

      {/* State 4: Graph Annotation */}
      <div ref={textGraph} className="fixed top-1/2 right-4 md:right-12 -translate-y-1/2 z-20 pointer-events-none opacity-0 mix-blend-difference max-w-sm">
        <div className="text-right">
          <div className="text-xs font-bold text-emerald-300 tracking-[0.2em] mb-2">03 // ANALYTICS</div>
          <div className="text-2xl font-bold text-white tracking-tight uppercase mb-2">Clarity on what’s<br />working</div>
          <p className="text-sm font-light text-white/70">We connect reach, engagement, and outcomes through analytics that help you understand performance — not just report it.</p>
        </div>
      </div>

      {/* State 5: Trust */}
      <div ref={textTrust} className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-center px-10 md:px-24 opacity-0">
        <div className="max-w-5xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-10 leading-tight">
            Performance-led marketing. <br />
            <span className="text-white/60">Backed by real data.</span>
          </h2>
          <div className="space-y-4">
            <p className="text-lg md:text-xl font-light text-white/80 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              Data-driven campaigns across DOOH, QR & digital channels
            </p>
            <p className="text-lg md:text-xl font-light text-white/80 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Offline visibility connected to measurable online performance
            </p>
            <p className="text-lg md:text-xl font-light text-white/80 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Strategy, execution, and analytics under one roof
            </p>
          </div>
        </div>
      </div>

      {/* State 6: Closing / CTA */}
      <div ref={textState6} className="fixed inset-0 z-30 pointer-events-none flex flex-col items-center justify-center opacity-0 scale-95">
        <a
          href="/contact"
          className="group pointer-events-auto relative inline-flex items-center justify-center px-16 py-6 overflow-hidden rounded-full backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
        >
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

          {/* Inner Highlight (Glass effect) */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50"></div>

          <span className="relative z-10 text-xl md:text-2xl font-light tracking-widest text-white uppercase group-hover:tracking-[0.15em] transition-all duration-300">Contact Us</span>
        </a>
      </div>

      {/* --- GLOBAL UI (Fixed) --- */}

      {/* Brand Logo */}
      <div className="fixed top-8 left-8 md:top-12 md:left-12 z-50 pointer-events-none">
        <img src="/logo.svg" alt="AdGrid Logo" className="w-10 h-10 md:w-12 md:h-12 opacity-90" />
      </div>

      {/* Hamburger Menu */}
      <NavigationMenu />

      {/* --- SCROLL SECTIONS --- */}
      <div className="relative z-10 w-full pointer-events-none">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            ref={(el) => { sections.current[i] = el; }} // Assign strictly typed ref
            className="h-screen w-full"
            data-index={i}
          />
        ))}

        {/* Footer */}
        <footer className="w-full py-12 md:py-24 border-t border-white/5 bg-[#0c0c0c]/80 backdrop-blur-sm pointer-events-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="flex items-center gap-3 opacity-50 mb-4">
              <img src="/logo.svg" alt="AdGrid" className="w-6 h-6 grayscale" />
              <span className="text-sm font-bold tracking-widest uppercase">AdGrid</span>
            </div>
            <p className="text-white/30 text-xs md:text-sm font-light tracking-wide">
              &copy; {new Date().getFullYear()} AdGrid Intelligence. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
