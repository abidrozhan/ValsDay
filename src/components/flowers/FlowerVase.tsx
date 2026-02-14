"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FlowerData } from "@/lib/flowersData";
import { useRouter } from "next/navigation";
import { useAudio } from "@/components/AudioProvider";
import GlowButton from "@/components/GlowButton";
import Image from "next/image";

interface FlowerVaseProps {
    flowers: FlowerData[];
}

// Positions for 5 flowers — stems go INTO the vase, heads peek out
const FLOWER_POSITIONS = [
    { x: -30, y: -45, rotate: -12, scale: 1.0, z: 2 },   // K (Blue Tulip - Back Left)
    { x: 0, y: -55, rotate: 0, scale: 1.1, z: 3 },    // A (Pink Branch - Center Tall)
    { x: -18, y: -25, rotate: -8, scale: 1.0, z: 5 },       // L (Pink Small - Front Left)
    { x: 30, y: -40, rotate: 10, scale: 0.95, z: 2 },    // Y (Purple Tulip - Back Right)
    { x: 15, y: -20, rotate: 6, scale: 1.05, z: 6 },     // A2 (Red Rose - Front Right, most forward)
];

// Sparkle positions
const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
    x: Math.cos((i / 12) * Math.PI * 2) * (100 + Math.random() * 60),
    y: Math.sin((i / 12) * Math.PI * 2) * (80 + Math.random() * 50) - 40,
    delay: Math.random() * 2,
    size: 6 + Math.random() * 8,
}));

export default function FlowerVase({ flowers }: FlowerVaseProps) {
    const router = useRouter();
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowText(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        router.push("/menu");
    };

    return (
        <div className="flowers-vase-page">
            {/* Sparkles */}
            <div className="flowers-sparkles">
                {SPARKLES.map((s, i) => (
                    <motion.div
                        key={i}
                        className="flowers-sparkle"
                        style={{
                            width: s.size,
                            height: s.size,
                            left: `calc(50% + ${s.x}px)`,
                            top: `calc(45% + ${s.y}px)`,
                        }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: s.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Vase with flowers */}
            <motion.div
                className="flowers-vase-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Flowers in bouquet */}
                <div className="flowers-bouquet">
                    {flowers.map((flower, i) => (
                        <motion.div
                            key={i}
                            className="flowers-bouquet-item"
                            style={{
                                left: `calc(50% + ${FLOWER_POSITIONS[i].x}px)`,
                                top: `calc(50% + ${FLOWER_POSITIONS[i].y}px)`,
                                zIndex: FLOWER_POSITIONS[i].z,
                            }}
                            initial={{ opacity: 0, y: 100, scale: 0, rotate: 0 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: FLOWER_POSITIONS[i].scale,
                                rotate: FLOWER_POSITIONS[i].rotate,
                            }}
                            transition={{
                                delay: 0.3 + i * 0.2, // Stagger flowers
                                duration: 1.2,
                                type: "spring",
                                stiffness: 80,
                                damping: 15,
                            }}
                        >
                            <div className="flowers-bouquet-img-wrapper">
                                <Image
                                    src={flower.image}
                                    alt={flower.name}
                                    width={140}
                                    height={180}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Glass vase */}
                <motion.div
                    className="flowers-glass-vase"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flowers-vase-body">
                        <div className="flowers-vase-water" />
                    </div>
                </motion.div>
            </motion.div>

            {/* Text */}
            {showText && (
                <motion.div
                    className="flowers-vase-text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <p className="flowers-vase-message">
                        This bouquet spells <strong>K-A-Y-L-A</strong>.<br />
                        Just like these flowers, you are uniquely beautiful. 🌸
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <GlowButton variant="secondary" onClick={handleBack}>
                            ← Back to Menu
                        </GlowButton>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
