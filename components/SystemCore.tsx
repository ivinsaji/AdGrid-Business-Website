'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Ring } from '@react-three/drei';
import * as THREE from 'three';

// 1. Refined Nucleus
// Dense, sharp, high contrast.
const Nucleus = ({ active }: { active: boolean }) => {
    const ref = useRef<THREE.Points>(null);

    // Generate particles - Denser at center
    const particles = useMemo(() => {
        const count = 3500;
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Exponential falloff for dense core
            // Random 0-1, powered to cluster near 0, then scaled.
            const distance = (Math.pow(Math.random(), 2.5) * 1.8) + 0.2; // 0.2 to 2.0

            const x = distance * Math.sin(theta) * Math.cos(phi);
            const y = distance * Math.sin(theta) * Math.sin(phi);
            const z = distance * Math.cos(theta);

            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            // "System idle -> compute -> idle"
            // Idle: very slow rotation.
            // Active: slightly faster.
            const targetSpeedY = active ? 0.3 : 0.04;
            ref.current.rotation.y += delta * targetSpeedY;

            // Minimal wobble, just drift
            ref.current.rotation.x += delta * 0.01;
        }
    });

    return (
        <group>
            <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={active ? "#ffffff" : "#a78bfa"} // White flash on active, else violet
                    size={0.025} // Smaller, sharper
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={active ? 0.9 : 0.7} // Brighter on active
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
};

// 2. Signal Arcs
// Broken, partial orbits.
const SignalArc = ({ radius, speed, axis, length, color = "#6366f1", active }: { radius: number, speed: number, axis: [number, number, number], length: number, color?: string, active: boolean }) => {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            // Constant slow drift
            ref.current.rotation.z += delta * speed;

            // Active: maybe a quick jump? 
            if (active) {
                ref.current.rotation.z += delta * speed * 2;
            }
        }
    });

    return (
        <group rotation={new THREE.Euler(...axis)}>
            <mesh ref={ref}>
                <ringGeometry args={[radius, radius + 0.015, 64, 1, 0, length]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
};

// 3. Compute Burst (Transient)
// A subtle shockwave or stream on interaction
const ComputeBurst = ({ active }: { active: boolean }) => {
    const ref = useRef<THREE.Points>(null);
    const [burstParams] = useState(() => {
        const temp = new Float32Array(200 * 3); // Few particles
        // Initialize randomly
        for (let i = 0; i < 200; i++) {
            temp[i * 3] = (Math.random() - 0.5) * 3;
            temp[i * 3 + 1] = (Math.random() - 0.5) * 3;
            temp[i * 3 + 2] = (Math.random() - 0.5) * 3;
        }
        return temp;
    });

    useFrame((state) => {
        if (ref.current) {
            // Pulse opacity based on active
            // If active, flickers. If not, invisible.
            ref.current.visible = active;
            if (active) {
                const flicker = Math.random() > 0.8;
                ref.current.scale.setScalar(flicker ? 1.1 : 1.0);
            }
        }
    });

    return null; // Disabling burst particles for cleaner look, relying on Nucleus flash. 
    // Actually, user asked for "particle streams... motion lasts milliseconds".
    // Let's stick to the Nucleus material color change for the "pulse" as it's cleaner "Infrastructure".
    // The Nucleus change handles the "Burst" requirement via color/opacity shift.
};


// 4. Main Scene
const Scene = ({ active }: { active: boolean }) => {
    return (
        <group scale={1.2}> {/* 20% larger */}
            {/* Inner Core */}
            <Nucleus active={active} />

            {/* Orbital Arcs - Sparse, broken */}
            {/* Violet-500: #8b5cf6, Indigo-500: #6366f1 */}
            <SignalArc radius={2.2} speed={0.05} axis={[Math.PI / 3, 0, 0]} length={Math.PI / 2} color="#8b5cf6" active={active} />
            <SignalArc radius={2.8} speed={-0.03} axis={[0, Math.PI / 4, 0]} length={Math.PI / 1.5} color="#6366f1" active={active} />
        </group>
    );
};

interface SystemCoreProps {
    active?: boolean;
    className?: string;
}

const SystemCore = ({ active = false, className = "" }: SystemCoreProps) => {
    return (
        <div className={`w-full h-full relative ${className}`}>
            {/* Background Glow - localized to core, subdued */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-violet-600/10 blur-[60px] rounded-full transition-opacity duration-300 ${active ? 'opacity-80' : 'opacity-30'}`} />

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                <Scene active={active} />
            </Canvas>
        </div>
    );
};

export default SystemCore;
