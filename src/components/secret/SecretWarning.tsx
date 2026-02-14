"use client";

import React from "react";
import { motion } from "framer-motion";
import GlowButton from "@/components/GlowButton";

interface SecretWarningProps {
    onContinue: () => void;
}

export default function SecretWarning({ onContinue }: SecretWarningProps) {
    return (
        <div className="secret-warning-page">
            <motion.div
                className="secret-warning-card"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    className="secret-warning-icon"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    💻
                </motion.div>

                <h2 className="secret-warning-title">Before You Enter…</h2>

                <div className="secret-warning-content">
                    <div className="secret-warning-item">
                        <span className="secret-warning-emoji">📷</span>
                        <p>Fitur ini menggunakan <strong>kamera webcam</strong> untuk mendeteksi gerakan tangan.</p>
                    </div>
                    <div className="secret-warning-item">
                        <span className="secret-warning-emoji">💻</span>
                        <p>Disarankan menggunakan <strong>laptop/PC</strong> dengan kamera yang aktif.</p>
                    </div>
                    <div className="secret-warning-item">
                        <span className="secret-warning-emoji">🌟</span>
                        <p>Pastikan pencahayaan ruangan cukup agar tangan terdeteksi optimal.</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <GlowButton onClick={onContinue}>
                        I&apos;m Ready ✨
                    </GlowButton>
                </motion.div>
            </motion.div>
        </div>
    );
}
