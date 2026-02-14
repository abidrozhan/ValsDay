"use client";

import React, { useState, useEffect } from "react";

const HEART_CHARS = ["♥", "❤", "💕", "💗", "💖", "♡"];
const HEART_COLORS = [
    "rgba(255, 143, 175, 0.6)",
    "rgba(255, 179, 198, 0.5)",
    "rgba(224, 88, 133, 0.4)",
    "rgba(255, 45, 123, 0.3)",
    "rgba(232, 213, 245, 0.5)",
    "rgba(255, 214, 224, 0.6)",
];

interface FloatingHeartsProps {
    count?: number;
}

interface HeartItem {
    id: number;
    char: string;
    left: string;
    size: string;
    color: string;
    duration: string;
    delay: string;
}

export default function FloatingHearts({ count = 18 }: FloatingHeartsProps) {
    const [hearts, setHearts] = useState<HeartItem[]>([]);

    useEffect(() => {
        setHearts(
            Array.from({ length: count }, (_, i) => ({
                id: i,
                char: HEART_CHARS[i % HEART_CHARS.length],
                left: `${Math.random() * 100}%`,
                size: `${14 + Math.random() * 22}px`,
                color: HEART_COLORS[i % HEART_COLORS.length],
                duration: `${8 + Math.random() * 14}s`,
                delay: `${Math.random() * 10}s`,
            }))
        );
    }, [count]);

    if (hearts.length === 0) return null;

    return (
        <div className="floating-hearts-container">
            {hearts.map((heart) => (
                <span
                    key={heart.id}
                    className="floating-heart"
                    style={{
                        left: heart.left,
                        fontSize: heart.size,
                        color: heart.color,
                        animationDuration: heart.duration,
                        animationDelay: heart.delay,
                    }}
                >
                    {heart.char}
                </span>
            ))}
        </div>
    );
}

