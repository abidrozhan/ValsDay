"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STORY_STEPS, FlowerData, getRandomFlower } from "@/lib/flowersData";
import GlowButton from "@/components/GlowButton";
import Image from "next/image";

interface FlowersStoryProps {
    onComplete: (flowers: FlowerData[]) => void;
}

export default function FlowersStory({ onComplete }: FlowersStoryProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [collectedFlowers, setCollectedFlowers] = useState<FlowerData[]>([]);
    const [newFlower, setNewFlower] = useState<FlowerData | null>(null);
    const [showFlowerPop, setShowFlowerPop] = useState(false);

    const story = STORY_STEPS[currentStep];
    const isLastStep = currentStep === STORY_STEPS.length - 1;

    const handleNext = () => {
        // Collect a flower
        const flower = getRandomFlower(collectedFlowers);
        const updated = [...collectedFlowers, flower];
        setCollectedFlowers(updated);
        setNewFlower(flower);
        setShowFlowerPop(true);
    };

    const handleContinue = () => {
        setShowFlowerPop(false);
        setNewFlower(null);

        if (isLastStep) {
            onComplete(collectedFlowers);
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    return (
        <div className="flowers-story-page">
            {/* Flower collection indicator */}
            <div className="flowers-collection-bar">
                <div className="flowers-collected-icons">
                    {collectedFlowers.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flowers-collected-icon-img"
                        >
                            <Image
                                src={f.image}
                                alt={f.name}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </motion.div>
                    ))}
                    {Array.from({ length: 5 - collectedFlowers.length }).map((_, i) => (
                        <span key={`empty-${i}`} className="flowers-collected-empty">○</span>
                    ))}
                </div>
                <span className="flowers-collected-text">
                    Flowers collected 🌸 ({collectedFlowers.length}/5)
                </span>
            </div>

            {/* Story Content */}
            <AnimatePresence mode="wait">
                {!showFlowerPop && (
                    <motion.div
                        key={currentStep}
                        className="flowers-story-card"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <span className="flowers-step-badge">
                            {currentStep + 1} / {STORY_STEPS.length}
                        </span>

                        <div className="flowers-story-text">
                            {story.lines.map((line, i) => (
                                <motion.p
                                    key={i}
                                    className="flowers-story-line"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + i * 0.4, duration: 0.5 }}
                                >
                                    {line}
                                </motion.p>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + story.lines.length * 0.4 + 0.3, duration: 0.4 }}
                        >
                            <GlowButton onClick={handleNext}>
                                {isLastStep ? "I have something…" : "Next →"}
                            </GlowButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Flower Pop Animation (Congrats Modal) */}
            <AnimatePresence>
                {showFlowerPop && newFlower && (
                    <motion.div
                        className="flowers-pop-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: "fixed", inset: 0, zIndex: 100,
                            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                    >
                        <motion.div
                            className="flowers-pop-card"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "24px",
                                padding: "2rem",
                                textAlign: "center",
                                maxWidth: "320px",
                                width: "90%",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(236,72,153,0.2)"
                            }}
                        >
                            <h2 style={{
                                fontSize: "1.8rem", fontWeight: 800,
                                background: "linear-gradient(135deg, #ec4899, #f472b6)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                                marginBottom: "1rem"
                            }}>
                                Congratulation! 🎉
                            </h2>

                            <div style={{
                                position: "relative", width: "160px", height: "160px", margin: "0 auto 1.5rem"
                            }}>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        position: "absolute", inset: 0, borderRadius: "50%",
                                        background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)"
                                    }}
                                />
                                <Image
                                    src={newFlower.image}
                                    alt={newFlower.name}
                                    fill
                                    className="object-contain"
                                    sizes="160px"
                                />
                            </div>

                            <p style={{
                                color: "rgba(255,255,255,0.9)", fontSize: "1.1rem", marginBottom: "0.5rem", fontWeight: 600
                            }}>
                                {newFlower.name}
                            </p>
                            <p style={{
                                color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "2rem"
                            }}>
                                Added to your collection
                            </p>

                            <GlowButton onClick={handleContinue}>
                                {isLastStep ? "Finish Collection ✨" : "Continue Journey →"}
                            </GlowButton>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
