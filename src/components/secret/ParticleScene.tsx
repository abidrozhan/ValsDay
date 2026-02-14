"use client";

import React, { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HandData } from "./types";

// ========== SHAPE GENERATORS ==========

function heartShape(i: number, count: number): [number, number, number] {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const z = (Math.random() - 0.5) * 2;
    return [x * 0.12, y * 0.12 + 0.5, z * 0.3];
}

function roseShape(i: number, count: number): [number, number, number] {
    if (i < count * 0.12) {
        // Stem
        return [
            (Math.random() - 0.5) * 0.15,
            -1.5 - (i / (count * 0.12)) * 2.5,
            (Math.random() - 0.5) * 0.15,
        ];
    }
    const t = ((i - count * 0.12) / (count * 0.88)) * Math.PI * 6;
    const r = Math.cos(t * 0.8) * 1.8 + 1.2;
    return [r * Math.cos(t) * 0.5, r * Math.sin(t) * 0.5, (Math.random() - 0.5) * 0.4];
}

function earthShape(i: number, count: number): [number, number, number] {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.2 + (Math.random() - 0.5) * 0.2;
    return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
    ];
}

function galaxyShape(i: number, count: number): [number, number, number] {
    const arm = Math.floor(Math.random() * 3);
    const armAngle = (arm / 3) * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.5) * 4;
    const angle = armAngle + dist * 0.8 + (Math.random() - 0.5) * 0.4;
    return [
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 0.3,
        Math.sin(angle) * dist,
    ];
}

function butterflyShape(i: number, count: number): [number, number, number] {
    const t = (i / count) * Math.PI * 12;
    const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5);
    return [Math.sin(t) * r * 0.8, Math.cos(t) * r * 0.8, (Math.random() - 0.5) * 0.3];
}

function dnaShape(i: number, count: number): [number, number, number] {
    const t = (i / count) * Math.PI * 8;
    const y = (i / count) * 6 - 3;
    const strand = i % 2 === 0 ? 1 : -1;
    return [Math.cos(t) * strand * 1.2, y, Math.sin(t) * strand * 1.2];
}

function textShape(text: string, i: number, count: number): [number, number, number] {
    // High-res canvas for clearer text
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.font = "bold 80px Arial"; // Larger font
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Split text into lines if needed, or just draw
    // "Hi Kay! ini Abid" is short enough for one line or two
    // Let's use two lines for better clarity
    if (text.includes("ini")) {
        const lines = text.split("! ");
        ctx.fillText(lines[0] + "!", 512, 100);
        ctx.fillText(lines[1], 512, 180);
    } else {
        ctx.fillText(text, 512, 128);
    }

    const imageData = ctx.getImageData(0, 0, 1024, 256);
    const pixels: [number, number][] = [];
    // Sample every 2nd pixel horizontally, every 2nd vertically = good density
    for (let y = 0; y < 256; y += 2) {
        for (let x = 0; x < 1024; x += 2) {
            if (imageData.data[(y * 1024 + x) * 4] > 128) {
                pixels.push([(x - 512) / 60, -(y - 128) / 60]); // Scale down
            }
        }
    }
    if (pixels.length === 0) return [0, 0, 0];
    const p = pixels[i % pixels.length];
    // Minimal jitter for sharpness
    return [p[0] + (Math.random() - 0.5) * 0.02, p[1] + (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.1];
}

// ========== PATTERN DEFINITIONS ==========
export interface PatternDef {
    id: string;
    name: string;
    emoji: string;
    generate: (i: number, count: number) => [number, number, number];
}

export const PATTERNS: PatternDef[] = [
    { id: "heart", name: "Heart", emoji: "❤️", generate: heartShape },
    { id: "rose", name: "Rose", emoji: "🌹", generate: roseShape },
    { id: "earth", name: "Earth", emoji: "🌍", generate: earthShape },
    { id: "galaxy", name: "Galaxy", emoji: "🌌", generate: galaxyShape },
    { id: "butterfly", name: "Butterfly", emoji: "🦋", generate: butterflyShape },
    { id: "dna", name: "DNA", emoji: "🧬", generate: dnaShape },
    {
        id: "text",
        name: "Message",
        emoji: "💬",
        generate: (i, count) => textShape("Hi Kay! ini Abid", i, count),
    },
];

// ========== PARTICLE SYSTEM ==========

const PARTICLE_COUNT = 3500;

interface ParticlesProps {
    handData: HandData;
    patternId: string;
    particleColor: string;
    intensity: number;
}

function Particles({ handData, patternId, particleColor, intensity }: ParticlesProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const targetPositions = useRef(new Float32Array(PARTICLE_COUNT * 3));
    const velocities = useRef(new Float32Array(PARTICLE_COUNT * 3));
    const currentPattern = useRef("");
    const transitionProgress = useRef(0);
    const baseColor = useRef(new THREE.Color(particleColor));

    // Initialize positions
    const [positions, colors, sizes] = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const col = new Float32Array(PARTICLE_COUNT * 3);
        const siz = new Float32Array(PARTICLE_COUNT);

        const color = new THREE.Color(particleColor);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 8;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 4;

            // Vary the color slightly per particle
            const hsl = { h: 0, s: 0, l: 0 };
            color.getHSL(hsl);
            const varied = new THREE.Color().setHSL(
                hsl.h + (Math.random() - 0.5) * 0.08,
                Math.max(0, Math.min(1, hsl.s + (Math.random() - 0.5) * 0.2)),
                Math.max(0, Math.min(1, hsl.l + (Math.random() - 0.5) * 0.15))
            );
            col[i * 3] = varied.r;
            col[i * 3 + 1] = varied.g;
            col[i * 3 + 2] = varied.b;

            siz[i] = 1 + Math.random() * 2.5;
        }
        return [pos, col, siz];
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

    // Update color when prop changes
    useFrame(() => {
        baseColor.current.set(particleColor);
    });

    // Generate target positions for current pattern
    const generateTargets = useCallback((pid: string) => {
        const pattern = PATTERNS.find((p) => p.id === pid);
        if (!pattern) return;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const [x, y, z] = pattern.generate(i, PARTICLE_COUNT);
            targetPositions.current[i * 3] = x;
            targetPositions.current[i * 3 + 1] = y;
            targetPositions.current[i * 3 + 2] = z;
        }
    }, []);

    // Zoom ref for smooth depth tracking
    const zoomRef = useRef(1.0);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const geo = pointsRef.current.geometry;
        const posAttr = geo.attributes.position as THREE.BufferAttribute;
        const colAttr = geo.attributes.color as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const colArray = colAttr.array as Float32Array;

        const gesture = handData.gesture;
        const handX = (handData.x - 0.5) * 8;
        const handY = -(handData.y - 0.5) * 6;
        const t = state.clock.elapsedTime;

        // === Z-Depth Zoom: hand close to camera = zoom in ===
        const targetZoom = 0.6 + (1.0 - handData.z) * 0.8; // z=0(close)→1.4x, z=1(far)→0.6x
        zoomRef.current = THREE.MathUtils.lerp(zoomRef.current, targetZoom, delta * 2);
        const zoom = zoomRef.current;

        // === Gesture → Pattern mapping ===
        let gesturePattern = "heart";
        if (gesture === "idle") gesturePattern = "text";
        else if (gesture === "one_finger") gesturePattern = "rose";
        else if (gesture === "two_fingers") gesturePattern = "butterfly"; // 2 fingers = Butterfly
        else if (gesture === "both_hands") gesturePattern = "heart";
        else if (gesture === "fist") gesturePattern = "earth"; // Fist = Earth
        else if (gesture === "open_hand") gesturePattern = "galaxy"; // Open = Galaxy (with explode transition)

        const effectivePattern = gesturePattern;

        // Detect pattern change → regenerate targets
        if (effectivePattern !== currentPattern.current) {
            if (effectivePattern === "__explode__") {
                // Manual explosion trigger
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const a1 = Math.random() * Math.PI * 2;
                    const a2 = Math.random() * Math.PI * 2;
                    const d = 4 + Math.random() * 6;
                    targetPositions.current[i * 3] = Math.sin(a1) * Math.cos(a2) * d;
                    targetPositions.current[i * 3 + 1] = Math.sin(a1) * Math.sin(a2) * d;
                    targetPositions.current[i * 3 + 2] = Math.cos(a1) * d;
                }
            } else if (effectivePattern === "galaxy" && currentPattern.current !== "galaxy") {
                // Galaxy transition: Explode first, then converge
                // 1. Scatter
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    const a1 = Math.random() * Math.PI * 2;
                    const a2 = Math.random() * Math.PI * 2;
                    const d = 5 + Math.random() * 8;
                    targetPositions.current[i * 3] = Math.sin(a1) * Math.cos(a2) * d;
                    targetPositions.current[i * 3 + 1] = Math.sin(a1) * Math.sin(a2) * d;
                    targetPositions.current[i * 3 + 2] = Math.cos(a1) * d;
                }
                // 2. Schedule convergence after 800ms
                setTimeout(() => {
                    if (currentPattern.current === "galaxy") {
                        generateTargets("galaxy");
                        transitionProgress.current = 0;
                    }
                }, 800);
            } else {
                generateTargets(effectivePattern);
            }
            currentPattern.current = effectivePattern;
            transitionProgress.current = 0;
        }
        transitionProgress.current = Math.min(1, transitionProgress.current + delta * 0.8);

        // Spring-damped smoothing speed
        const isFist = effectivePattern === "__explode__";
        const baseSpeed = isFist ? 8.0 : (1.5 + intensity * 2.5);

        // Simple smooth lerp (removing spring physics for performance)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            let tx = targetPositions.current[ix] * zoom;
            let ty = targetPositions.current[iy] * zoom;
            let tz = targetPositions.current[iz] * zoom;

            // Hand position offset
            if (gesture === "move" || gesture === "open_hand") {
                tx += handX * 0.35;
                ty += handY * 0.35;
            }

            // Gentle floating
            tx += Math.sin(t * 0.4 + i * 0.08) * 0.04;
            ty += Math.cos(t * 0.25 + i * 0.12) * 0.04;

            // Optimized lerp - cheaper than spring physics
            const lerpFactor = delta * baseSpeed;
            posArray[ix] = posArray[ix] + (tx - posArray[ix]) * lerpFactor;
            posArray[iy] = posArray[iy] + (ty - posArray[iy]) * lerpFactor;
            posArray[iz] = posArray[iz] + (tz - posArray[iz]) * lerpFactor;

            // Smooth color transition
            const tR = baseColor.current.r + (Math.sin(i * 0.5) * 0.08);
            const tG = baseColor.current.g + (Math.cos(i * 0.3) * 0.08);
            const tB = baseColor.current.b + (Math.sin(i * 0.7) * 0.04);
            colArray[ix] = THREE.MathUtils.lerp(colArray[ix], Math.max(0, Math.min(1, tR)), delta * 2);
            colArray[iy] = THREE.MathUtils.lerp(colArray[iy], Math.max(0, Math.min(1, tG)), delta * 2);
            colArray[iz] = THREE.MathUtils.lerp(colArray[iz], Math.max(0, Math.min(1, tB)), delta * 2);
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;

        // Gentle scene rotation
        pointsRef.current.rotation.y += delta * 0.06;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                vertexColors
                transparent
                opacity={0.9}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

// ========== SCENE WRAPPER ==========

interface ParticleSceneProps {
    handData: HandData;
    patternId: string;
    particleColor: string;
    intensity: number;
}

export default function ParticleScene({ handData, patternId, particleColor, intensity }: ParticleSceneProps) {
    return (
        <div className="particle-scene-container">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.3} />
                <Particles
                    handData={handData}
                    patternId={patternId}
                    particleColor={particleColor}
                    intensity={intensity}
                />
            </Canvas>
        </div>
    );
}
