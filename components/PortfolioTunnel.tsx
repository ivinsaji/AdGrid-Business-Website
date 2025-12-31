'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface TunnelProps {
    scrollProgress: React.MutableRefObject<number>; // 0 to 1
}

// 1. STATIC STARFIELD (The Dust)
const StarField = () => {
    const pointsRef = useRef<THREE.Points>(null);
    const particleCount = 2000;
    const tunnelLength = 100; // How deep the journey goes

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const cols = new Float32Array(particleCount * 3);
        const color1 = new THREE.Color("#4c1d95"); // Violet 900
        const color2 = new THREE.Color("#a78bfa"); // Violet 400
        const tempColor = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Tunnel shape: Random X/Y in a spread
            const r = 4 + Math.random() * 15; // Wider radius
            const theta = Math.random() * Math.PI * 2;

            pos[i * 3] = r * Math.cos(theta); // x
            pos[i * 3 + 1] = r * Math.sin(theta); // y

            // Z: Spread along the negative axis (forward travel = moving negative Z)
            // or we can move camera Positive and have particles Positive.
            // Let's Move Camera towards -Z (into screen). So particles are spread from 0 to -100.
            pos[i * 3 + 2] = -Math.random() * tunnelLength;

            tempColor.lerpColors(color1, color2, Math.random());
            cols[i * 3] = tempColor.r;
            cols[i * 3 + 1] = tempColor.g;
            cols[i * 3 + 2] = tempColor.b;
        }
        return [pos, cols];
    }, []);

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// 2. ENERGY ORB (The Landmarks)
const EnergyOrb = ({ position, scale = 1 }: { position: [number, number, number], scale?: number }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Slow rotation
        groupRef.current.rotation.y += 0.002;
        groupRef.current.rotation.z += 0.001;

        // Pulse
        const t = state.clock.getElapsedTime();
        const pulse = 1 + Math.sin(t * 1.5) * 0.05;
        groupRef.current.scale.setScalar(scale * pulse);
    });

    return (
        <group ref={groupRef} position={new THREE.Vector3(...position)}>
            {/* Wireframe Sphere */}
            <mesh>
                <icosahedronGeometry args={[1, 2]} />
                <meshBasicMaterial
                    color="#8b5cf6"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* Inner Core Glow (Sprite) */}
            <mesh scale={0.4}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="#4c1d95" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Outer Signal Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.4, 0.02, 16, 100]} />
                <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
};

// 3. CAMERA CONTROLLER
// Moves the camera based on scroll progress
const CameraRig = ({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) => {
    const { camera } = useThree();

    useFrame(() => {
        // Map scroll (0 to 1) to Z position (0 to -90)
        // We fly INTO the screen (negative Z)
        const targetZ = -scrollProgress.current * 90;

        // Smooth lerp for "Cinematic" feel
        camera.position.z += (targetZ - camera.position.z) * 0.05;

        // Add subtle mouse parallax if we had mouse pos. For now, strict scroll-path.
        // Maybe slight sway?
        // camera.position.x = Math.sin(scrollProgress.current * 10) * 0.5;
    });
    return null;
};

const PortfolioTunnel = ({ scrollProgress }: TunnelProps) => {
    return (
        <div className="fixed inset-0 z-0 bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true }}>
                <fog attach="fog" args={['#050505', 0, 40]} />
                <CameraRig scrollProgress={scrollProgress} />

                <StarField />

                {/* Place Orbs along the path */}
                {/* They should be encountered around where the content appears */}
                <EnergyOrb position={[3, 2, -15]} scale={1.5} />
                <EnergyOrb position={[-3, -1, -35]} scale={2} />
                <EnergyOrb position={[4, 1, -60]} scale={1.8} />
                <EnergyOrb position={[-2, 3, -85]} scale={2.2} />

            </Canvas>
        </div>
    );
};

export default PortfolioTunnel;
