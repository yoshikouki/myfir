"use client";

import { motion } from "framer-motion";
import type { TypingLesson } from "../types";

interface LessonCardProps {
  lesson: TypingLesson;
  onSelect: (lesson: TypingLesson) => void;
  isCompleted?: boolean;
}

const levelColors = {
  beginner: "from-green-400 to-emerald-500",
  intermediate: "from-yellow-400 to-orange-500",
  advanced: "from-purple-400 to-pink-500",
};

const levelLabels = {
  beginner: "かんたん",
  intermediate: "ふつう",
  advanced: "むずかしい",
};

export function LessonCard({ lesson, onSelect, isCompleted = false }: LessonCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(lesson)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative w-full"
    >
      <div
        className={`rounded-2xl bg-gradient-to-br ${levelColors[lesson.level]} p-1 shadow-lg transition-shadow hover:shadow-xl`}
      >
        <div className="rounded-2xl bg-white p-6">
          {/* 完了マーク */}
          {isCompleted && (
            <div className="-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
              ✓
            </div>
          )}

          {/* アイコン */}
          <div className="mb-3 text-4xl">{lesson.icon}</div>

          {/* タイトル */}
          <h3 className="mb-1 font-bold text-gray-800 text-lg">{lesson.title}</h3>

          {/* 説明 */}
          <p className="mb-3 text-gray-600 text-sm">{lesson.description}</p>

          {/* レベル表示 */}
          <div
            className={`inline-block rounded-full bg-gradient-to-r ${levelColors[lesson.level]} px-3 py-1 font-bold text-white text-xs`}
          >
            {levelLabels[lesson.level]}
          </div>

          {/* プレビューテキスト */}
          <div className="mt-3 rounded-lg bg-gray-100 p-2">
            <p className="font-mono text-gray-700 text-sm">{lesson.targetText}</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
