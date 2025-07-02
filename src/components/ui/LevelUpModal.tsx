"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getLevelUpCelebration } from "@/src/lib/level-system";

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  newTitle: string;
  onClose: () => void;
}

export function LevelUpModal({ isOpen, newLevel, newTitle, onClose }: LevelUpModalProps) {
  const [showStars, setShowStars] = useState(false);
  const celebration = getLevelUpCelebration(newLevel);

  useEffect(() => {
    if (isOpen) {
      setShowStars(true);
      // 3秒後に自動的に閉じる
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative mx-4 max-w-md rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-1 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 背景のキラキラエフェクト */}
            {showStars && (
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 200],
                      y: [0, (Math.random() - 0.5) * 200],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="absolute top-1/2 left-1/2 text-yellow-200"
                  >
                    <Sparkles className="size-4" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* メインコンテンツ */}
            <div className="rounded-3xl bg-white p-8 text-center">
              {/* トロフィーアイコン */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mb-4 flex justify-center"
              >
                <div className="rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-4">
                  <Trophy className="size-12 text-white" />
                </div>
              </motion.div>

              {/* レベルアップメッセージ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="mb-2 text-6xl">{celebration.emoji}</div>
                <h2 className="mb-2 font-bold text-2xl text-gray-800">{celebration.message}</h2>
                <p className="mb-4 text-gray-600 text-lg">レベル {newLevel} に なったよ！</p>
              </motion.div>

              {/* 新しいタイトル */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-6 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 p-4"
              >
                <div className="mb-2 flex justify-center">
                  {[...Array(newLevel)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <Star className="size-5 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="font-bold text-gray-800 text-lg">{newTitle}</p>
              </motion.div>

              {/* 閉じるボタン */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={onClose}
                className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
              >
                つづける！
              </motion.button>

              {/* 自動クローズのヒント */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-2 text-gray-500 text-sm"
              >
                3びょうで じどうてきに とじるよ
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
