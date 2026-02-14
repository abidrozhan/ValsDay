"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PinLockProps {
    onUnlock: () => void;
}

const CORRECT_PIN = "230823";

export default function PinLock({ onUnlock }: PinLockProps) {
    const [digits, setDigits] = useState<string[]>([]);
    const [shake, setShake] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDigit = useCallback((digit: string) => {
        if (success || digits.length >= 6) return;

        const newDigits = [...digits, digit];
        setDigits(newDigits);

        if (newDigits.length === 6) {
            const code = newDigits.join("");
            if (code === CORRECT_PIN) {
                setSuccess(true);
                setTimeout(onUnlock, 800);
            } else {
                setError(true);
                setShake(true);
                setTimeout(() => {
                    setDigits([]);
                    setShake(false);
                    setError(false);
                }, 600);
            }
        }
    }, [digits, success, onUnlock]);

    const handleDelete = useCallback(() => {
        if (digits.length > 0) {
            setDigits(digits.slice(0, -1));
        }
    }, [digits]);

    return (
        <div className="pin-lock-page">
            <motion.div
                className="pin-lock-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                {/* Lock icon */}
                <motion.div
                    className="pin-lock-icon"
                    animate={success ? { scale: [1, 1.3, 0], rotate: [0, 0, 180] } : {}}
                    transition={{ duration: 0.6 }}
                >
                    {success ? "🔓" : "🔒"}
                </motion.div>

                <h2 className="pin-lock-title">Enter Secret Code</h2>
                <p className="pin-lock-subtitle">Masukkan 6 digit kode rahasia</p>

                {/* PIN display */}
                <motion.div
                    className="pin-dots"
                    animate={shake ? { x: [0, -12, 12, -12, 12, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={`pin-dot ${i < digits.length ? "pin-dot-filled" : ""} ${error ? "pin-dot-error" : ""} ${success ? "pin-dot-success" : ""}`}
                            animate={i < digits.length ? { scale: [0.5, 1.2, 1] } : {}}
                            transition={{ duration: 0.2 }}
                        />
                    ))}
                </motion.div>

                {/* Error text */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            className="pin-error-text"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            Kode salah, coba lagi 💔
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Numpad */}
                <div className="pin-numpad">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((key, i) => (
                        <motion.button
                            key={i}
                            className={`pin-key ${key === "" ? "pin-key-empty" : ""} ${key === "⌫" ? "pin-key-delete" : ""}`}
                            whileTap={key ? { scale: 0.9 } : {}}
                            whileHover={key ? { scale: 1.05 } : {}}
                            onClick={() => {
                                if (key === "⌫") handleDelete();
                                else if (key) handleDigit(key);
                            }}
                            disabled={!key || success}
                        >
                            {key}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
