"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";
import { PlayerLevel } from "@/src/components/ui/PlayerLevel";
import { TypingPracticeProvider, useTypingPractice } from "../contexts/TypingPracticeContext";
import type { TypingCourse, TypingStats } from "../types";
import { LessonCard } from "./LessonCard";
import { TypingGameRefactored } from "./TypingGameRefactored";

function TypingPracticeContent() {
  const { state, actions } = useTypingPractice();

  // コース選択時に最初のレッスンまたは未完了のレッスンを開始
  const handleCourseSelect = (course: TypingCourse) => {
    actions.setCourse(course);
    const courseLessons = actions.getCourseLessons(course.id);

    // 未完了のレッスンがあればそれを選択、なければ最初のレッスン
    const nextLesson =
      courseLessons.find((lesson) => !actions.isLessonCompleted(lesson.id)) || courseLessons[0];

    if (nextLesson) {
      actions.setLesson(nextLesson);
    }
  };

  const handleLessonComplete = (stats: TypingStats) => {
    if (state.currentLesson) {
      actions.completeLesson(state.currentLesson.id, stats);
    }
  };

  const handleBack = () => {
    actions.clearCurrentLesson();
  };

  const handleNext = () => {
    if (!state.currentLesson || !state.currentCourse) return;

    const nextLesson = actions.getNextLesson(state.currentLesson.id, state.currentCourse.id);
    if (nextLesson) {
      actions.setLesson(nextLesson);
    } else {
      // コース完了
      actions.clearCurrentLesson();
    }
  };

  // 現在のコース内でのレッスン情報
  const getCurrentLessonInfo = () => {
    if (!state.currentLesson || !state.currentCourse) return null;

    const courseLessons = actions.getCourseLessons(state.currentCourse.id);
    const currentIndex = courseLessons.findIndex(
      (lesson) => lesson.id === state.currentLesson?.id,
    );

    return {
      isLastLesson: currentIndex === courseLessons.length - 1,
      hasNext: currentIndex < courseLessons.length - 1,
    };
  };

  const lessonInfo = getCurrentLessonInfo();

  // ゲーム画面
  if (state.currentLesson && state.currentCourse) {
    return (
      <TypingGameRefactored
        lesson={state.currentLesson}
        course={state.currentCourse}
        lessons={state.lessons}
        onComplete={handleLessonComplete}
        onBack={handleBack}
        onNext={lessonInfo?.hasNext ? handleNext : undefined}
      />
    );
  }

  // ローディング状態
  if (state.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">よみこみちゅう...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (state.error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">エラーが発生しました: {state.error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            もう一度試す
          </button>
        </div>
      </div>
    );
  }

  // コース選択画面
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* ヘッダー */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-shadow group-hover:shadow-xl"
              >
                <Home className="size-5" />
                <span>ホームへ</span>
              </motion.div>
            </Link>
            <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">もじを うとう</h1>
          </div>
          <div className="flex items-center">
            <PlayerLevel compact />
          </div>
        </div>

        {/* コース一覧 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.courses.map((course) => {
            const progress = actions.getCourseProgress(course.id);
            const courseLessons = actions.getCourseLessons(course.id);

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: course.order * 0.1 }}
              >
                <LessonCard
                  course={course}
                  lesson={courseLessons[0]} // 最初のレッスンを代表として使用
                  progress={progress}
                  onSelect={() => handleCourseSelect(course)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* 進捗情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-2xl bg-white p-6 shadow-lg"
        >
          <h2 className="mb-4 font-bold text-gray-800 text-xl">あなたの しんぽ</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {state.courses.map((course) => {
              const progress = actions.getCourseProgress(course.id);
              return (
                <div key={course.id} className="text-center">
                  <div className="mb-2 text-2xl">{course.icon}</div>
                  <h3 className="mb-1 font-semibold text-gray-700">{course.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {progress.completed} / {progress.total} かんりょう
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Provider でラップしたメインコンポーネント
export function TypingPracticeRefactored() {
  return (
    <TypingPracticeProvider>
      <TypingPracticeContent />
    </TypingPracticeProvider>
  );
}
