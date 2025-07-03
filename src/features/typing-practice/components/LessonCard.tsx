"use client";

import { motion } from "framer-motion";
import type { TypingCourse, TypingLesson } from "../types";
import { getSkillLevelLabel } from "../types";

interface LessonCardProps {
  lesson: TypingLesson;
  course: TypingCourse;
  onSelect: (lesson: TypingLesson) => void;
  isCompleted?: boolean;
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

// levelLabelsは types.ts の getSkillLevelLabel を使用

export function LessonCard({
  lesson,
  course,
  onSelect,
  isCompleted = false,
  progress,
}: LessonCardProps) {
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
            {lesson.title} ({getSkillLevelLabel(lesson.level)})
          </h3>

          {/* 説明またはサンプルテキスト */}
          <p className="mb-3 text-gray-600 text-sm">{lesson.description}</p>

          {/* 進捗表示 */}
          {progress && (
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-gray-500 text-xs">
                <span>しんちょく</span>
                <span>
                  {progress.completed} / {progress.total}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* サンプルテキスト */}
          <p className="mt-3 font-mono text-base text-gray-500">{lesson.targetText}</p>
        </div>
      </div>
    </motion.button>
  );
}
