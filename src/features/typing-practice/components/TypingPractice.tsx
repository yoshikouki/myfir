"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { typingCourses, typingLessons } from "../data";
import type { TypingCourse, TypingLesson, TypingStats } from "../types";
import { LessonCard } from "./LessonCard";
import { TypingGame } from "./TypingGame";

export function TypingPractice() {
  const [selectedLesson, setSelectedLesson] = useState<TypingLesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // コース選択時に最初のレッスンまたは未完了のレッスンを開始
  const handleCourseSelect = (course: TypingCourse) => {
    const courseLessons = typingLessons.filter((lesson) => lesson.courseId === course.id);

    // 未完了のレッスンがあればそれを選択、なければ最初のレッスン
    const nextLesson =
      courseLessons.find((lesson) => !completedLessons.has(lesson.id)) || courseLessons[0];

    if (nextLesson) {
      setSelectedLesson(nextLesson);
    }
  };

  const handleLessonComplete = (_stats: TypingStats) => {
    if (selectedLesson) {
      setCompletedLessons((prev) => new Set([...prev, selectedLesson.id]));
    }
  };

  const handleBack = () => {
    if (selectedLesson) {
      setSelectedLesson(null);
    }
  };

  const handleNext = () => {
    if (!selectedLesson) return;

    // 現在のコース内のレッスンのみから次のレッスンを探す
    const courseLessons = typingLessons.filter(
      (lesson) => lesson.courseId === selectedLesson.courseId,
    );
    const currentIndex = courseLessons.findIndex((lesson) => lesson.id === selectedLesson.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < courseLessons.length) {
      // 同じコース内に次のレッスンがある場合
      setSelectedLesson(courseLessons[nextIndex]);
    } else {
      // コース内の最後のレッスンの場合はコース一覧に戻る
      setSelectedLesson(null);
    }
  };

  if (selectedLesson) {
    // コース内での最後のレッスンかどうかを判定
    const courseLessons = typingLessons.filter(
      (lesson) => lesson.courseId === selectedLesson.courseId,
    );
    const currentIndex = courseLessons.findIndex((lesson) => lesson.id === selectedLesson.id);
    const isLastLesson = currentIndex === courseLessons.length - 1;

    return (
      <TypingGame
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
        onBack={handleBack}
        onNext={handleNext}
        isLastLesson={isLastLesson}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <Home className="size-5" />
                <span>もどる</span>
              </motion.button>
            </Link>
            <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">もじを うとう</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl p-4">
        {/* シンプルな説明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-6 font-bold text-3xl text-gray-800">どれから はじめる？</h2>
        </motion.div>

        {/* コース一覧 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {typingCourses
            .sort((a, b) => a.order - b.order)
            .map((course, index) => {
              const courseLessons = typingLessons.filter(
                (lesson) => lesson.courseId === course.id,
              );
              const completedInCourse = courseLessons.filter((lesson) =>
                completedLessons.has(lesson.id),
              ).length;
              const totalLessons = courseLessons.length;
              const isCompleted = completedInCourse === totalLessons;

              // 各コースの代表的な難易度を決める（最初のレッスンの難易度）
              const representativeLesson = courseLessons[0];
              const difficulty = representativeLesson?.level || "beginner";

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <LessonCard
                    lesson={{
                      id: course.id,
                      courseId: course.id,
                      title: course.title,
                      description: course.description,
                      icon: course.icon,
                      level: difficulty,
                      targetText: `${completedInCourse}/${totalLessons} クリア`,
                      romajiText: "",
                    }}
                    course={course}
                    onSelect={() => handleCourseSelect(course)}
                    isCompleted={isCompleted}
                  />
                </motion.div>
              );
            })}
        </div>

        {/* 全体進捗表示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-2xl bg-white p-6 shadow-lg"
        >
          <h3 className="mb-4 font-bold text-gray-800 text-xl">ぜんたいの しんちょく</h3>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-gray-600">
              クリアした れんしゅう: {completedLessons.size} / {typingLessons.length}
            </span>
            <span className="font-bold text-green-600 text-lg">
              {Math.round((completedLessons.size / typingLessons.length) * 100)}%
            </span>
          </div>
          <div className="h-4 rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{
                width: `${(completedLessons.size / typingLessons.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {completedLessons.size === typingLessons.length && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-center font-bold text-2xl text-green-600"
            >
              🎉 ぜんぶ クリア！ タイピング マスター！ 🎉
            </motion.p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
