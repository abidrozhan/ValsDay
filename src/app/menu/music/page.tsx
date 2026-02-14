"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FloatingHearts from "@/components/FloatingHearts";
import MusicPlayer from "@/components/music/MusicPlayer";
import LyricsGallery from "@/components/music/LyricsGallery";
import PhotoGallery from "@/components/music/PhotoGallery";

export default function MusicPage() {
    return (
        <>
            <FloatingHearts count={12} />
            <div style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #0a0a0a 0%, #120818 40%, #0a0a0a 100%)",
                color: "#fff",
                overflowY: "auto",
                overflowX: "hidden",
            }}>
                {/* Back Button */}
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
                            color: "rgba(255,255,255,0.5)",
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
                            border: "1px solid rgba(255,255,255,0.08)",
                            transition: "all 0.2s",
                        }}
                    >
                        ← Back
                    </Link>
                </div>

                <main style={{
                    maxWidth: "700px",
                    margin: "0 auto",
                    padding: "100px 1.5rem 3rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                }}>
                    {/* Title */}
                    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #ec4899, #a855f7, #ec4899)",
                                backgroundSize: "200% 200%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                marginBottom: "0.5rem",
                                lineHeight: 1.2,
                            }}
                        >
                            Galery Music
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                color: "rgba(255,255,255,0.45)",
                                fontSize: "0.9rem",
                                maxWidth: "400px",
                                margin: "0 auto",
                                lineHeight: 1.6,
                            }}
                        >
                            Songs that remind me of every beautiful moment with you 💕
                        </motion.p>
                    </div>

                    {/* Music Player */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        style={{ width: "100%" }}
                    >
                        <MusicPlayer />
                    </motion.div>

                    {/* Divider */}
                    <div style={{
                        width: "60px",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        margin: "1rem 0",
                    }} />

                    {/* Photo Gallery (AUTO-SCROLL) — above lyrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        style={{ width: "100%" }}
                    >
                        <PhotoGallery />
                    </motion.div>

                    {/* Divider */}
                    <div style={{
                        width: "60px",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        margin: "0.5rem 0",
                    }} />

                    {/* Lyrics Gallery (GRID) — below gallery */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{ width: "100%" }}
                    >
                        <LyricsGallery />
                    </motion.div>

                    {/* Divider */}
                    <div style={{
                        width: "60px",
                        height: "1px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        margin: "0.5rem 0",
                    }} />

                    {/* Spotify Playlist Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        style={{ width: "100%", textAlign: "center", paddingBottom: "2rem" }}
                    >
                        <p style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: "0.8rem",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            marginBottom: "1rem",
                            fontWeight: 500,
                        }}>
                            Special playlist for you
                        </p>
                        <a
                            href="https://open.spotify.com/playlist/5k376D8S9iKxyT2X7Q0EdY?si=kwsBzaLQSFi7FKC2XVz_Jw&pi=dAWunz4lQtiYD"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "16px 40px",
                                background: "linear-gradient(135deg, #1DB954, #1ed760)",
                                borderRadius: "50px",
                                color: "#000",
                                textDecoration: "none",
                                fontSize: "1rem",
                                fontWeight: 700,
                                letterSpacing: "0.5px",
                                boxShadow: "0 4px 20px rgba(29,185,84,0.4), 0 0 40px rgba(29,185,84,0.15)",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0 6px 30px rgba(29,185,84,0.5), 0 0 60px rgba(29,185,84,0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(29,185,84,0.4), 0 0 40px rgba(29,185,84,0.15)";
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            Open Spotify Playlist
                        </a>
                    </motion.div>

                </main>
            </div>
        </>
    );
}
