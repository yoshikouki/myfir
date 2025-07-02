"use client";

import { motion } from "framer-motion";
import type { TypingCourse } from "../types";

interface CourseCardProps {
  course: TypingCourse;
  onSelect: (course: TypingCourse) => void;
  lessonsCount: number;
  completedCount: number;
}

export function CourseCard({
  course,
  onSelect,
  lessonsCount,
  completedCount,
}: CourseCardProps) {
  const progressPercentage =
    lessonsCount > 0 ? Math.round((completedCount / lessonsCount) * 100) : 0;
  const isCompleted = completedCount === lessonsCount && lessonsCount > 0;

  return (
    <motion.button
      onClick={() => onSelect(course)}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full rounded-3xl bg-white p-6 shadow-lg transition-all hover:shadow-xl"
    >
      {/* コースアイコンとタイトル */}
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-3xl">
          {course.icon}
        </div>
        <h3 className="font-bold text-gray-800 text-xl">{course.title}</h3>
        <p className="mt-1 text-gray-600 text-sm">{course.description}</p>
      </div>

      {/* 進捗表示 */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {completedCount} / {lessonsCount} クリア
          </span>
          <span className={`font-bold ${isCompleted ? "text-green-600" : "text-blue-600"}`}>
            {progressPercentage}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-200">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${course.color}`}
            style={{ width: `${progressPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {/* 完了バッジ */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="-top-2 -right-2 absolute flex size-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg"
        >
          ✓
        </motion.div>
      )}

      {/* レッスン数表示 */}
      <div className="text-center">
        <div
          className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 font-bold text-xs ${course.color} text-white`}
        >
          {lessonsCount}つの れんしゅう
        </div>
      </div>
    </motion.button>
  );
}
