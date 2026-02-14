"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import SecretWarning from "@/components/secret/SecretWarning";
import PinLock from "@/components/secret/PinLock";
import SecretMessage from "@/components/secret/SecretMessage";
import { HandData } from "@/components/secret/types";

const ParticleScene = dynamic(
    () => import("@/components/secret/ParticleScene"),
    { ssr: false }
);
const HandTracker = dynamic(
    () => import("@/components/secret/HandTracker"),
    { ssr: false }
);

type SecretStage = "warning" | "pin" | "scene";

const COLOR_PRESETS = [
    { name: "Cherry Blossom", color: "#ffb7c5" },
    { name: "Royal Purple", color: "#a855f7" },
    { name: "Ocean Blue", color: "#3b82f6" },
    { name: "Emerald", color: "#10b981" },
    { name: "Sunset Gold", color: "#f59e0b" },
    { name: "Rose Red", color: "#ef4444" },
    { name: "Ice White", color: "#e2e8f0" },
    { name: "Neon Pink", color: "#ec4899" },
];

export default function SecretPage() {
    const [stage, setStage] = useState<SecretStage>("warning");
    const [handData, setHandData] = useState<HandData>({
        x: 0.5, y: 0.5, z: 0.5, gesture: "idle",
        fingerCount: 0, handCount: 0, velocity: 0,
    });
    const [showMessage, setShowMessage] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [patternId, setPatternId] = useState("heart");
    const [particleColor, setParticleColor] = useState("#ffb7c5");
    const [intensity, setIntensity] = useState(0.5);
    const [panelOpen, setPanelOpen] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const sceneRef = useRef<HTMLDivElement>(null);

    const handleHandUpdate = useCallback((data: HandData) => {
        setHandData(data);
        setShowMessage(data.gesture === "both_hands");
    }, []);

    const handleUnlock = useCallback(() => {
        setTimeout(() => {
            setStage("scene");
            setCameraReady(true);
        }, 400);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        if (!sceneRef.current) return;
        try {
            if (!document.fullscreenElement) {
                await sceneRef.current.requestFullscreen();
                setIsFullscreen(true);
            } else {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        } catch (err) {
            console.warn("Fullscreen failed:", err);
        }
    }, []);

    // Listen for fullscreen changes
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        return () => document.removeEventListener("fullscreenchange", handler);
    }, []);

    return (
        <>
            <FloatingHearts count={6} />

            {/* Back Button - Always visible */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{
                    position: "fixed",
                    top: "1.5rem",
                    left: "1.5rem",
                    zIndex: 80,
                }}
            >
                <Link
                    href="/menu"
                    style={{
                        color: "rgba(255,255,255,0.6)",
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
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.2s",
                    }}
                >
                    ← Back
                </Link>
            </motion.div>

            <AnimatePresence mode="wait">
                {stage === "warning" && (
                    <motion.div
                        key="warning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <SecretWarning onContinue={() => setStage("pin")} />
                    </motion.div>
                )}

                {stage === "pin" && (
                    <motion.div
                        key="pin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <PinLock onUnlock={handleUnlock} />
                    </motion.div>
                )}

                {stage === "scene" && (
                    <motion.div
                        key="scene"
                        ref={sceneRef}
                        className="secret-scene-wrapper"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* 3D Particles */}
                        <ParticleScene
                            handData={handData}
                            patternId={patternId}
                            particleColor={particleColor}
                            intensity={intensity}
                        />

                        {/* Hand Tracker */}
                        <HandTracker
                            onHandUpdate={handleHandUpdate}
                            active={cameraReady}
                        />

                        {/* Secret Message Overlay */}
                        <SecretMessage visible={showMessage} />

                        {/* ===== UI PANEL ===== */}
                        <motion.div
                            className={`secret-panel ${panelOpen ? "open" : "closed"}`}
                            initial={{ x: 300 }}
                            animate={{ x: panelOpen ? 0 : 260 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {/* Toggle Button */}
                            <button
                                className="panel-toggle"
                                onClick={() => setPanelOpen(!panelOpen)}
                            >
                                {panelOpen ? "›" : "‹"}
                            </button>

                            <div className="panel-content">

                                {/* Color Picker */}
                                <div className="panel-section">
                                    <h3 className="panel-label">Color</h3>
                                    <div className="color-presets">
                                        {COLOR_PRESETS.map((c) => (
                                            <button
                                                key={c.color}
                                                className={`color-swatch ${particleColor === c.color ? "active" : ""}`}
                                                style={{ background: c.color }}
                                                onClick={() => setParticleColor(c.color)}
                                                title={c.name}
                                            />
                                        ))}
                                    </div>
                                    <div className="custom-color-row">
                                        <input
                                            type="color"
                                            value={particleColor}
                                            onChange={(e) => setParticleColor(e.target.value)}
                                            className="color-input"
                                        />
                                        <span className="color-hex">{particleColor}</span>
                                    </div>
                                </div>

                                {/* Intensity Slider */}
                                <div className="panel-section">
                                    <h3 className="panel-label">Speed</h3>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={intensity}
                                        onChange={(e) => setIntensity(parseFloat(e.target.value))}
                                        className="intensity-slider"
                                    />
                                </div>

                                {/* Fullscreen */}
                                <div className="panel-section">
                                    <button
                                        className="fullscreen-btn"
                                        onClick={toggleFullscreen}
                                    >
                                        {isFullscreen ? "⊡ Exit Fullscreen" : "⊞ Fullscreen"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
