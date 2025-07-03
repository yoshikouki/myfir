import { useMemo } from "react";
import type { TypingCourse, TypingLesson } from "../types";

interface UseLessonNavigationOptions {
  course: TypingCourse;
  currentLesson: TypingLesson;
  lessons: TypingLesson[];
}

/**
 * レッスンナビゲーションのロジックを管理するフック
 */
export function useLessonNavigation({
  course,
  currentLesson,
  lessons,
}: UseLessonNavigationOptions) {
  // 現在のコースのレッスンのみをフィルタリング
  const courseLessons = useMemo(() => {
    return lessons.filter((lesson) => lesson.courseId === course.id);
  }, [lessons, course.id]);

  // 現在のレッスンのインデックス
  const currentIndex = useMemo(() => {
    return courseLessons.findIndex((lesson) => lesson.id === currentLesson.id);
  }, [courseLessons, currentLesson.id]);

  // 次のレッスン
  const nextLesson = useMemo(() => {
    if (currentIndex >= 0 && currentIndex < courseLessons.length - 1) {
      return courseLessons[currentIndex + 1];
    }
    return null;
  }, [courseLessons, currentIndex]);

  // 前のレッスン
  const previousLesson = useMemo(() => {
    if (currentIndex > 0) {
      return courseLessons[currentIndex - 1];
    }
    return null;
  }, [courseLessons, currentIndex]);

  // 最後のレッスンかどうか
  const isLastLesson = useMemo(() => {
    return currentIndex === courseLessons.length - 1;
  }, [currentIndex, courseLessons.length]);

  // 最初のレッスンかどうか
  const isFirstLesson = useMemo(() => {
    return currentIndex === 0;
  }, [currentIndex]);

  // 進捗パーセンテージ
  const progressPercentage = useMemo(() => {
    if (courseLessons.length === 0) return 0;
    return Math.round(((currentIndex + 1) / courseLessons.length) * 100);
  }, [currentIndex, courseLessons.length]);

  return {
    courseLessons,
    currentIndex,
    nextLesson,
    previousLesson,
    isLastLesson,
    isFirstLesson,
    progressPercentage,
    totalLessons: courseLessons.length,
  };
}
