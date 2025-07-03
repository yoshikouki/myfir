"use client";

import { motion } from "framer-motion";

interface TypingHintsProps {
  handHighlight: "left" | "right" | "both" | null;
}

/**
 * タイピングのヒント表示
 */
export function TypingHints({ handHighlight }: TypingHintsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-6 rounded-xl bg-yellow-100 p-4 shadow-lg"
    >
      <h3 className="mb-2 font-bold text-gray-800 text-lg">ヒント</h3>
      <ul className="space-y-1 text-gray-700">
        <li>⌨️ キーボードの きいろい キーを おしてね</li>
        <li>👀 がめんを みながら ゆっくり うとう</li>
        <li>🎯 まちがえても だいじょうぶ！ つづけて うとう</li>
        {handHighlight === "left" && <li>👈 みどりいろの キーだけ つかうよ（ひだりて）</li>}
        {handHighlight === "right" && <li>👉 あおいろの キーだけ つかうよ（みぎて）</li>}
        {handHighlight === "both" && <li>👐 りょうてを つかって うとう</li>}
      </ul>
    </motion.div>
  );
}
