"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface StreamingTextIndicatorProps {
    isVisible: boolean;
}

export function StreamingTextIndicator({ isVisible }: StreamingTextIndicatorProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-1 h-5 ml-0.5 mt-1"
        >
            <motion.span
                className={cn(
                    "block w-2.5 h-2.5 rounded-sm bg-blue-500/80 dark:bg-blue-400/80",
                    "shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                )}
                animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
    );
} 