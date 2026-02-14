"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import GlowButton from "@/components/GlowButton";

interface QuizWelcomeProps {
    onStart: () => void;
}

export default function QuizWelcome({ onStart }: QuizWelcomeProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const handleSubmit = () => {
        if (name.trim().toLowerCase() === "kayla saldrina") {
            setError("");
            onStart();
        } else {
            setError("hmm… if you're not the main character, please exit. 💅");
            setShake(true);
            setTimeout(() => setShake(false), 600);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="quiz-page">
            <motion.h1
                className="quiz-main-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                Quiz Time! 💝
            </motion.h1>

            <motion.p
                className="quiz-main-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                &ldquo;A tiny love test… with a guaranteed perfect score.&rdquo;
            </motion.p>

            <motion.div
                className={`quiz-welcome-card ${shake ? "shake" : ""}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
            >
                <span className="quiz-welcome-icon">💌</span>
                <h2>Welcome</h2>
                <p className="quiz-welcome-subtext">
                    This quiz is for someone very special.
                </p>

                <div className="quiz-input-group">
                    <input
                        type="text"
                        className={`quiz-input ${error ? "quiz-input-error" : ""}`}
                        placeholder="Enter your full name…"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError("");
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    {error && (
                        <motion.p
                            className="quiz-error-text"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.p>
                    )}
                </div>

                <GlowButton onClick={handleSubmit}>
                    Start Quiz ✨
                </GlowButton>
            </motion.div>
        </div>
    );
}
