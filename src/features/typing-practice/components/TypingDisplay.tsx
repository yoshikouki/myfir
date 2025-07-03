"use client";

import { AnimatePresence, motion } from "framer-motion";

interface TypingDisplayProps {
  displayText: string;
  typedText: string;
  currentChar: string;
  currentIndex: number;
  inputText: string;
  isCompleted: boolean;
}

/**
 * タイピング中の文字表示エリア
 * ひらがな表示とローマ字入力の進捗を表示
 */
export function TypingDisplay({
  displayText,
  typedText,
  currentChar,
  currentIndex,
  inputText,
  isCompleted,
}: TypingDisplayProps) {
  return (
    <div className="mb-6 text-center">
      {/* ひらがな表示 */}
      <div className="mb-4 font-bold text-3xl text-gray-800">{displayText}</div>

      {/* ローマ字入力表示 */}
      <div className="font-mono text-2xl">
        <span className="text-green-600">{typedText}</span>
        <AnimatePresence mode="wait">
          {!isCompleted && (
            <motion.span
              key={currentIndex}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded bg-yellow-100 px-1 text-blue-600 underline"
            >
              {currentChar}
            </motion.span>
          )}
        </AnimatePresence>
        <span className="text-gray-400">{inputText.slice(currentIndex + 1)}</span>
      </div>
    </div>
  );
}
