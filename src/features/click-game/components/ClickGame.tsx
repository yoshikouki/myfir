"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Home, RotateCcw, Target, Timer, Trophy } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { gameConfig, gameLevels } from "../data";
import type { Animal, GameLevel, GameStats } from "../types";
import { AnimalGrid } from "./AnimalGrid";
import { LevelSelector } from "./LevelSelector";

export function ClickGame() {
  const [currentLevel, setCurrentLevel] = useState<GameLevel | null>(null);
  const [completedLevels, setCompletedLevels] = useState<Set<string>>(new Set());
  const [gameActive, setGameActive] = useState(false);
  const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    foundAnimals: [],
    timeRemaining: 0,
    accuracy: 100,
  });
  const [feedback, setFeedback] = useState<string>("");
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 2000);
  }, []);

  const getRandomMessage = useCallback((messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  const selectRandomTarget = useCallback((level: GameLevel, excludeIds: string[] = []) => {
    const availableAnimals = level.animals.filter((animal) => !excludeIds.includes(animal.id));
    if (availableAnimals.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableAnimals.length);
    return availableAnimals[randomIndex];
  }, []);

  const startGame = useCallback(
    (level: GameLevel) => {
      setCurrentLevel(level);
      setGameActive(true);
      setGameCompleted(false);
      setTimeRemaining(level.timeLimit);
      setStartTime(Date.now());
      setStats({
        score: 0,
        foundAnimals: [],
        timeRemaining: level.timeLimit,
        accuracy: 100,
      });

      const firstTarget = selectRandomTarget(level);
      setTargetAnimal(firstTarget);
    },
    [selectRandomTarget],
  );

  const handleAnimalFound = useCallback(
    (animal: Animal) => {
      if (!currentLevel || !gameActive) return;

      const newFoundAnimals = [...stats.foundAnimals, animal.id];
      const newStats = {
        ...stats,
        score: stats.score + 10,
        foundAnimals: newFoundAnimals,
        timeRemaining,
      };
      setStats(newStats);

      showFeedback(getRandomMessage(gameConfig.successMessages));

      // ゲーム完了チェック
      if (newFoundAnimals.length >= currentLevel.targetCount) {
        setGameCompleted(true);
        setGameActive(false);
        setCompletedLevels((prev) => new Set([...prev, currentLevel.id]));
        showFeedback(getRandomMessage(gameConfig.completionMessages));
        return;
      }

      // 次のターゲットを選択
      const nextTarget = selectRandomTarget(currentLevel, newFoundAnimals);
      setTargetAnimal(nextTarget);
    },
    [
      currentLevel,
      gameActive,
      stats,
      timeRemaining,
      showFeedback,
      getRandomMessage,
      selectRandomTarget,
    ],
  );

  const handleWrongClick = useCallback(() => {
    showFeedback("ちがうよ！ たーげっとの どうぶつを さがしてね");
  }, [showFeedback]);

  const handleBackToLevels = () => {
    setCurrentLevel(null);
    setGameActive(false);
    setGameCompleted(false);
    setTargetAnimal(null);
    setFeedback("");
  };

  const handleRestart = () => {
    if (currentLevel) {
      startGame(currentLevel);
    }
  };

  // タイマー
  useEffect(() => {
    if (!gameActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          showFeedback("じかん きれちゃった！ もういちど やってみよう！");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeRemaining, showFeedback]);

  if (!currentLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
              <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">
                どうぶつを さがそう
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4">
          <LevelSelector
            levels={gameLevels}
            onLevelSelect={startGame}
            completedLevels={completedLevels}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleBackToLevels}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <Home className="size-5" />
                <span>もどる</span>
              </motion.button>
              <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">
                {currentLevel.name} - {currentLevel.description}
              </h1>
            </div>

            <motion.button
              onClick={handleRestart}
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
        {/* ゲーム情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-white p-4 shadow-lg"
        >
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <Timer className="size-5 text-blue-600" />
              <div className="text-center">
                <p className="text-gray-600 text-sm">のこりじかん</p>
                <p className="font-bold text-2xl text-blue-600">{timeRemaining}s</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="size-5 text-green-600" />
              <div className="text-center">
                <p className="text-gray-600 text-sm">みつけた</p>
                <p className="font-bold text-2xl text-green-600">
                  {stats.foundAnimals.length} / {currentLevel.targetCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="size-5 text-purple-600" />
              <div className="text-center">
                <p className="text-gray-600 text-sm">スコア</p>
                <p className="font-bold text-2xl text-purple-600">{stats.score}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ターゲット表示 */}
        {targetAnimal && !gameCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center text-white shadow-lg"
          >
            <p className="mb-2 font-bold text-lg">いま さがしてる どうぶつ：</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl">{targetAnimal.emoji}</span>
              <div className="text-left">
                <p className="font-bold text-2xl">{targetAnimal.name}</p>
                <p className="text-lg">「{targetAnimal.sound}」</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* フィードバック */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mb-6 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 p-4 text-center font-bold text-white text-xl shadow-lg"
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ゲーム完了 */}
        {gameCompleted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-6 rounded-3xl bg-gradient-to-r from-green-400 to-blue-500 p-6 text-center text-white shadow-xl"
          >
            <Trophy className="mx-auto mb-4 size-16" />
            <h2 className="mb-2 font-bold text-3xl">レベル クリア！</h2>
            <p className="text-xl">スコア: {stats.score}てん</p>
            <p className="text-lg">
              じかん: {Math.round((Date.now() - startTime) / 1000)}びょう
            </p>
          </motion.div>
        )}

        {/* ゲームグリッド */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimalGrid
            animals={currentLevel.animals}
            targetAnimal={targetAnimal}
            onAnimalFound={handleAnimalFound}
            onWrongClick={handleWrongClick}
            gameActive={gameActive}
          />
        </motion.div>

        {/* ヒント */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-xl bg-blue-100 p-4 shadow-lg"
        >
          <h3 className="mb-2 font-bold text-gray-800 text-lg">あそびかた</h3>
          <ul className="space-y-1 text-gray-700">
            <li>🎯 うえに でてる どうぶつを さがしてね</li>
            <li>👀 どうぶつは すこしの あいだだけ でるよ</li>
            <li>⚡ はやく クリックすると こうとくてん！</li>
            <li>🏆 {currentLevel.targetCount}ひき ぜんぶ みつけよう！</li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
