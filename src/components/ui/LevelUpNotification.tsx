"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { useEffect } from "react";
import { getLevelUpCelebration } from "@/src/lib/level-system";

interface LevelUpNotificationProps {
  isVisible: boolean;
  newLevel: number;
  newTitle: string;
  onClose: () => void;
}

export function LevelUpNotification({
  isVisible,
  newLevel,
  newTitle,
  onClose,
}: LevelUpNotificationProps) {
  const celebration = getLevelUpCelebration(newLevel);

  useEffect(() => {
    if (isVisible) {
      // 4秒後に自動的に閉じる
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="absolute top-full right-0 z-40 mt-2 w-80"
        >
          <div className="relative rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-1 shadow-xl">
            {/* キラキラエフェクト */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, (Math.random() - 0.5) * 100],
                    y: [0, (Math.random() - 0.5) * 100],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute top-1/2 left-1/2 text-yellow-200"
                >
                  <Sparkles className="size-3" />
                </motion.div>
              ))}
            </div>

            {/* メインコンテンツ */}
            <div className="rounded-2xl bg-white p-4">
              <div className="flex items-center gap-3">
                {/* 絵文字 */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-3xl"
                >
                  {celebration.emoji}
                </motion.div>

                {/* メッセージ */}
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="font-bold text-gray-800 text-lg">{celebration.message}</p>
                    <p className="text-gray-600 text-sm">レベル {newLevel} に なったよ！</p>
                  </motion.div>
                </div>

                {/* 閉じるボタン */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                >
                  ×
                </motion.button>
              </div>

              {/* 新しいタイトル */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-3 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-3"
              >
                <div className="mb-1 flex justify-center gap-1">
                  {[...Array(Math.min(newLevel, 5))].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                  {newLevel > 5 && (
                    <span className="text-gray-600 text-xs">+{newLevel - 5}</span>
                  )}
                </div>
                <p className="text-center font-bold text-gray-800 text-sm">{newTitle}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
