"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { typingLessons } from "../data";
import type { TypingLesson, TypingStats } from "../types";
import { LessonCard } from "./LessonCard";
import { TypingGame } from "./TypingGame";

export function TypingPractice() {
  const [selectedLesson, setSelectedLesson] = useState<TypingLesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const handleLessonComplete = (_stats: TypingStats) => {
    if (selectedLesson) {
      setCompletedLessons((prev) => new Set([...prev, selectedLesson.id]));
    }
  };

  const handleBack = () => {
    setSelectedLesson(null);
  };

  if (selectedLesson) {
    return (
      <TypingGame
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
        onBack={handleBack}
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
        {/* 説明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-4 font-bold text-2xl text-gray-800">
            キーボードで もじを うってみよう！
          </h2>
          <p className="mb-4 text-gray-700 text-lg">
            すきな れんしゅうを えらんで、キーボードで もじを うとう。 ゆっくり ていねいに
            うつのが たいせつだよ。
          </p>
          <div className="rounded-xl bg-gradient-to-r from-green-100 to-blue-100 p-4">
            <p className="text-gray-700">🏆 クリアしたら みどりの チェックマークが つくよ！</p>
          </div>
        </motion.div>

        {/* レッスン一覧 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {typingLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <LessonCard
                lesson={lesson}
                onSelect={setSelectedLesson}
                isCompleted={completedLessons.has(lesson.id)}
              />
            </motion.div>
          ))}
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
              🎉 ぜんぶ クリア！ すごいね！ 🎉
            </motion.p>
          )}
        </motion.div>
      </main>
    </div>
  );
}
