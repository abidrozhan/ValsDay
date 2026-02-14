"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SecretMessageProps {
    visible: boolean;
}

export default function SecretMessage({ visible }: SecretMessageProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="secret-message-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="secret-message-card"
                        initial={{ scale: 0.8, y: 30 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 30 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <motion.p
                            className="secret-message-line"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            when both of your hands are here…
                        </motion.p>
                        <motion.p
                            className="secret-message-line"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            it feels like your whole heart is too.
                        </motion.p>
                        <motion.p
                            className="secret-message-line"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3 }}
                        >
                            and that&apos;s all I ever needed.
                        </motion.p>
                        <motion.p
                            className="secret-message-line secret-message-last"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8 }}
                        >
                            i miss you so bad kay.
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
