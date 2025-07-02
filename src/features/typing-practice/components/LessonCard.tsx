"use client";

import { motion } from "framer-motion";
import type { TypingCourse, TypingLesson } from "../types";

interface LessonCardProps {
  lesson: TypingLesson;
  course: TypingCourse;
  onSelect: (lesson: TypingLesson) => void;
  isCompleted?: boolean;
}

const levelLabels = {
  beginner: "かんたん",
  intermediate: "ふつう",
  advanced: "むずかしい",
};

export function LessonCard({ lesson, course, onSelect, isCompleted = false }: LessonCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(lesson)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative w-full"
    >
      <div
        className={`rounded-2xl bg-gradient-to-br ${course.color} p-1 shadow-lg transition-shadow hover:shadow-xl`}
      >
        <div className="rounded-2xl bg-white p-6 text-center">
          {/* 完了マーク */}
          {isCompleted && (
            <div className="-top-3 -right-3 absolute flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white text-xl shadow-lg">
              ✓
            </div>
          )}

          {/* 大きなアイコン */}
          <div className="mb-4 text-6xl">{lesson.icon}</div>

          {/* コース名 + 難易度 */}
          <h3 className="mb-2 font-bold text-2xl text-gray-800">
            {course.title} ({levelLabels[lesson.level]})
          </h3>

          {/* レッスン名 */}
          <p className="mb-3 font-medium text-gray-600 text-lg">{lesson.title}</p>

          {/* プレビューテキスト */}
          <p className="font-mono text-base text-gray-500">{lesson.targetText}</p>
        </div>
      </div>
    </motion.button>
  );
}
