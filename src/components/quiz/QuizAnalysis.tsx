"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GlowButton from "@/components/GlowButton";

interface QuizAnalysisProps {
    onReveal: () => void;
}

const SCAN_MESSAGES = [
    "Scanning potential matches worldwide…",
    "Analyzing compatibility rate…",
    "Calculating emotional alignment…",
    "Cross-referencing love frequencies…",
    "Evaluating heart-sync levels…",
];

export default function QuizAnalysis({ onReveal }: QuizAnalysisProps) {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [messageIndex, setMessageIndex] = useState(0);
    const [done, setDone] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Cycle through random numbers
        intervalRef.current = setInterval(() => {
            setCurrentNumber(Math.floor(Math.random() * 7_000_000_000));
        }, 50);

        // Cycle through messages
        const msgInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % SCAN_MESSAGES.length);
        }, 1500);

        // Stop after 5 seconds
        const stopTimer = setTimeout(() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            clearInterval(msgInterval);
            setCurrentNumber(1);
            setDone(true);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            clearInterval(msgInterval);
            clearTimeout(stopTimer);
        };
    }, []);

    const formatNumber = (n: number) => {
        return n.toLocaleString("en-US");
    };

    return (
        <div className="quiz-page">
            <motion.div
                className="quiz-analysis-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {!done && (
                    <>
                        <motion.div
                            className="quiz-analysis-icon"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            💫
                        </motion.div>

                        <p className="quiz-analysis-message">
                            {SCAN_MESSAGES[messageIndex]}
                        </p>

                        <div className="quiz-analysis-number">
                            {formatNumber(currentNumber)}
                        </div>

                        <p className="quiz-analysis-label">potential matches scanned</p>
                    </>
                )}

                {done && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="quiz-analysis-result"
                    >
                        <span className="quiz-analysis-found-icon">💖</span>
                        <h2 className="quiz-analysis-found-number">1</h2>
                        <p className="quiz-analysis-found-text">Match Found</p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                        >
                            <GlowButton onClick={onReveal}>
                                Reveal Your Match 💕
                            </GlowButton>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
