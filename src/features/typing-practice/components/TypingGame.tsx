"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Home, RotateCcw, Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { TypingLesson, TypingStats } from "../types";
import { KeyboardVisualizer } from "./KeyboardVisualizer";

interface TypingGameProps {
  lesson: TypingLesson;
  onComplete: (stats: TypingStats) => void;
  onBack: () => void;
}

export function TypingGame({ lesson, onComplete, onBack }: TypingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    accuracy: 100,
  });
  const [lastPressedKey, setLastPressedKey] = useState<string | undefined>();

  const targetText = lesson.targetText;
  const currentChar = targetText[currentIndex];
  const progress = (currentIndex / targetText.length) * 100;

  // レッスンタイプに基づいて手のハイライトを決定
  const getHandHighlight = (): "left" | "right" | "both" | null => {
    if (lesson.id.includes("left-hand")) return "left";
    if (lesson.id.includes("right-hand")) return "right";
    if (lesson.id.includes("both-hands")) return "both";
    return null;
  };

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (isCompleted) return;

      if (!startTime) {
        setStartTime(Date.now());
      }

      const key = e.key;
      setLastPressedKey(key);

      // 統計を更新
      const newStats = { ...stats };
      newStats.totalKeystrokes++;

      if (key === currentChar) {
        // 正しいキー
        newStats.correctKeystrokes++;
        setTypedText((prev) => prev + key);
        setCurrentIndex((prev) => prev + 1);

        // 完了チェック
        if (currentIndex + 1 >= targetText.length) {
          setIsCompleted(true);
          const completionTime = Date.now() - (startTime || Date.now());
          newStats.completionTime = completionTime;
          onComplete(newStats);
        }
      }

      // 精度を計算
      newStats.accuracy = Math.round(
        (newStats.correctKeystrokes / newStats.totalKeystrokes) * 100,
      );
      setStats(newStats);

      // キーを離したらリセット
      setTimeout(() => setLastPressedKey(undefined), 100);
    },
    [currentChar, currentIndex, isCompleted, startTime, stats, targetText, onComplete],
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
      correctKeystrokes: 0,
      accuracy: 100,
    });
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
              <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">{lesson.title}</h1>
            </div>

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
            <p className="mb-2 font-bold text-gray-600 text-lg">つぎの もじを うとう：</p>
            <div className="font-mono text-4xl">
              <span className="text-green-600">{typedText}</span>
              <AnimatePresence mode="wait">
                {!isCompleted && (
                  <motion.span
                    key={currentIndex}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-blue-600 underline"
                  >
                    {currentChar}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="text-gray-400">{targetText.slice(currentIndex + 1)}</span>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="mb-6 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-gray-600">せいかくさ</p>
              <p className="font-bold text-2xl text-green-600">{stats.accuracy}%</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">うった もじ</p>
              <p className="font-bold text-2xl text-blue-600">{stats.totalKeystrokes}</p>
            </div>
          </div>

          {/* 完了メッセージ */}
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center text-white"
            >
              <Trophy className="mx-auto mb-2 size-12" />
              <p className="font-bold text-2xl">よくできました！</p>
              <p className="mt-2">
                じかん: {Math.round((stats.completionTime || 0) / 1000)}びょう
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* キーボード表示 */}
        {!isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <KeyboardVisualizer
              pressedKey={lastPressedKey}
              nextKey={currentChar}
              highlightHand={getHandHighlight()}
            />
          </motion.div>
        )}

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
