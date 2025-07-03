"use client";

import { motion } from "framer-motion";

interface TypingProgressProps {
  progress: number;
}

/**
 * タイピング進捗バー
 */
export function TypingProgress({ progress }: TypingProgressProps) {
  return (
    <div className="mb-6 rounded-full bg-gray-200 p-1">
      <motion.div
        className="h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
