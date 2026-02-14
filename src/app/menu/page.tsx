"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import FloatingHearts from "@/components/FloatingHearts";

const menuItems = [
    {
        title: "Quiz Match",
        icon: "🍀",
        description: "Want to try your luck?",
        path: "/menu/quiz",
        color: "rgba(255, 45, 123, 0.08)",
    },
    {
        title: "Flowers",
        icon: "🌹",
        description: "A garden inspired by you",
        path: "/menu/flowers",
        color: "rgba(255, 143, 175, 0.08)",
    },
    {
        title: "Music",
        icon: "🎶",
        description: "Songs that remind me of us",
        path: "/menu/music",
        color: "rgba(232, 213, 245, 0.15)",
    },
    {
        title: "Secret",
        icon: "💌",
        description: "Something special awaits…",
        path: "/menu/secret",
        color: "rgba(212, 165, 116, 0.08)",
    },
];

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.3,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 },
};

export default function MenuPage() {
    const router = useRouter();

    return (
        <>
            <FloatingHearts count={12} />

            <div className="menu-page">
                <motion.h1
                    className="menu-title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    Happy Val&apos;s Day, Kayla Saldrina 💕
                </motion.h1>

                <motion.p
                    className="menu-subtitle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    Choose what you&apos;d like to explore
                </motion.p>

                <motion.div
                    className="menu-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {menuItems.map((item) => (
                        <motion.div
                            key={item.title}
                            className="menu-card"
                            variants={cardVariants}
                            whileHover={{ scale: 1.06, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            onClick={() => router.push(item.path)}
                            style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.65) 0%, ${item.color} 100%)` }}
                        >
                            <span className="menu-card-icon">{item.icon}</span>
                            <span className="menu-card-title">{item.title}</span>
                            <span className="menu-card-desc">{item.description}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </>
    );
}
