"use client";

import { motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import { useState } from "react";
import { LevelUpNotification } from "@/src/components/ui/LevelUpNotification";
import { PlayerLevel } from "@/src/components/ui/PlayerLevel";
import { useKeyboardInput } from "../hooks/useKeyboardInput";
import { useLessonNavigation } from "../hooks/useLessonNavigation";
import { useTypingGame } from "../hooks/useTypingGame";
import type { TypingCourse, TypingLesson, TypingStats } from "../types";
import { KeyboardVisualizer } from "./KeyboardVisualizer";
import { TypingCompletionButton } from "./TypingCompletionButton";
import { TypingDisplay } from "./TypingDisplay";
import { TypingHints } from "./TypingHints";
import { TypingProgress } from "./TypingProgress";

interface TypingGameProps {
  lesson: TypingLesson;
  course: TypingCourse;
  lessons: TypingLesson[];
  onComplete: (stats: TypingStats) => void;
  onBack: () => void;
  onNext?: () => void;
}

export function TypingGameRefactored({
  lesson,
  course,
  lessons,
  onComplete,
  onBack,
  onNext,
}: TypingGameProps) {
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number; title: string } | null>(null);

  // ナビゲーション情報
  const { isLastLesson } = useLessonNavigation({ course, currentLesson: lesson, lessons });

  // タイピングゲームのコアロジック
  const {
    currentIndex,
    typedText,
    isCompleted,
    stats: _stats,
    lastPressedKey,
    inputText,
    displayText,
    currentChar,
    progress,
    handleKeyPress,
    reset,
    setLastPressedKey,
  } = useTypingGame({
    lesson,
    onComplete,
    onNext,
    onLevelUp: (data) => {
      setLevelUpData(data);
      setShowLevelUpNotification(true);
    },
  });

  // キーボード入力処理
  const { ensureFocus } = useKeyboardInput({
    onKeyPress: handleKeyPress,
    onKeyDown: setLastPressedKey,
    enabled: true,
  });

  // レッスンのタイプに基づいて手のハイライトを決定
  const getHandHighlight = (): "left" | "right" | "both" | null => {
    if (lesson.id.includes("left-hand")) return "left";
    if (lesson.id.includes("right-hand")) return "right";
    if (lesson.id.includes("both-hands")) return "both";
    return null;
  };

  const handleReset = () => {
    reset();
    setShowLevelUpNotification(false);
    setLevelUpData(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
      onClick={ensureFocus}
      onKeyDown={ensureFocus}
      tabIndex={-1}
    >
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <Home className="size-5" />
                <span>もどる</span>
              </motion.button>
              <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">{course.title}</h1>
            </div>

            <div className="relative flex items-center gap-4">
              <PlayerLevel compact />

              {/* レベルアップ通知 */}
              {levelUpData && (
                <LevelUpNotification
                  isVisible={showLevelUpNotification}
                  newLevel={levelUpData.level}
                  newTitle={levelUpData.title}
                  onClose={() => setShowLevelUpNotification(false)}
                />
              )}

              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
              >
                <RotateCcw className="size-5" />
                <span className="hidden sm:inline">やりなおす</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-7xl p-4">
        {/* 進捗バー */}
        <TypingProgress progress={progress} />

        {/* タイピングエリア */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-white p-8 shadow-xl"
        >
          <TypingDisplay
            displayText={displayText}
            typedText={typedText}
            currentChar={currentChar}
            currentIndex={currentIndex}
            inputText={inputText}
            isCompleted={isCompleted}
          />
        </motion.div>

        {/* キーボード表示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* 完了時の次レッスンボタン */}
          {isCompleted && (
            <TypingCompletionButton
              isLastLesson={isLastLesson}
              onNext={onNext}
              onBack={onBack}
            />
          )}

          <KeyboardVisualizer
            pressedKey={lastPressedKey}
            nextKey={isCompleted ? " " : currentChar}
            highlightHand={isCompleted ? "both" : getHandHighlight()}
          />
        </motion.div>

        {/* ヒント */}
        <TypingHints handHighlight={getHandHighlight()} />
      </main>
    </div>
  );
}
