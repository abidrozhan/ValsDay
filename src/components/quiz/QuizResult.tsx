"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import GlowButton from "@/components/GlowButton";

export default function QuizResult() {
    const router = useRouter();

    return (
        <div className="quiz-page">
            <motion.div
                className="quiz-result-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.span
                    className="quiz-result-emoji"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                    💕
                </motion.span>

                <motion.div
                    className="quiz-result-percentage"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    100%
                </motion.div>

                <motion.h1
                    className="quiz-result-title"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    You&apos;re a 100% match for Abid Rozhan.
                </motion.h1>

                <motion.p
                    className="quiz-result-subtext"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    No notes. Absolute perfection. 💖
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.5 }}
                >
                    <GlowButton
                        variant="secondary"
                        onClick={() => router.push("/menu")}
                    >
                        ← Back
                    </GlowButton>
                </motion.div>
            </motion.div>
        </div>
    );
}
