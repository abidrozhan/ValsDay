"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAudio, ALL_SONGS } from "@/components/AudioProvider";

export default function MusicPlayer() {
    const {
        isPlaying,
        currentSongIndex,
        playSong,
        togglePlay,
        themeAudioRef,
        enterMusicPage,
        leaveMusicPage,
    } = useAudio();

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const currentSong = ALL_SONGS[currentSongIndex];

    // Enter/leave music page mode
    useEffect(() => {
        enterMusicPage();
        return () => leaveMusicPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Track progress from the theme audio
    useEffect(() => {
        const audio = themeAudioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateProgress);
        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateProgress);
        };
    }, [themeAudioRef]);

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = themeAudioRef.current;
        if (!audio || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * duration;
    };

    const handleNext = () => {
        const nextIndex = (currentSongIndex + 1) % ALL_SONGS.length;
        playSong(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (currentSongIndex - 1 + ALL_SONGS.length) % ALL_SONGS.length;
        playSong(prevIndex);
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec.toString().padStart(2, "0")}`;
    };

    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <div style={{
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            position: "relative",
        }}>
            {/* Main Card */}
            <div style={{
                background: "rgba(15, 5, 25, 0.85)",
                backdropFilter: "blur(30px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "2.5rem",
                padding: "2.5rem 2rem 2rem",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 80px rgba(219,39,119,0.08)",
                position: "relative",
                overflow: "hidden",
            }}>
                {/* Ambient glow */}
                <div style={{
                    position: "absolute",
                    top: "-60px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "300px",
                    height: "200px",
                    background: "radial-gradient(circle, rgba(219,39,119,0.15) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                {/* ============ VINYL RECORD ============ */}
                <div style={{ position: "relative", width: "240px", height: "240px", margin: "0 auto 2rem" }}>
                    {/* Vinyl Disc */}
                    <motion.div
                        style={{
                            width: "240px",
                            height: "240px",
                            borderRadius: "50%",
                            background: `
                                radial-gradient(circle at 50% 50%, #1a1a1a 0%, #111 20%, #222 21%, #111 22%, #222 35%, #111 36%, #222 48%, #111 49%, #1a1a1a 50%, #333 51%, #1a1a1a 52%, #222 60%, #111 61%, #222 70%, #111 71%, #222 80%, #111 81%, #1a1a1a 90%, #0d0d0d 100%)
                            `,
                            boxShadow: "0 8px 30px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    >
                        {/* Vinyl shine */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
                            pointerEvents: "none",
                        }} />

                        {/* Center label */}
                        <div style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
                            border: "3px solid rgba(0,0,0,0.5)",
                            position: "relative",
                        }}>
                            <div style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                background: "#0a0a0a",
                                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                            }} />
                            <span style={{
                                position: "absolute",
                                bottom: "18px",
                                fontSize: "6px",
                                color: "rgba(255,255,255,0.6)",
                                letterSpacing: "2px",
                                textTransform: "uppercase",
                            }}>♫ FOR YOU</span>
                        </div>
                    </motion.div>

                    {/* Tone Arm */}
                    <motion.div
                        style={{
                            position: "absolute",
                            top: "-20px",
                            right: "-15px",
                            transformOrigin: "85% 15%",
                            zIndex: 10,
                            pointerEvents: "none",
                        }}
                        animate={{ rotate: isPlaying ? 22 : 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                        <svg width="90" height="110" viewBox="0 0 90 110">
                            <circle cx="75" cy="12" r="10" fill="#444" stroke="#555" strokeWidth="1" />
                            <circle cx="75" cy="12" r="5" fill="#333" />
                            <line x1="75" y1="18" x2="72" y2="30" stroke="#666" strokeWidth="4" strokeLinecap="round" />
                            <line x1="72" y1="30" x2="30" y2="85" stroke="#555" strokeWidth="3" strokeLinecap="round" />
                            <rect x="20" y="82" width="18" height="12" rx="2" fill="#444" transform="rotate(15, 29, 88)" />
                            <line x1="24" y1="95" x2="22" y2="100" stroke="#888" strokeWidth="1.5" strokeLinecap="round" transform="rotate(15, 23, 97)" />
                        </svg>
                    </motion.div>
                </div>

                {/* ============ SONG INFO ============ */}
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <motion.h2
                        key={currentSong.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontSize: "1.3rem",
                            fontWeight: 700,
                            color: "#fff",
                            marginBottom: "4px",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {currentSong.title}
                    </motion.h2>
                    <p style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.45)",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        fontWeight: 500,
                    }}>
                        {currentSong.artist}
                    </p>
                </div>

                {/* ============ PROGRESS BAR ============ */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <div
                        onClick={handleSeek}
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "6px",
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "3px",
                            cursor: "pointer",
                            marginBottom: "8px",
                        }}
                    >
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: `${progressPercent}%`,
                            background: "linear-gradient(90deg, #ec4899, #a855f7)",
                            borderRadius: "3px",
                            transition: "width 0.1s linear",
                        }} />
                        <div style={{
                            position: "absolute",
                            top: "50%",
                            transform: "translateY(-50%)",
                            left: `${progressPercent}%`,
                            width: "14px",
                            height: "14px",
                            background: "#fff",
                            borderRadius: "50%",
                            boxShadow: "0 0 8px rgba(236,72,153,0.5)",
                            marginLeft: "-7px",
                            opacity: duration > 0 ? 1 : 0,
                            transition: "opacity 0.2s",
                        }} />
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.65rem",
                        color: "rgba(255,255,255,0.35)",
                        fontWeight: 500,
                        letterSpacing: "1px",
                    }}>
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* ============ CONTROLS ============ */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2.5rem",
                }}>
                    <button
                        onClick={handlePrev}
                        style={{
                            background: "none", border: "none",
                            color: "rgba(255,255,255,0.5)", cursor: "pointer",
                            fontSize: "1.2rem", padding: "8px",
                            transition: "color 0.2s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.15)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.transform = "scale(1)"; }}
                    >⏮</button>

                    <motion.button
                        onClick={togglePlay}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        style={{
                            width: "64px", height: "64px", borderRadius: "50%",
                            background: "#fff", border: "none", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem", color: "#111",
                            boxShadow: "0 0 25px rgba(255,255,255,0.25), 0 4px 15px rgba(0,0,0,0.3)",
                        }}
                    >
                        {isPlaying ? "⏸" : "▶️"}
                    </motion.button>

                    <button
                        onClick={handleNext}
                        style={{
                            background: "none", border: "none",
                            color: "rgba(255,255,255,0.5)", cursor: "pointer",
                            fontSize: "1.2rem", padding: "8px",
                            transition: "color 0.2s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.15)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.transform = "scale(1)"; }}
                    >⏭</button>
                </div>
            </div>
        </div>
    );
}
