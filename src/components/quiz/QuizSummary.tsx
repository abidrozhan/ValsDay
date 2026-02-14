"use client";

import React from "react";
import { motion } from "framer-motion";
import { QuizAnswer } from "@/lib/quizData";
import GlowButton from "@/components/GlowButton";

interface QuizSummaryProps {
    answers: QuizAnswer[];
    onFindMatch: () => void;
}

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function QuizSummary({ answers, onFindMatch }: QuizSummaryProps) {
    return (
        <div className="quiz-page">
            <motion.h1
                className="quiz-main-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                Your Answers 💕
            </motion.h1>

            <motion.p
                className="quiz-main-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Here&apos;s a little peek at what you shared
            </motion.p>

            <motion.div
                className="quiz-summary-list"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {answers.map((a, i) => (
                    <motion.div
                        key={a.questionId}
                        className="quiz-summary-card"
                        variants={cardVariants}
                    >
                        <span className="quiz-summary-number">Q{i + 1}</span>
                        <p className="quiz-summary-question">{a.question}</p>
                        <p className="quiz-summary-answer">
                            {a.selectedOption && (
                                <span className="quiz-summary-option">[{a.selectedOption}] </span>
                            )}
                            {a.answer}
                        </p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                style={{ marginTop: "2rem" }}
            >
                <GlowButton onClick={onFindMatch}>
                    Find My Perfect Match 💘
                </GlowButton>
            </motion.div>
        </div>
    );
}
