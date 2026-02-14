"use client";


import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import QuizWelcome from "@/components/quiz/QuizWelcome";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizSummary from "@/components/quiz/QuizSummary";
import QuizAnalysis from "@/components/quiz/QuizAnalysis";
import QuizResult from "@/components/quiz/QuizResult";
import { QUIZ_QUESTIONS, QuizAnswer } from "@/lib/quizData";

type QuizStage = "welcome" | "questions" | "summary" | "analysis" | "result";

export default function QuizPage() {
    const [stage, setStage] = useState<QuizStage>("welcome");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);

    const handleStart = () => {
        setStage("questions");
    };

    const handleAnswer = (answer: QuizAnswer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            // All questions answered — send email
            sendAnswers(newAnswers);
            setStage("summary");
        }
    };

    const sendAnswers = async (allAnswers: QuizAnswer[]) => {
        try {
            await fetch("/api/send-quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: allAnswers }),
            });
        } catch (err) {
            console.error("Failed to send quiz answers:", err);
        }
    };

    const handleFindMatch = () => {
        setStage("analysis");
    };

    const handleReveal = () => {
        setStage("result");
    };

    return (
        <>
            <FloatingHearts count={14} />

            {/* Back Button - Heart Red */}
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
                        color: "rgba(239,68,68,0.8)",
                        textDecoration: "none",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        background: "rgba(239,68,68,0.08)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        transition: "all 0.2s",
                    }}
                >
                    ← Back
                </Link>
            </div>

            <AnimatePresence mode="wait">
                {stage === "welcome" && (
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <QuizWelcome onStart={handleStart} />
                    </motion.div>
                )}

                {stage === "questions" && (
                    <motion.div
                        key={`question-${currentQuestion}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <QuizQuestion
                            question={QUIZ_QUESTIONS[currentQuestion]}
                            currentIndex={currentQuestion}
                            totalQuestions={QUIZ_QUESTIONS.length}
                            onAnswer={handleAnswer}
                        />
                    </motion.div>
                )}

                {stage === "summary" && (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <QuizSummary answers={answers} onFindMatch={handleFindMatch} />
                    </motion.div>
                )}

                {stage === "analysis" && (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <QuizAnalysis onReveal={handleReveal} />
                    </motion.div>
                )}

                {stage === "result" && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <QuizResult />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
