"use client";

import { motion } from "framer-motion";
import type { GameLevel } from "../types";

interface LevelSelectorProps {
  levels: GameLevel[];
  onLevelSelect: (level: GameLevel) => void;
  completedLevels: Set<string>;
}

const levelColors = {
  easy: "from-green-400 to-emerald-500",
  normal: "from-yellow-400 to-orange-500",
  hard: "from-red-400 to-pink-500",
  expert: "from-purple-400 to-indigo-500",
};

const levelEmojis = {
  easy: "🏠",
  normal: "🌍",
  hard: "🌊",
  expert: "🔍",
};

export function LevelSelector({ levels, onLevelSelect, completedLevels }: LevelSelectorProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 font-bold text-3xl text-gray-800">どの せかいで あそぶ？</h2>
        <p className="text-gray-600 text-lg">すきな ばしょを えらんで どうぶつを さがそう！</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {levels.map((level, index) => {
          const isCompleted = completedLevels.has(level.id);
          const colorClass =
            levelColors[level.id as keyof typeof levelColors] || levelColors.easy;
          const emoji = levelEmojis[level.id as keyof typeof levelEmojis] || "🎮";

          return (
            <motion.button
              key={level.id}
              onClick={() => onLevelSelect(level)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full"
            >
              <div
                className={`rounded-3xl bg-gradient-to-br ${colorClass} p-1 shadow-lg transition-shadow hover:shadow-xl`}
              >
                <div className="rounded-3xl bg-white p-8">
                  {/* 完了マーク */}
                  {isCompleted && (
                    <div className="-top-2 -right-2 absolute flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white text-xl">
                      ✓
                    </div>
                  )}

                  {/* アイコン */}
                  <div className="mb-4 text-6xl">{emoji}</div>

                  {/* レベル名 */}
                  <h3 className="mb-2 font-bold text-2xl text-gray-800">{level.name}</h3>

                  {/* 説明 */}
                  <p className="mb-4 text-gray-600">{level.description}</p>

                  {/* レベル詳細 */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">みつける どうぶつ：</span>
                      <span className="font-bold text-gray-800">{level.targetCount}ひき</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">じかん：</span>
                      <span className="font-bold text-gray-800">{level.timeLimit}びょう</span>
                    </div>
                  </div>

                  {/* 動物プレビュー */}
                  <div className="mt-4 flex justify-center gap-2">
                    {level.animals.slice(0, 4).map((animal) => (
                      <span key={animal.id} className="text-2xl" title={animal.name}>
                        {animal.emoji}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 進捗表示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 rounded-2xl bg-white p-6 shadow-lg"
      >
        <h3 className="mb-4 font-bold text-gray-800 text-xl">しんちょく</h3>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-gray-600">
            クリアした せかい: {completedLevels.size} / {levels.length}
          </span>
          <span className="font-bold text-green-600 text-lg">
            {Math.round((completedLevels.size / levels.length) * 100)}%
          </span>
        </div>
        <div className="h-4 rounded-full bg-gray-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{
              width: `${(completedLevels.size / levels.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {completedLevels.size === levels.length && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center font-bold text-2xl text-green-600"
          >
            🎉 ぜんぶ クリア！ どうぶつ マスターだね！ 🎉
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
