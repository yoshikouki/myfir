"use client";

import { motion } from "framer-motion";

interface TypingCompletionButtonProps {
  isLastLesson: boolean;
  onNext?: () => void;
  onBack: () => void;
}

/**
 * タイピング完了時の次へ進むボタン
 */
export function TypingCompletionButton({
  isLastLesson,
  onNext,
  onBack,
}: TypingCompletionButtonProps) {
  const handleClick = () => {
    if (isLastLesson || !onNext) {
      onBack();
    } else {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="-top-20 -translate-x-1/2 absolute left-1/2 z-10 w-full max-w-md"
    >
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center text-white shadow-lg transition-all hover:shadow-xl"
      >
        <p className="font-bold text-xl">
          {isLastLesson ? "🎉 れんしゅう かんりょう！" : "🚀 つぎの れっすんへ！"}
        </p>
        <p className="mt-1 text-sm opacity-90">クリック または スペース キー</p>
      </motion.button>
    </motion.div>
  );
}
