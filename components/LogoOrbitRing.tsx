'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export interface OrbitControl {
    show: () => void;
    hide: () => void;
}

interface LogoOrbitRingProps {
    // Props can be empty if control is purely imperative
}

export const LogoOrbitRing = forwardRef<OrbitControl, LogoOrbitRingProps>((props, ref) => {
    const group = useRef<THREE.Group>(null!);
    const targetOpacity = useRef(0); // Start hidden

    useImperativeHandle(ref, () => ({
        show: () => {
            targetOpacity.current = 0.3; // Target visible opacity
        },
        hide: () => {
            targetOpacity.current = 0;
        }
    }));

    // Load textures
    const textures = useLoader(THREE.TextureLoader, [
        '/logos/nike.svg',
        '/logos/google.svg',
        '/logos/youtube.svg',
        '/logos/whatsapp.svg',
        '/logos/analytics.svg',
        '/logos/linkedin.svg',
        '/logos/boat.svg', // Replaced Shopify with boAt
        '/logos/nvidia.svg' // Replaced WordPress with Nvidia
    ]);

    const logos = textures.map((tex) => ({ tex }));

    useFrame((state, delta) => {
        if (!group.current) return;
        // Slow continuous rotation
        group.current.rotation.y += delta * 0.05;

        // Smooth opacity transition
        group.current.children.forEach((child) => {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshBasicMaterial;

            // Lerp towards targetOpacity
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity.current, delta * 2.0);
            mat.visible = mat.opacity > 0.01;
        });
    });

    return (
        <group ref={group} rotation={[0.2, 0, 0]}> {/* Slight tilt */}
            {logos.map((logo, i) => {
                const angle = (i / logos.length) * Math.PI * 2;
                const radius = 6.5; // Slightly larger than sphere (4.5)
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                // Base size 0.45, plus slight variation +/- 10%
                const size = 0.45 + (Math.sin(i * 99) * 0.05);

                return (
                    <mesh key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
                        <planeGeometry args={[size, size]} />
                        <meshBasicMaterial
                            map={logo.tex}
                            transparent
                            opacity={0} // Start invisible
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>
                );
            })}
        </group>
    );
});

LogoOrbitRing.displayName = 'LogoOrbitRing';

export default LogoOrbitRing;
