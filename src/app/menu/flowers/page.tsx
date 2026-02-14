"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import FlowersStory from "@/components/flowers/FlowersStory";
import FlowerVase from "@/components/flowers/FlowerVase";
import { FlowerData } from "@/lib/flowersData";
import { useAudio } from "@/components/AudioProvider";

type FlowersStage = "story" | "vase";

export default function FlowersPage() {
    const [stage, setStage] = useState<FlowersStage>("story");
    const [collectedFlowers, setCollectedFlowers] = useState<FlowerData[]>([]);
    const { enterFlowersPage, leaveFlowersPage } = useAudio();

    // Switch to flowers track on mount, restore theme on unmount
    useEffect(() => {
        enterFlowersPage();
        return () => leaveFlowersPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleStoryComplete = (flowers: FlowerData[]) => {
        setCollectedFlowers(flowers);
        setStage("vase");
    };

    return (
        <>
            <FloatingHearts count={10} />

            {/* Back Button */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                padding: "1.5rem",
                zIndex: 50,
                pointerEvents: "none",
            }}>
                <Link
                    href="/menu"
                    style={{
                        pointerEvents: "auto",
                        color: "rgba(255,255,255,0.5)",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        background: "rgba(0,0,0,0.3)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.2s",
                    }}
                >
                    ← Back
                </Link>
            </div>

            <AnimatePresence mode="wait">
                {stage === "story" && (
                    <motion.div
                        key="story"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FlowersStory onComplete={handleStoryComplete} />
                    </motion.div>
                )}

                {stage === "vase" && (
                    <motion.div
                        key="vase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FlowerVase flowers={collectedFlowers} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
