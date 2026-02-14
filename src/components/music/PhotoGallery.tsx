"use client";

import { motion } from "framer-motion";

const PHOTOS = [
    { id: 1, src: "/music/galeri/g1.jpeg", alt: "Kayla 1" },
    { id: 2, src: "/music/galeri/g2.jpeg", alt: "Kayla 2" },
    { id: 3, src: "/music/galeri/g3.jpeg", alt: "Kayla 3" },
    { id: 4, src: "/music/galeri/g4.jpeg", alt: "Kayla 4" },
    { id: 5, src: "/music/galeri/g5.jpeg", alt: "Kayla 5" },
    { id: 6, src: "/music/galeri/g6.jpeg", alt: "Kayla 6" },
];

export default function PhotoGallery() {
    const cardWidth = 236; // 220px card + 16px gap
    const totalWidth = PHOTOS.length * cardWidth;

    return (
        <div style={{ width: "100%", paddingTop: "1rem", paddingBottom: "1rem" }}>
            {/* Section Title */}
            <h3 style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "4px",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
            }}>
                ✦ KAYLA SALDRINA ✦
            </h3>

            {/* Centered marquee container */}
            <div style={{
                maxWidth: "620px",
                margin: "0 auto",
                overflow: "hidden",
                maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}>
                <motion.div
                    style={{
                        display: "flex",
                        gap: "16px",
                        width: "fit-content",
                    }}
                    animate={{ x: [0, -totalWidth] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30, // Slower scroll
                        repeatType: "loop",
                    }}
                >
                    {[...PHOTOS, ...PHOTOS, ...PHOTOS].map((photo, idx) => (
                        <div
                            key={`${photo.id}-${idx}`}
                            style={{
                                position: "relative",
                                width: "220px",
                                height: "300px",
                                flexShrink: 0,
                                borderRadius: "16px",
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.08)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                                transition: "transform 0.3s, border-color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "rgba(236,72,153,0.5)";
                                e.currentTarget.style.transform = "scale(1.03)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                loading="lazy"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
