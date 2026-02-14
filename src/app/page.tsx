"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import FloatingHearts from "@/components/FloatingHearts";
import GlowButton from "@/components/GlowButton";
import { useAudio } from "@/components/AudioProvider";

type Stage = "loading" | "music" | "message";

const fadeVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
};

export default function HomePage() {
    const [stage, setStage] = useState<Stage>("loading");
    const { startTheme } = useAudio();
    const router = useRouter();

    // Auto-transition from loading to music after 3.5s
    useEffect(() => {
        if (stage === "loading") {
            const timer = setTimeout(() => setStage("music"), 3500);
            return () => clearTimeout(timer);
        }
    }, [stage]);

    const handlePlayMusic = () => {
        startTheme();
        setStage("message");
    };

    const handleExplore = () => {
        router.push("/menu");
    };

    return (
        <>
            <FloatingHearts count={20} />

            <AnimatePresence mode="wait">
                {/* ========== LOADING SCREEN ========== */}
                {stage === "loading" && (
                    <motion.div
                        key="loading"
                        className="loading-screen"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="loading-heart-icon"
                            animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                        >
                            💗
                        </motion.div>

                        <motion.p
                            className="loading-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Menyiapkan sesuatu yang spesial untuk Kayla…
                        </motion.p>

                        <div className="loading-dots">
                            <span className="loading-dot" />
                            <span className="loading-dot" />
                            <span className="loading-dot" />
                        </div>
                    </motion.div>
                )}

                {/* ========== MUSIC WARNING ========== */}
                {stage === "music" && (
                    <motion.div
                        key="music"
                        className="music-page"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="music-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                        >
                            <span className="music-card-icon">🎵</span>
                            <h2>Before We Continue…</h2>
                            <p>
                                Please start the music first to make this experience
                                even more special for you 🎶
                            </p>
                            <GlowButton onClick={handlePlayMusic}>
                                ▶ Play Music
                            </GlowButton>
                        </motion.div>
                    </motion.div>
                )}

                {/* ========== ENCOURAGEMENT MESSAGE ========== */}
                {stage === "message" && (
                    <motion.div
                        key="message"
                        className="message-page"
                        variants={fadeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <div className="message-content">
                            <motion.div
                                className="message-quote-icon"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 0.5, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                ❝
                            </motion.div>

                            <div className="message-text">
                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.7 }}
                                >
                                    Kayla, even on the days when you feel misunderstood or unsure,
                                    please remember this, you are never walking alone.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0, duration: 0.7 }}
                                >
                                    Your feelings are valid, your voice matters,
                                    and your dreams are worth chasing.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5, duration: 0.7 }}
                                >
                                    You have everything within you to become
                                    whoever you want to be.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 2.0, duration: 0.7 }}
                                >
                                    I hope this small surprise makes your heart
                                    a little lighter today. 💕
                                </motion.p>
                            </div>

                            <motion.div
                                className="message-signature"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.6, duration: 0.6 }}
                            >
                                — With all my love ♡
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 3.0, duration: 0.6 }}
                            >
                                <GlowButton onClick={handleExplore}>
                                    Let&apos;s Explore More! ✨
                                </GlowButton>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
