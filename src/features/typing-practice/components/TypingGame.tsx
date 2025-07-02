"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { LevelUpNotification } from "@/src/components/ui/LevelUpNotification";
import { PlayerLevel } from "@/src/components/ui/PlayerLevel";
import { completeActivity } from "@/src/lib/level-system";
import type { TypingCourse, TypingLesson, TypingStats } from "../types";
import { KeyboardVisualizer } from "./KeyboardVisualizer";

interface TypingGameProps {
  lesson: TypingLesson;
  course: TypingCourse;
  onComplete: (stats: TypingStats) => void;
  onBack: () => void;
  onNext?: () => void; // 次のレッスンに進む関数
  isLastLesson?: boolean; // 最後のレッスンかどうか
}

export function TypingGame({
  lesson,
  course,
  onComplete,
  onBack,
  onNext,
  isLastLesson,
}: TypingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    totalKeystrokes: 0,
  });
  const [lastPressedKey, setLastPressedKey] = useState<string | undefined>();
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number; title: string } | null>(null);

  // ローマ字テキストがある場合はそれを使用、なければ通常のテキスト
  const inputText = lesson.romajiText || lesson.targetText;
  const displayText = lesson.targetText; // 表示用は常にひらがな
  const currentChar = inputText[currentIndex];
  const progress = (currentIndex / inputText.length) * 100;

  // レッスンが変わったら状態をリセット
  // biome-ignore lint/correctness/useExhaustiveDependencies: レッスン変更時のリセットが必要
  useEffect(() => {
    setCurrentIndex(0);
    setTypedText("");
    setIsCompleted(false);
    setStartTime(null);
    setStats({
      totalKeystrokes: 0,
    });
    setLastPressedKey(undefined);
    setShowLevelUpNotification(false);
    setLevelUpData(null);
  }, [lesson.id]);

  // 初期状態でスペースがある場合は自動的にスキップ
  useEffect(() => {
    let nextIndex = currentIndex;
    let updatedTypedText = typedText;

    // 現在位置から連続するスペースをすべてスキップ
    while (nextIndex < inputText.length && inputText[nextIndex] === " ") {
      updatedTypedText += " ";
      nextIndex++;
    }

    if (nextIndex !== currentIndex) {
      setTypedText(updatedTypedText);
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, inputText, typedText]);

  // レッスンタイプに基づいて手のハイライトを決定
  const getHandHighlight = (): "left" | "right" | "both" | null => {
    if (lesson.id.includes("left-hand")) return "left";
    if (lesson.id.includes("right-hand")) return "right";
    if (lesson.id.includes("both-hands")) return "both";
    return null;
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // 完了時はスペースキーで次へ進む
      if (isCompleted) {
        if (e.key === " " && onNext) {
          onNext();
        }
        return;
      }

      if (!startTime) {
        setStartTime(Date.now());
      }

      const key = e.key;
      setLastPressedKey(key);

      // スペース文字は自動的にスキップ（連続するスペースも処理）
      let nextIndex = currentIndex;
      let updatedTypedText = typedText;

      // 現在位置から連続するスペースをすべてスキップ
      while (nextIndex < inputText.length && inputText[nextIndex] === " ") {
        updatedTypedText += " ";
        nextIndex++;
      }

      if (nextIndex !== currentIndex) {
        setTypedText(updatedTypedText);
        setCurrentIndex(nextIndex);
        return; // スペースをスキップした場合は統計を更新せずに次へ
      }

      // 統計を更新
      const newStats = { ...stats };
      newStats.totalKeystrokes++;

      if (key === currentChar) {
        // 正しいキー
        setTypedText((prev) => prev + key);
        setCurrentIndex((prev) => prev + 1);

        // 完了チェック
        if (currentIndex + 1 >= inputText.length) {
          setIsCompleted(true);
          const completionTime = Date.now() - (startTime || Date.now());
          newStats.completionTime = completionTime;
          onComplete(newStats);

          // レベルシステム統合 - パーフェクトスコア判定
          const isPerfect = newStats.totalKeystrokes === inputText.length;
          const activityType = isPerfect ? "typing-perfect-score" : "typing-lesson-complete";

          // 経験値獲得とレベルアップチェック
          const levelResult = completeActivity(lesson.id, activityType);

          if (levelResult.leveledUp) {
            setLevelUpData({
              level: levelResult.progress.level,
              title: levelResult.progress.title,
            });
            setShowLevelUpNotification(true);
          }
        }
      }

      setStats(newStats);

      // キーを離したらリセット
      setTimeout(() => setLastPressedKey(undefined), 100);
    },
    [
      currentChar,
      currentIndex,
      isCompleted,
      startTime,
      stats,
      inputText,
      onComplete,
      onNext,
      typedText,
      lesson.id,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // keydownイベントからkeypressと同様の処理を実行
      if (e.key.length === 1) {
        // 印刷可能文字のみ
        handleKeyPress(e);
      }
    };

    // フォーカスを確保
    document.body.focus();
    document.body.tabIndex = -1;

    // keydownとkeypressの両方をサポート
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keypress", handleKeyPress);
      document.body.removeAttribute("tabindex");
    };
  }, [handleKeyPress]);

  const handleReset = () => {
    setCurrentIndex(0);
    setTypedText("");
    setIsCompleted(false);
    setStartTime(null);
    setStats({
      totalKeystrokes: 0,
    });
    setShowLevelUpNotification(false);
    setLevelUpData(null);
  };

  const handlePageClick = () => {
    // ページクリック時にフォーカスを確保
    document.body.focus();
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
      onClick={handlePageClick}
      onKeyDown={handlePageClick}
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
        <div className="mb-6 rounded-full bg-gray-200 p-1">
          <motion.div
            className="h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* タイピングエリア */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-white p-8 shadow-xl"
        >
          {/* ターゲットテキスト */}
          <div className="mb-6 text-center">
            {/* ひらがな表示 */}
            <div className="mb-4 font-bold text-3xl text-gray-800">{displayText}</div>

            {/* ローマ字入力表示 */}
            <div className="font-mono text-2xl">
              <span className="text-green-600">{typedText}</span>
              <AnimatePresence mode="wait">
                {!isCompleted && (
                  <motion.span
                    key={currentIndex}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded bg-yellow-100 px-1 text-blue-600 underline"
                  >
                    {currentChar}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-gray-400">{inputText.slice(currentIndex + 1)}</span>
            </div>
          </div>
        </motion.div>

        {/* キーボード表示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* 完了時の次レッスンボタン - キーボードの上に表示 */}
          {isCompleted && onNext && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }} // 「よくできました！」の直後
              className="-top-20 -translate-x-1/2 absolute left-1/2 z-10 w-full max-w-md"
            >
              <motion.button
                onClick={isLastLesson ? onBack : onNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center text-white shadow-lg transition-all hover:shadow-xl"
              >
                <p className="font-bold text-xl">
                  {isLastLesson ? "🎉 れんしゅう かんりょう！" : "🚀 つぎの れっすんへ！"}
                </p>
                <p className="mt-1 text-sm opacity-90">
                  {isLastLesson
                    ? "クリック または スペース キー"
                    : "クリック または スペース キー"}
                </p>
              </motion.button>
            </motion.div>
          )}

          <KeyboardVisualizer
            pressedKey={lastPressedKey}
            nextKey={isCompleted ? " " : currentChar} // 完了時はスペースキーをハイライト
            highlightHand={isCompleted ? "both" : getHandHighlight()}
          />
        </motion.div>

        {/* ヒント */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 rounded-xl bg-yellow-100 p-4 shadow-lg"
        >
          <h3 className="mb-2 font-bold text-gray-800 text-lg">ヒント</h3>
          <ul className="space-y-1 text-gray-700">
            <li>⌨️ キーボードの きいろい キーを おしてね</li>
            <li>👀 がめんを みながら ゆっくり うとう</li>
            <li>🎯 まちがえても だいじょうぶ！ つづけて うとう</li>
            {getHandHighlight() === "left" && (
              <li>👈 みどりいろの キーだけ つかうよ（ひだりて）</li>
            )}
            {getHandHighlight() === "right" && (
              <li>👉 あおいろの キーだけ つかうよ（みぎて）</li>
            )}
            {getHandHighlight() === "both" && <li>👐 りょうてを つかって うとう</li>}
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
