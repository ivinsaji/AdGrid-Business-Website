'use client';

import React, { useRef, useMemo, MutableRefObject, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LogoOrbitRing, OrbitControl } from './LogoOrbitRing';

export type SignalControl = {
    intensity: number; // Amplitude of distortion
    speed: number;     // Speed of time evolution
    rotationSpeed: number;
    shape?: 'sphere' | 'ring' | 'grid' | 'graph' | 'focus' | 'expansion' | 'billboard';
    showLogos?: boolean;
};

// Wrapper to pass ref logic safely - REMOVED

const ParticleSphere = ({ controlRef, orbitRef }: { controlRef?: MutableRefObject<SignalControl>, orbitRef?: React.Ref<OrbitControl> }) => {
    const mesh = useRef<THREE.Points>(null!);
    const count = 4000; // Slightly increased density

    // Generate initial particles and shape targets
    const { positions, colors, shapes } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const sphereTarget = new Float32Array(count * 3);
        const ringTarget = new Float32Array(count * 3);
        const gridTarget = new Float32Array(count * 3);
        const graphTarget = new Float32Array(count * 3);
        const focusTarget = new Float32Array(count * 3);
        const expansionTarget = new Float32Array(count * 3);
        const billboardTarget = new Float32Array(count * 3); // New State 2 shape (Billboard)

        const cols = new Float32Array(count * 3);
        const colorInside = new THREE.Color('#d8b4fe');
        const colorOutside = new THREE.Color('#5b21b6');

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // --- SPHERE GENERATION (Default) ---
            const r = 4.5 * Math.pow(Math.random(), 0.3);
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const noise = (Math.random() - 0.5) * 0.5;
            const finalR = r + noise;

            const sx = finalR * Math.sin(phi) * Math.cos(theta);
            const sy = finalR * Math.sin(phi) * Math.sin(theta);
            const sz = finalR * Math.cos(phi);

            // Set initial positions to Sphere
            pos[i3] = sx;
            pos[i3 + 1] = sy;
            pos[i3 + 2] = sz;

            sphereTarget[i3] = sx;
            sphereTarget[i3 + 1] = sy;
            sphereTarget[i3 + 2] = sz;

            // --- RING GENERATION (Social / DOOH) ---
            // Toroidal cluster
            const ringTheta = Math.random() * 2 * Math.PI;
            // Concentrated mainly in a ring r=3.5 to r=5.5
            const ringR = 3.5 + Math.random() * 2.5;
            const ringTubeR = (Math.random() - 0.5) * 2.0; // Flat disk-like spread vertical

            ringTarget[i3] = ringR * Math.cos(ringTheta);
            ringTarget[i3 + 1] = ringTubeR; // Vertical spread
            ringTarget[i3 + 2] = ringR * Math.sin(ringTheta);


            // --- GRID GENERATION (State 3: Engagement) ---
            // MASSIVE 3D QR CODE (Refined Density)
            // Deterministic 4x4 sub-grid per module for solidity

            if (i < 800) {
                // Global particles (Background - Sparse)
                const gx = (Math.random() - 0.5) * 22.0;
                const gy = (Math.random() - 0.5) * 14.0;
                const gz = (Math.random() - 0.5) * 12.0;
                gridTarget[i3] = gx;
                gridTarget[i3 + 1] = gy;
                gridTarget[i3 + 2] = gz;
            } else {
                // QR CODE STRUCTURE
                // Grid: 21x21 modules
                // Scale: ~6.0 units width
                const qrSize = 6.0;
                const moduleSize = qrSize / 21;

                // DETERMINISTIC MAPPING for density
                // Total active modules approx 250. 3200 particles avail.
                // ~12-16 particles per module. Let's do 16 (4x4 grid).

                // Adjust index to relative range [0 to 3200]
                const relIdx = i - 800;
                const partsPerModule = 16;

                // Which module is this particle assigned to?
                // Module Index = floor(relIdx / 16)

                const moduleTotalIdx = Math.floor(relIdx / partsPerModule);

                if (moduleTotalIdx < (21 * 21)) {
                    const row = Math.floor(moduleTotalIdx / 21);
                    const col = moduleTotalIdx % 21;

                    // Sub-grid position (0 to 15)
                    const subIdx = relIdx % partsPerModule;
                    const subRow = Math.floor(subIdx / 4); // 0-3
                    const subCol = subIdx % 4; // 0-3

                    // Logic: Is this module Active?
                    let isActive = false;

                    // Finder Patterns
                    const inTL = row < 7 && col < 7;
                    const inTR = row < 7 && col > 13;
                    const inBL = row > 13 && col < 7;

                    if (inTL || inTR || inBL) {
                        isActive = true;
                        // Ring Logic
                        const rL = (inTL ? row : (inTR ? row : row - 14));
                        const cL = (inTL ? col : (inTR ? col - 14 : col));
                        if (rL === 1 || rL === 5 || cL === 1 || cL === 5) {
                            if (rL > 0 && rL < 6 && cL > 0 && cL < 6) isActive = false;
                        }
                    } else {
                        // Deterministic Pseudo-Random Pattern
                        const seed = Math.sin(row * 12.9898 + col * 78.233) * 43758.5453;
                        isActive = (seed - Math.floor(seed)) > 0.5;
                    }

                    if (isActive) {
                        // Position: Top-Left of Module + SubGrid Offset
                        // Center X/Y of the whole QR
                        const startX = (col - 10.5) * moduleSize;
                        const startY = -(row - 10.5) * moduleSize;

                        // Sub-pixel offset (tightly packed)
                        const subStep = moduleSize / 4;
                        const offX = (subCol * subStep) + (subStep * 0.5) - (moduleSize * 0.5);
                        const offY = -(subRow * subStep) - (subStep * 0.5) + (moduleSize * 0.5);

                        // Flat Z
                        const zFlat = 0.5 + (Math.random() - 0.5) * 0.1;

                        gridTarget[i3] = startX + offX;
                        gridTarget[i3 + 1] = startY + offY;
                        gridTarget[i3 + 2] = zFlat;
                    } else {
                        // Inactive module -> Send to background cloud
                        const theta = Math.random() * Math.PI * 2;
                        const r = 5.0 + Math.random() * 3.0;
                        gridTarget[i3] = r * Math.cos(theta);
                        gridTarget[i3 + 1] = (Math.random() - 0.5) * 8.0;
                        gridTarget[i3 + 2] = r * Math.sin(theta);
                    }
                } else {
                    // Overflow particles -> Background cloud
                    const theta = Math.random() * Math.PI * 2;
                    const r = 5.0 + Math.random() * 3.0;
                    gridTarget[i3] = r * Math.cos(theta);
                    gridTarget[i3 + 1] = (Math.random() - 0.5) * 8.0;
                    gridTarget[i3 + 2] = r * Math.sin(theta);
                }
            }


            // --- GRAPH GENERATION (Analytics) ---
            // Bar chart / Data landscape
            // Grid on XZ, Height on Y
            const graphX = (Math.random() - 0.5) * 8;
            const graphZ = (Math.random() - 0.5) * 8;
            // Height based on distance from center ( bell curve data shape )
            const distFromCenter = Math.sqrt(graphX * graphX + graphZ * graphZ);
            const graphY = (Math.random() * 4) * Math.exp(-distFromCenter * 0.3); // Peak at center

            graphTarget[i3] = graphX;
            graphTarget[i3 + 1] = graphY - 2; // Shift down
            graphTarget[i3 + 2] = graphZ;

            // --- FOCUS GENERATION (State 6: Closing) ---
            // Radial short lines with organic curvature
            // Logic: Assign particle to a specific "ray". 
            // 80 rays * 50 particles = 4000
            const rayIndex = Math.floor(i / 50);
            const particleInRay = i % 50;
            const rayProg = particleInRay / 50; // 0 to 1 along the ray

            // Deterministic random angle for this ray
            // Use simple pseudo-random based on rayIndex to keep lines consistent
            const rayTheta = (rayIndex * 137.5) * (Math.PI / 180);
            const rayPhi = Math.acos(2 * ((rayIndex * 0.61803) % 1) - 1); // Golden ratio distribution on sphere

            // Base direction vector
            const rx = Math.sin(rayPhi) * Math.cos(rayTheta);
            const ry = Math.sin(rayPhi) * Math.sin(rayTheta);
            const rz = Math.cos(rayPhi);

            // Radius range: Start at 2.0 (clearing space for CTA), end at 6.0
            const rayStartR = 2.5;
            const rayEndR = 6.0;
            const currR = THREE.MathUtils.lerp(rayStartR, rayEndR, rayProg);

            // Add curl: Rotate vector slightly based on radius
            // Curl amount
            const curlAmt = currR * 0.3;
            // Simple rotation matrix approx or just offset
            const curlX = rx + Math.sin(currR) * 0.2;
            const curlY = ry + Math.cos(currR) * 0.2;
            const curlZ = rz;

            // Normalize and scale
            const curlLen = Math.sqrt(curlX * curlX + curlY * curlY + curlZ * curlZ);
            focusTarget[i3] = (curlX / curlLen) * currR;
            focusTarget[i3 + 1] = (curlY / curlLen) * currR;
            focusTarget[i3 + 2] = (curlZ / curlLen) * currR;

            // --- EXPANSION GENERATION (Contact) ---
            // Volumetric burst with density gradient
            // High density near center, spread outward
            const expR = Math.pow(Math.random(), 2) * 8.0 + 1.5; // Starts at 1.5 to clear button, extends to 9.5
            const expTheta = Math.random() * 2 * Math.PI;
            const expPhi = Math.acos(2 * Math.random() - 1);

            const ex = expR * Math.sin(expPhi) * Math.cos(expTheta);
            const ey = expR * Math.sin(expPhi) * Math.sin(expTheta);
            const ez = expR * Math.cos(expPhi);

            expansionTarget[i3] = ex;
            expansionTarget[i3 + 1] = ey;
            expansionTarget[i3 + 2] = ez;


            // --- BILLBOARD GENERATION (State 2: Visibility) ---
            // Dominant Laptop (Center) & Mobile (Right-Front)
            // No Web Window. High density screens with UI cues.

            if (i < 600) {
                // GLOBAL PARTICLE FIELD
                // Low density drift across the scene
                const gx = (Math.random() - 0.5) * 16.0;
                const gy = (Math.random() - 0.5) * 10.0;
                const gz = (Math.random() - 0.5) * 10.0;
                billboardTarget[i3] = gx;
                billboardTarget[i3 + 1] = gy;
                billboardTarget[i3 + 2] = gz;

            } else if (i < 2600) {
                // LAPTOP (Primary Anchor - Center/Left)
                // Large scale: Width ~5.0
                const isBase = Math.random() > 0.65; // 35% Base, 65% Screen

                if (isBase) {
                    // Keyboard/Base
                    // Flat plane at Y = -1.5, slightly tilted
                    const bx = (Math.random() - 0.5) * 5.0;
                    const bz = (Math.random() - 0.5) * 3.5;
                    billboardTarget[i3] = bx - 1.0; // Shift left
                    billboardTarget[i3 + 1] = -1.5 + (bz * 0.05); // Tilt
                    billboardTarget[i3 + 2] = bz + 1.0;
                } else {
                    // Screen: Abstract Dashboard UI
                    // Vertical Plane centered at -1.0
                    const sx = (Math.random() - 0.5) * 4.8;
                    const sy = (Math.random() - 0.5) * 3.0;

                    // UI Cues: Create grid voids for "Modules"
                    // If x,y falls in specific "gutter" ranges, push particle away or delete
                    // Simple grid: 2 cols, 2 rows
                    const inGutterX = Math.abs(sx) < 0.2;
                    const inGutterY = Math.abs(sy) < 0.2;
                    const zOffset = (inGutterX || inGutterY) ? -0.5 : 0.0; // Push gutters back/hide

                    billboardTarget[i3] = sx - 1.0;
                    billboardTarget[i3 + 1] = 0.5 + sy; // Lifted
                    billboardTarget[i3 + 2] = -1.5 + zOffset;
                }

            } else {
                // MOBILE PHONE (Dominant foreground - Right)
                // Tall, sleek, floating in front of laptop
                const mx = 2.5; // Right side

                const w = 1.4;
                const h = 2.8;

                const px = (Math.random() - 0.5) * w;
                const py = (Math.random() - 0.5) * h;

                // UI Cues: "Feed" blocks
                // Horizontal stripes of density
                const isFeedContent = Math.sin(py * 8.0) > 0.0; // Bands
                const pz = isFeedContent ? 0.1 : 0.0;

                // Rounded corners (clamp)
                billboardTarget[i3] = 2.5 + px;
                billboardTarget[i3 + 1] = 0.0 + py;
                billboardTarget[i3 + 2] = 2.5 + pz;
            }


            // --- COLORS ---
            const dist = Math.sqrt(sx * sx + sy * sy + sz * sz);
            const normalizedDist = Math.min(dist / 4.5, 1);
            const mixedColor = colorInside.clone().lerp(colorOutside, Math.pow(normalizedDist, 0.5));

            cols[i3] = mixedColor.r;
            cols[i3 + 1] = mixedColor.g;
            cols[i3 + 2] = mixedColor.b;
        }

        return {
            positions: pos,
            colors: cols,
            shapes: {
                sphere: sphereTarget,
                ring: ringTarget,
                grid: gridTarget,
                graph: graphTarget,
                focus: focusTarget,
                expansion: expansionTarget,
                billboard: billboardTarget
            }
        };
    }, []);

    // Internal smoothed transition buffer
    // Initialize with a copy of the sphere positions (or just 0s and fill first frame)
    const morphBuffer = useRef<Float32Array | null>(null);
    useMemo(() => {
        morphBuffer.current = new Float32Array(count * 3);
        if (shapes.sphere) {
            morphBuffer.current.set(shapes.sphere);
        }
    }, [shapes]);

    // Repulsion buffer for smoothed mouse interaction
    const repulsionBuffer = useRef<Float32Array | null>(null);
    useMemo(() => {
        repulsionBuffer.current = new Float32Array(count * 3).fill(0);
    }, [count]);

    // Scratch vectors for math
    const { _vec3, _dir, _worldMouse, _localMouse } = useMemo(() => ({
        _vec3: new THREE.Vector3(),
        _dir: new THREE.Vector3(),
        _worldMouse: new THREE.Vector3(),
        _localMouse: new THREE.Vector3()
    }), []);

    // Internal smoothed values to prevent jumps
    const smoothedValues = useRef({
        intensity: 0.1,
        speed: 0.5,
        rotationSpeed: 0.001
    });

    // Time accumulators for deterministic motion
    const timeRef = useRef(0);
    const rotationRef = useRef(0);

    // Smoothed mouse values
    const mouseRef = useRef({ x: 0, y: 0 });

    useFrame((state, delta) => {
        if (!mesh.current || !morphBuffer.current || !repulsionBuffer.current) return;

        // Target values from controlRef
        const targetIntensity = controlRef?.current.intensity ?? 0.1;
        const targetSpeed = controlRef?.current.speed ?? 0.5;
        const targetRotSpeed = controlRef?.current.rotationSpeed ?? 0.001;
        const targetShapeName = controlRef?.current.shape || 'sphere';

        // Critically damped response
        const lambda = 4.0;
        const alpha = 1.0 - Math.exp(-lambda * delta);

        smoothedValues.current.intensity = THREE.MathUtils.lerp(smoothedValues.current.intensity, targetIntensity, alpha);
        smoothedValues.current.speed = THREE.MathUtils.lerp(smoothedValues.current.speed, targetSpeed, alpha);
        // Rotation speed smoothing
        smoothedValues.current.rotationSpeed = THREE.MathUtils.lerp(smoothedValues.current.rotationSpeed, targetRotSpeed, alpha * 0.8);

        const { intensity, speed, rotationSpeed } = smoothedValues.current;

        // Accumulate time based on current speed (prevents phase jumps)
        timeRef.current += delta * speed;

        // Accumulate rotation based on current rotation speed
        rotationRef.current += delta * rotationSpeed;

        // Smooth mouse input
        const { mouse, camera } = state;
        mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, mouse.x, alpha * 0.5);
        mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, mouse.y, alpha * 0.5);

        // Deterministic Rotation Logic (Calculated early for worldToLocal)
        mesh.current.rotation.y = rotationRef.current;
        mesh.current.rotation.x = mouseRef.current.y * 0.05;
        mesh.current.rotation.z = (rotationRef.current * 0.5) + (mouseRef.current.x * 0.05);

        // Update matrix to ensure worldToLocal works on current frame state
        mesh.current.updateMatrixWorld();

        // --- MOUSE REPULSION CALCULATION ---
        // 1. Unproject mouse to World Space at Z=0 plane (Approximate interaction plane)
        _vec3.set(mouse.x, mouse.y, 0.5);
        _vec3.unproject(camera);
        _dir.copy(_vec3).sub(camera.position).normalize();

        // Intersect with Z=0 plane: P = O + t*D.  0 = Oz + t*Dz => t = -Oz / Dz
        const distToPlane = -camera.position.z / _dir.z;
        _worldMouse.copy(camera.position).add(_dir.multiplyScalar(distToPlane));

        // 2. Transform world mouse to Mesh Local Space
        _localMouse.copy(_worldMouse);
        mesh.current.worldToLocal(_localMouse);

        // Interaction Constants
        const repulsionRadius = 2.5;
        const repulsionForce = 0.5;
        const repulsionAlpha = 1.0 - Math.exp(-8.0 * delta); // Faster damping for reaction

        const positionsArray = mesh.current.geometry.attributes.position.array as Float32Array;
        const time = timeRef.current;

        // Morphing Logic: Smoothly interpolate morphBuffer towards targetShape
        const targetShapeArr = shapes[targetShapeName] || shapes.sphere;
        // Adjust morph speed (lower = slower morph)
        const morphAlpha = 1.0 - Math.exp(-3.0 * delta);

        // Deformation Logic
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Lerp base position
            morphBuffer.current[i3] = THREE.MathUtils.lerp(morphBuffer.current[i3], targetShapeArr[i3], morphAlpha);
            morphBuffer.current[i3 + 1] = THREE.MathUtils.lerp(morphBuffer.current[i3 + 1], targetShapeArr[i3 + 1], morphAlpha);
            morphBuffer.current[i3 + 2] = THREE.MathUtils.lerp(morphBuffer.current[i3 + 2], targetShapeArr[i3 + 2], morphAlpha);

            const ox = morphBuffer.current[i3];
            const oy = morphBuffer.current[i3 + 1];
            const oz = morphBuffer.current[i3 + 2];

            // --- REPULSION ---
            const dx = ox - _localMouse.x;
            const dy = oy - _localMouse.y;
            const dz = oz - _localMouse.z;

            const distSq = dx * dx + dy * dy + dz * dz;

            let targetRepX = 0;
            let targetRepY = 0;
            let targetRepZ = 0;

            if (distSq < repulsionRadius * repulsionRadius) {
                const dist = Math.sqrt(distSq);
                // Normalize direction
                const nx = dx / dist;
                const ny = dy / dist;
                const nz = dz / dist;

                // Smooth falloff (Cubic for subtler edge)
                const falloff = Math.pow(1.0 - (dist / repulsionRadius), 3.0);
                const force = falloff * repulsionForce;

                targetRepX = nx * force;
                targetRepY = ny * force;
                targetRepZ = nz * force;
            }

            // Smoothly interpolate current repulsion to target
            repulsionBuffer.current[i3] = THREE.MathUtils.lerp(repulsionBuffer.current[i3], targetRepX, repulsionAlpha);
            repulsionBuffer.current[i3 + 1] = THREE.MathUtils.lerp(repulsionBuffer.current[i3 + 1], targetRepY, repulsionAlpha);
            repulsionBuffer.current[i3 + 2] = THREE.MathUtils.lerp(repulsionBuffer.current[i3 + 2], targetRepZ, repulsionAlpha);

            const repX = repulsionBuffer.current[i3];
            const repY = repulsionBuffer.current[i3 + 1];
            const repZ = repulsionBuffer.current[i3 + 2];

            // Apply sine wave distortion on top of morphed position + repulsion
            positionsArray[i3] = ox + Math.sin(time + oy * 0.5) * intensity + repX;
            positionsArray[i3 + 1] = oy + Math.cos(time * 0.6 + oz * 0.5) * intensity + repY;
            positionsArray[i3 + 2] = oz + Math.sin(time * 0.8 + ox * 0.5) * intensity + repZ;
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <>
            <points ref={mesh}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                        args={[colors, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.03}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
            <LogoOrbitRing ref={orbitRef} />
        </>
    );
};

const SignalCore = ({ controlRef, orbitRef }: { controlRef?: MutableRefObject<SignalControl>, orbitRef?: React.Ref<OrbitControl> }) => {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 12], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <ParticleSphere controlRef={controlRef} orbitRef={orbitRef} />
            </Canvas>
        </div>
    );
};
export default SignalCore;
