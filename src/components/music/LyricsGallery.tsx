"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const LYRICS = [
    { id: 1, src: "/music/lyrics/1.jfif" },
    { id: 2, src: "/music/lyrics/2.jfif" },
    { id: 3, src: "/music/lyrics/3.jfif" },
    { id: 4, src: "/music/lyrics/4.jfif" },
    { id: 5, src: "/music/lyrics/5.jfif" },
    { id: 6, src: "/music/lyrics/6.jfif" },
    { id: 7, src: "/music/lyrics/7.jpeg" },
    { id: 8, src: "/music/lyrics/8.jfif" },
    { id: 9, src: "/music/lyrics/9.jfif" },
    { id: 10, src: "/music/lyrics/10.jfif" },
    { id: 11, src: "/music/lyrics/11.jpeg" },
    { id: 12, src: "/music/lyrics/12.jfif" },
];

// Abstract grid layout — each item gets a unique span config
// Using gridRow/gridColumn spans for variety while keeping it tidy
const GRID_ITEMS: { colSpan: number; rowSpan: number }[] = [
    { colSpan: 1, rowSpan: 2 },  // 1 - tall
    { colSpan: 1, rowSpan: 1 },  // 2
    { colSpan: 1, rowSpan: 1 },  // 3
    { colSpan: 1, rowSpan: 1 },  // 4
    { colSpan: 1, rowSpan: 2 },  // 5 - tall
    { colSpan: 1, rowSpan: 1 },  // 6
    { colSpan: 1, rowSpan: 1 },  // 7
    { colSpan: 1, rowSpan: 1 },  // 8
    { colSpan: 1, rowSpan: 2 },  // 9 - tall
    { colSpan: 1, rowSpan: 1 },  // 10
    { colSpan: 1, rowSpan: 1 },  // 11
    { colSpan: 1, rowSpan: 1 },  // 12
];

export default function LyricsGallery() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    return (
        <div style={{ width: "100%", paddingTop: "1rem" }}>
            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    display: "block",
                    margin: "0 auto 1.5rem",
                    padding: "14px 36px",
                    background: isOpen
                        ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
                        : "rgba(255,255,255,0.05)",
                    border: isOpen ? "none" : "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "2rem",
                    color: "#fff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "3px",
                    textTransform: "uppercase" as const,
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.3s",
                }}
            >
                {isOpen ? "✕ Close" : "♡ Lyrics For You"}
            </motion.button>

            {/* Abstract Grid Gallery */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gridAutoRows: "120px",
                        gap: "6px",
                        maxWidth: "460px",
                        margin: "0 auto",
                        padding: "0 1rem",
                    }}>
                        {LYRICS.map((item, idx) => {
                            const layout = GRID_ITEMS[idx];
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                                    onClick={() => setSelectedIdx(idx)}
                                    style={{
                                        gridColumn: `span ${layout.colSpan}`,
                                        gridRow: `span ${layout.rowSpan}`,
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        transition: "transform 0.3s, border-color 0.3s",
                                        position: "relative",
                                    }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <img
                                        src={item.src}
                                        alt={`Lyric ${item.id}`}
                                        loading="lazy"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            background: "#111",
                                        }}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIdx !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedIdx(null)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 100,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(0,0,0,0.92)",
                            backdropFilter: "blur(20px)",
                            cursor: "zoom-out",
                            padding: "2rem",
                        }}
                    >
                        <motion.img
                            key={selectedIdx}
                            src={LYRICS[selectedIdx].src}
                            alt={`Lyric ${LYRICS[selectedIdx].id}`}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            style={{
                                maxWidth: "90vw",
                                maxHeight: "85vh",
                                borderRadius: "16px",
                                objectFit: "contain",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                            }}
                        />
                        {/* Prev */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIdx((selectedIdx - 1 + LYRICS.length) % LYRICS.length); }}
                            style={{
                                position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)",
                                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "50%", width: "48px", height: "48px", color: "#fff",
                                fontSize: "1.2rem", cursor: "pointer", backdropFilter: "blur(10px)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >‹</button>
                        {/* Next */}
                        <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIdx((selectedIdx + 1) % LYRICS.length); }}
                            style={{
                                position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)",
                                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "50%", width: "48px", height: "48px", color: "#fff",
                                fontSize: "1.2rem", cursor: "pointer", backdropFilter: "blur(10px)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >›</button>
                        <span style={{
                            position: "absolute", top: "1.5rem", right: "1.5rem",
                            color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", letterSpacing: "2px",
                        }}>✕ CLOSE</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
