"use client";

import { motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { TypingGameErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { LevelUpNotification } from "@/src/components/ui/LevelUpNotification";
import { PlayerLevel } from "@/src/components/ui/PlayerLevel";
import { performanceMonitor } from "@/src/lib/errorHandling";
import { memoize } from "@/src/lib/memoization";
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

// 手のハイライト計算をメモ化
const getHandHighlight = memoize((lessonId: string): "left" | "right" | "both" | null => {
  if (lessonId.includes("left-hand")) return "left";
  if (lessonId.includes("right-hand")) return "right";
  if (lessonId.includes("both-hands")) return "both";
  return null;
});

// ヘッダーコンポーネントをメモ化
const GameHeader = memo(function GameHeader({
  courseTitle,
  onBack,
  onReset,
  levelUpData,
  showLevelUpNotification,
  onCloseLevelUp,
}: {
  courseTitle: string;
  onBack: () => void;
  onReset: () => void;
  levelUpData: { level: number; title: string } | null;
  showLevelUpNotification: boolean;
  onCloseLevelUp: () => void;
}) {
  return (
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
            <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">{courseTitle}</h1>
          </div>

          <div className="relative flex items-center gap-4">
            <PlayerLevel compact />

            {/* レベルアップ通知 */}
            {levelUpData && (
              <LevelUpNotification
                isVisible={showLevelUpNotification}
                newLevel={levelUpData.level}
                newTitle={levelUpData.title}
                onClose={onCloseLevelUp}
              />
            )}

            <motion.button
              onClick={onReset}
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
  );
});

// タイピングエリアをメモ化
const TypingArea = memo(function TypingArea({
  displayText,
  typedText,
  currentChar,
  currentIndex,
  inputText,
  isCompleted,
}: {
  displayText: string;
  typedText: string;
  currentChar: string;
  currentIndex: number;
  inputText: string;
  isCompleted: boolean;
}) {
  return (
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
  );
});

// キーボードエリアをメモ化
const KeyboardArea = memo(function KeyboardArea({
  isCompleted,
  isLastLesson,
  onNext,
  onBack,
  lastPressedKey,
  currentChar,
  handHighlight,
}: {
  isCompleted: boolean;
  isLastLesson: boolean;
  onNext?: () => void;
  onBack: () => void;
  lastPressedKey: string | undefined;
  currentChar: string;
  handHighlight: "left" | "right" | "both" | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      {/* 完了時の次レッスンボタン */}
      {isCompleted && (
        <TypingCompletionButton isLastLesson={isLastLesson} onNext={onNext} onBack={onBack} />
      )}

      <KeyboardVisualizer
        pressedKey={lastPressedKey}
        nextKey={isCompleted ? " " : currentChar}
        highlightHand={isCompleted ? "both" : handHighlight}
      />
    </motion.div>
  );
});

export function TypingGameOptimized({
  lesson,
  course,
  lessons,
  onComplete,
  onBack,
  onNext,
}: TypingGameProps) {
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number; title: string } | null>(null);

  // パフォーマンス監視
  performanceMonitor.start("typing-game-render");

  // ナビゲーション情報を取得
  const navigation = useLessonNavigation({ course, currentLesson: lesson, lessons });
  const { isLastLesson } = navigation;

  // レベルアップハンドラーをメモ化
  const handleLevelUp = useCallback((data: { level: number; title: string }) => {
    setLevelUpData(data);
    setShowLevelUpNotification(true);
  }, []);

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
    onLevelUp: handleLevelUp,
  });

  // キーボード入力処理
  const { ensureFocus } = useKeyboardInput({
    onKeyPress: handleKeyPress,
    onKeyDown: setLastPressedKey,
    enabled: true,
  });

  // ハンドラーをメモ化
  const handleReset = useCallback(() => {
    reset();
    setShowLevelUpNotification(false);
    setLevelUpData(null);
  }, [reset]);

  const handleCloseLevelUp = useCallback(() => {
    setShowLevelUpNotification(false);
  }, []);

  // 手のハイライトをメモ化
  const handHighlight = useMemo(() => getHandHighlight(lesson.id), [lesson.id]);

  // パフォーマンス監視終了
  performanceMonitor.end("typing-game-render");

  return (
    <TypingGameErrorBoundary>
      <div
        className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
        onClick={ensureFocus}
        onKeyDown={ensureFocus}
        tabIndex={-1}
      >
        {/* ヘッダー */}
        <GameHeader
          courseTitle={course.title}
          onBack={onBack}
          onReset={handleReset}
          levelUpData={levelUpData}
          showLevelUpNotification={showLevelUpNotification}
          onCloseLevelUp={handleCloseLevelUp}
        />

        {/* メインコンテンツ */}
        <main className="mx-auto max-w-7xl p-4">
          {/* 進捗バー */}
          <TypingProgress progress={progress} />

          {/* タイピングエリア */}
          <TypingArea
            displayText={displayText}
            typedText={typedText}
            currentChar={currentChar}
            currentIndex={currentIndex}
            inputText={inputText}
            isCompleted={isCompleted}
          />

          {/* キーボード表示 */}
          <KeyboardArea
            isCompleted={isCompleted}
            isLastLesson={isLastLesson}
            onNext={onNext}
            onBack={onBack}
            lastPressedKey={lastPressedKey}
            currentChar={currentChar}
            handHighlight={handHighlight}
          />

          {/* ヒント */}
          <TypingHints handHighlight={handHighlight} />
        </main>
      </div>
    </TypingGameErrorBoundary>
  );
}

// デフォルトエクスポートもメモ化
export default memo(TypingGameOptimized);
