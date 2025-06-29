"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { mouseFriendStages } from "../data";
import type { GameState, MouseFriendProgress } from "../types";

interface MouseFriendGameProps {
  onComplete: () => void;
}

export function MouseFriendGame({ onComplete }: MouseFriendGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    stage: 0,
    isPlaying: false,
    score: 0,
    timeLeft: 0,
  });

  const [_progress, setProgress] = useState<MouseFriendProgress>({
    currentStage: 0,
    stagesCompleted: [false, false, false, false, false],
    totalStars: 0,
    bestTimes: [],
    unlockedStages: 1,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<
    Array<{ id: string; x: number; y: number; collected: boolean }>
  >([]);
  const [treasures, setTreasures] = useState<
    Array<{ id: string; x: number; y: number; opened: boolean; content: string }>
  >([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCharacterDialog, setShowCharacterDialog] = useState(true);
  const [characterMessage, setCharacterMessage] = useState("");
  const [pathProgress, setPathProgress] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const currentStage = mouseFriendStages[gameState.stage];

  // マウス位置の追跡
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  // ゲーム開始
  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      timeLeft: currentStage.duration,
      score: 0,
    }));
    setShowCharacterDialog(false);

    // ステージ別の初期化
    switch (currentStage.id) {
      case "greeting":
        setCharacterMessage("こんにちは！ぼくマウくんだよ！マウスをうごかしてみて！");
        break;
      case "star-collecting": {
        // 5つの星を配置
        const newStars = Array.from({ length: 5 }, (_, i) => ({
          id: `star-${i}`,
          x: 100 + Math.random() * 300,
          y: 100 + Math.random() * 200,
          collected: false,
        }));
        setStars(newStars);
        setCharacterMessage("きらきらをクリックしてあつめよう！");
        break;
      }
      case "treasure-hunt": {
        // 3つの宝箱を配置
        const newTreasures = [
          { id: "treasure-1", x: 150, y: 150, opened: false, content: "💎" },
          { id: "treasure-2", x: 300, y: 200, opened: false, content: "🎁" },
          { id: "treasure-3", x: 200, y: 100, opened: false, content: "🏆" },
        ];
        setTreasures(newTreasures);
        setCharacterMessage("どのたからばこをひらく？");
        break;
      }
      case "mouse-walk":
        setPathProgress(0);
        setCharacterMessage("いっしょにおさんぽしよう！");
        break;
      case "photo-time":
        setCharacterMessage("きねんしゃしんをとろう！");
        break;
    }
  }, [currentStage]);

  // ゲーム終了
  const completeStage = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPlaying: false }));
    setProgress((prev) => {
      const newCompleted = [...prev.stagesCompleted];
      newCompleted[gameState.stage] = true;
      return {
        ...prev,
        stagesCompleted: newCompleted,
        totalStars: prev.totalStars + 1,
        unlockedStages: Math.max(prev.unlockedStages, gameState.stage + 2),
      };
    });
    setShowSuccess(true);

    setTimeout(() => {
      if (gameState.stage < mouseFriendStages.length - 1) {
        setGameState((prev) => ({ ...prev, stage: prev.stage + 1 }));
        setShowSuccess(false);
        setShowCharacterDialog(true);
      } else {
        onComplete();
      }
    }, 3000);
  }, [gameState.stage, onComplete]);

  // タイマー
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.isPlaying && gameState.timeLeft === 0) {
      // 時間切れでも次に進む（子ども向けなので失敗させない）
      completeStage();
    }
  }, [gameState.isPlaying, gameState.timeLeft, completeStage]);

  // 星のクリック処理
  const handleStarClick = useCallback(
    (starId: string) => {
      setStars((prev) =>
        prev.map((star) => (star.id === starId ? { ...star, collected: true } : star)),
      );
      setGameState((prev) => ({ ...prev, score: prev.score + 1 }));

      const collectedCount = stars.filter((s) => s.collected).length + 1;
      if (collectedCount >= 5) {
        completeStage();
      }
    },
    [stars, completeStage],
  );

  // 宝箱のクリック処理
  const handleTreasureClick = useCallback(
    (treasureId: string) => {
      setTreasures((prev) =>
        prev.map((treasure) =>
          treasure.id === treasureId ? { ...treasure, opened: true } : treasure,
        ),
      );
      setGameState((prev) => ({ ...prev, score: prev.score + 1 }));

      const openedCount = treasures.filter((t) => t.opened).length + 1;
      if (openedCount >= 3) {
        completeStage();
      }
    },
    [treasures, completeStage],
  );

  // お散歩の進行処理
  useEffect(() => {
    if (currentStage.id === "mouse-walk" && gameState.isPlaying) {
      const distance = Math.sqrt((mousePosition.x - 200) ** 2 + (mousePosition.y - 150) ** 2);
      if (distance < 50) {
        setPathProgress((prev) => {
          const newProgress = Math.min(prev + 0.5, 100);
          if (newProgress >= 100) {
            completeStage();
          }
          return newProgress;
        });
      }
    }
  }, [mousePosition, currentStage.id, gameState.isPlaying, completeStage]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* ゲームエリア */}
      <div
        ref={gameAreaRef}
        className="relative h-96 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-sky-200 to-indigo-300"
        onMouseMove={handleMouseMove}
        role="application"
        aria-label="マウス操作練習エリア"
      >
        {/* マウくんキャラクター */}
        <motion.div
          className="absolute z-20"
          animate={{
            x: mousePosition.x - 25,
            y: mousePosition.y - 25,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
        >
          <motion.div
            className="select-none text-6xl"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: gameState.isPlaying ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐭
          </motion.div>
        </motion.div>

        {/* ステージごとの要素 */}
        <AnimatePresence>
          {/* 星（Stage 2） */}
          {currentStage.id === "star-collecting" &&
            stars.map(
              (star) =>
                !star.collected && (
                  <motion.button
                    key={star.id}
                    className="absolute z-10 text-4xl"
                    style={{ left: star.x, top: star.y }}
                    onClick={() => handleStarClick(star.id)}
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{
                      scale: 1,
                      rotate: 360,
                      y: [0, -10, 0],
                    }}
                    exit={{ scale: 0, rotate: 720 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    transition={{
                      scale: { type: "spring", stiffness: 300 },
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    ⭐
                  </motion.button>
                ),
            )}

          {/* 宝箱（Stage 3） */}
          {currentStage.id === "treasure-hunt" &&
            treasures.map((treasure) => (
              <motion.button
                key={treasure.id}
                className="absolute z-10 text-5xl"
                style={{ left: treasure.x, top: treasure.y }}
                onClick={() => handleTreasureClick(treasure.id)}
                initial={{ scale: 0, y: 20 }}
                animate={{
                  scale: 1,
                  y: treasure.opened ? -20 : 0,
                  rotateY: treasure.opened ? 180 : 0,
                }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {treasure.opened ? treasure.content : "📦"}
              </motion.button>
            ))}

          {/* お散歩の道（Stage 4） */}
          {currentStage.id === "mouse-walk" && (
            <motion.div
              className="absolute top-20 left-20 h-64 w-64 rounded-full border-8 border-yellow-400 border-dashed opacity-60"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-200"
                style={{
                  clipPath: `polygon(0 0, ${pathProgress}% 0, ${pathProgress}% 100%, 0 100%)`,
                }}
              />
            </motion.div>
          )}

          {/* 記念撮影フレーム（Stage 5） */}
          {currentStage.id === "photo-time" && (
            <motion.div
              className="absolute inset-4 rounded-2xl border-8 border-gold bg-gradient-to-br from-yellow-100 to-orange-100 p-4"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={completeStage}
            >
              <div className="text-center">
                <motion.p
                  className="font-bold text-2xl text-orange-800"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  📸 クリックしてしゃしんをとろう！
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 装飾要素 */}
        <motion.div
          className="absolute right-4 bottom-4 text-3xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🌈
        </motion.div>
        <motion.div
          className="absolute top-4 left-4 text-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ☁️
        </motion.div>
      </div>

      {/* UI要素 */}
      <div className="mt-6 space-y-4">
        {/* ステージ情報 */}
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-bold text-3xl text-purple-800">{currentStage.title}</h2>
          <p className="text-lg text-purple-600">{currentStage.description}</p>
        </motion.div>

        {/* プログレス */}
        {gameState.isPlaying && (
          <motion.div
            className="mx-auto max-w-md space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between text-purple-700 text-sm">
              <span>じかん: {gameState.timeLeft}びょう</span>
              <span>スコア: {gameState.score}</span>
            </div>
            <div className="h-3 rounded-full bg-purple-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ width: "100%" }}
                animate={{ width: `${(gameState.timeLeft / currentStage.duration) * 100}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* 開始ボタン */}
        {!gameState.isPlaying && !showSuccess && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.button
              onClick={startGame}
              className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-8 py-4 font-bold text-2xl text-white shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              はじめよう！
            </motion.button>
          </motion.div>
        )}

        {/* 成功メッセージ */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <motion.div
                className="mx-auto max-w-md rounded-2xl border-4 border-orange-400 bg-gradient-to-r from-yellow-100 to-orange-100 p-6"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{ duration: 0.8, repeat: 2 }}
              >
                <motion.p
                  className="font-bold text-3xl text-orange-800"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: 3 }}
                >
                  すごい！やったね！ 🎉
                </motion.p>
                <p className="mt-2 text-lg text-orange-700">
                  {gameState.stage < mouseFriendStages.length - 1
                    ? "つぎのステージにいこう！"
                    : "マウくんとなかよくなれたね！"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* キャラクターダイアログ */}
        <AnimatePresence>
          {showCharacterDialog && (
            <motion.div
              className="fixed right-4 bottom-4 left-4 z-50"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
            >
              <div className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-xl">
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">🐭</div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg">{characterMessage}</p>
                    <p className="mt-2 text-gray-600 text-sm">{currentStage.instruction}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
