"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestionData, QuizAnswer } from "@/lib/quizData";
import GlowButton from "@/components/GlowButton";

interface QuizQuestionProps {
    question: QuizQuestionData;
    currentIndex: number;
    totalQuestions: number;
    onAnswer: (answer: QuizAnswer) => void;
}

const slideVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
};

export default function QuizQuestion({
    question,
    currentIndex,
    totalQuestions,
    onAnswer,
}: QuizQuestionProps) {
    const [essayValue, setEssayValue] = useState("");
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [essayForOption, setEssayForOption] = useState("");
    const [sliderValue, setSliderValue] = useState(5);
    const [error, setError] = useState("");

    const handleSubmit = () => {
        let finalAnswer = "";
        let optionLabel = "";

        if (question.type === "essay") {
            if (!essayValue.trim()) {
                setError("Please write something lovely… ✍️");
                return;
            }
            finalAnswer = essayValue.trim();
        } else if (question.type === "multiple-choice") {
            if (!selectedOption) {
                setError("Pick one, darling! 💕");
                return;
            }
            const opt = question.options?.find((o) => o.value === selectedOption);
            optionLabel = opt?.label || "";

            if (opt?.hasEssay) {
                if (!essayForOption.trim()) {
                    setError("You picked 'write it yourself' — so write it! ✍️");
                    return;
                }
                // Check Q5 reject pattern
                if (question.rejectPattern && question.rejectPattern.test(essayForOption)) {
                    setError(question.rejectMessage || "Try again!");
                    setEssayForOption("");
                    return;
                }
                finalAnswer = essayForOption.trim();
            } else {
                finalAnswer = selectedOption;
            }
        } else if (question.type === "slider") {
            const label =
                question.sliderLabels?.[sliderValue] || String(sliderValue);
            finalAnswer = `${sliderValue}/10 — ${label}`;
        }

        setError("");
        onAnswer({
            questionId: question.id,
            question: question.question,
            answer: finalAnswer,
            selectedOption: optionLabel || undefined,
        });
    };

    const selectedOpt = question.options?.find((o) => o.value === selectedOption);
    const showEssayForOption = selectedOpt?.hasEssay;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={question.id}
                className="quiz-question-container"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {/* Progress */}
                <div className="quiz-progress">
                    <div className="quiz-progress-bar">
                        <motion.div
                            className="quiz-progress-fill"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                            }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <span className="quiz-progress-text">
                        {currentIndex + 1} / {totalQuestions}
                    </span>
                </div>

                {/* Question Card */}
                <div className="quiz-question-card">
                    <span className="quiz-question-number">Q{question.id}</span>
                    <h2 className="quiz-question-text">{question.question}</h2>

                    {/* ESSAY */}
                    {question.type === "essay" && (
                        <textarea
                            className="quiz-textarea"
                            placeholder="Type your answer here…"
                            value={essayValue}
                            onChange={(e) => {
                                setEssayValue(e.target.value);
                                if (error) setError("");
                            }}
                            rows={3}
                        />
                    )}

                    {/* MULTIPLE CHOICE */}
                    {question.type === "multiple-choice" && (
                        <div className="quiz-options">
                            {question.options?.map((opt) => (
                                <motion.button
                                    key={opt.value}
                                    className={`quiz-option ${selectedOption === opt.value ? "quiz-option-selected" : ""}`}
                                    onClick={() => {
                                        setSelectedOption(opt.value);
                                        setEssayForOption("");
                                        if (error) setError("");
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="quiz-option-label">{opt.label}</span>
                                    <span className="quiz-option-text">{opt.value}</span>
                                </motion.button>
                            ))}
                        </div>
                    )}

                    {/* ESSAY for selected option (Q3 F, Q5 F) */}
                    {showEssayForOption && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                        >
                            <textarea
                                className="quiz-textarea quiz-textarea-sub"
                                placeholder="Write it yourself…"
                                value={essayForOption}
                                onChange={(e) => {
                                    setEssayForOption(e.target.value);
                                    if (error) setError("");
                                }}
                                rows={2}
                            />
                        </motion.div>
                    )}

                    {/* SLIDER */}
                    {question.type === "slider" && (
                        <div className="quiz-slider-container">
                            <input
                                type="range"
                                className="quiz-slider"
                                min={question.sliderMin || 1}
                                max={question.sliderMax || 10}
                                value={sliderValue}
                                onChange={(e) => setSliderValue(Number(e.target.value))}
                            />
                            <div className="quiz-slider-info">
                                <span className="quiz-slider-value">{sliderValue}</span>
                                <span className="quiz-slider-label">
                                    {question.sliderLabels?.[sliderValue] || ""}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <motion.p
                            className="quiz-error-text"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <div className="quiz-actions">
                        <GlowButton onClick={handleSubmit}>
                            {currentIndex === totalQuestions - 1 ? "Finish ✨" : "Next →"}
                        </GlowButton>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
