"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    className?: string;
}

export default function GlowButton({
    children,
    onClick,
    variant = "primary",
    className = "",
}: GlowButtonProps) {
    return (
        <motion.button
            className={`glow-button ${variant === "secondary" ? "glow-button-secondary" : ""} ${className}`}
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.button>
    );
}
