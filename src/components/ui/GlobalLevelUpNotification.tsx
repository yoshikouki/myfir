"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { useLevelUpQueue } from "@/src/contexts/PlayerContext";

/**
 * アプリ全体で表示されるレベルアップ通知
 * 複数のレベルアップがキューに入る可能性を考慮した設計
 */
export function GlobalLevelUpNotification() {
  const { queue, dismissLevelUp } = useLevelUpQueue();

  const currentNotification = queue[0];

  if (!currentNotification) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={dismissLevelUp}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="pointer-events-auto relative mx-4 max-w-md rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={dismissLevelUp}
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
            aria-label="通知を閉じる"
          >
            <X className="size-4 text-white" />
          </button>

          {/* コンテンツ */}
          <div className="text-center text-white">
            {/* アニメーション星 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", duration: 0.8 }}
              className="mb-4 flex justify-center"
            >
              <div className="relative">
                <Star className="size-16 fill-yellow-300 text-yellow-300" />
                {/* キラキラエフェクト */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{
                      delay: 0.5 + i * 0.2,
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 2,
                    }}
                    className="absolute"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  >
                    <Star className="size-3 fill-white text-white" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* レベルアップメッセージ */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-2 font-bold text-3xl"
            >
              🎉 レベルアップ！
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-4"
            >
              <p className="mb-2 font-bold text-2xl">レベル {currentNotification.level}</p>
              <p className="text-lg">{currentNotification.title}</p>
            </motion.div>

            {/* 継続ボタン */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              onClick={dismissLevelUp}
              className="rounded-full bg-white px-8 py-3 font-bold text-orange-600 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              つづける！
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
