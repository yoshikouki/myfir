"use client";

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { Home, RotateCcw, Trophy } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { dropZones, gameConfig, gameItems } from "../data";
import type { DragItem, GameStats } from "../types";
import { DraggableItem } from "./DraggableItem";
import { DropZoneArea } from "./DropZoneArea";

export function DragDropGame() {
  const [availableItems, setAvailableItems] = useState<DragItem[]>(gameItems);
  const [placedItems, setPlacedItems] = useState<Record<string, DragItem[]>>({
    toys: [],
    food: [],
    clothes: [],
    stationery: [],
  });
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime] = useState(Date.now());
  const [stats, setStats] = useState<GameStats>({
    correctPlacements: 0,
    totalAttempts: 0,
    accuracy: 100,
  });
  const [feedback, setFeedback] = useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const isCorrectPlacement = (item: DragItem, zoneId: string): boolean => {
    return item.category === zoneId;
  };

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 2000);
  }, []);

  const getRandomMessage = useCallback((messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const item = availableItems.find((item) => item.id === event.active.id);
    setActiveItem(item || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setActiveZone((over?.id as string) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    if (!over || !activeItem) {
      setActiveItem(null);
      setActiveZone(null);
      return;
    }

    const zoneId = over.id as string;
    const newStats = { ...stats };
    newStats.totalAttempts++;

    if (isCorrectPlacement(activeItem, zoneId)) {
      // 正しい配置
      newStats.correctPlacements++;
      setPlacedItems((prev) => ({
        ...prev,
        [zoneId]: [...prev[zoneId], activeItem],
      }));
      setAvailableItems((prev) => prev.filter((item) => item.id !== activeItem.id));
      showFeedback(getRandomMessage(gameConfig.encouragingMessages));
    } else {
      // 間違った配置
      showFeedback("ちがう ばしょだよ。もういちど やってみて！");
    }

    newStats.accuracy = Math.round((newStats.correctPlacements / newStats.totalAttempts) * 100);
    setStats(newStats);

    setActiveItem(null);
    setActiveZone(null);
  };

  const handleReset = () => {
    setAvailableItems(gameItems);
    setPlacedItems({
      toys: [],
      food: [],
      clothes: [],
      stationery: [],
    });
    setGameCompleted(false);
    setStats({
      correctPlacements: 0,
      totalAttempts: 0,
      accuracy: 100,
    });
    setFeedback("");
  };

  // ゲーム完了チェック
  useEffect(() => {
    if (availableItems.length === 0 && !gameCompleted) {
      setGameCompleted(true);
      const completionTime = Date.now() - startTime;
      setStats((prev) => ({ ...prev, completionTime }));
      showFeedback(getRandomMessage(gameConfig.completionMessages));
    }
  }, [availableItems.length, gameCompleted, startTime, showFeedback, getRandomMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
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
                おかたづけ ゲーム
              </h1>
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
        {/* 統計情報 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl bg-white p-4 shadow-lg"
        >
          <div className="flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <p className="text-gray-600">のこり</p>
              <p className="font-bold text-2xl text-blue-600">{availableItems.length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">せいかい</p>
              <p className="font-bold text-2xl text-green-600">{stats.correctPlacements}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">せいかくさ</p>
              <p className="font-bold text-2xl text-purple-600">{stats.accuracy}%</p>
            </div>
          </div>
        </motion.div>

        {/* フィードバック */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mb-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center font-bold text-white text-xl shadow-lg"
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
            <h2 className="mb-2 font-bold text-3xl">おかたづけ かんりょう！</h2>
            <p className="text-xl">
              じかん: {Math.round((stats.completionTime || 0) / 1000)}びょう
            </p>
          </motion.div>
        )}

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* アイテム一覧 */}
          {availableItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 rounded-2xl bg-white p-6 shadow-lg"
            >
              <h2 className="mb-4 text-center font-bold text-gray-800 text-xl">
                かたづける もの
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {availableItems.map((item) => (
                  <DraggableItem key={item.id} item={item} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ドロップゾーン */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-6 sm:grid-cols-2"
          >
            {dropZones.map((zone) => (
              <DropZoneArea
                key={zone.id}
                zone={zone}
                placedItems={placedItems[zone.id]}
                isOver={activeZone === zone.id}
              />
            ))}
          </motion.div>

          {/* ドラッグオーバーレイ */}
          <DragOverlay>{activeItem ? <DraggableItem item={activeItem} /> : null}</DragOverlay>
        </DndContext>

        {/* ヒント */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 rounded-xl bg-blue-100 p-4 shadow-lg"
        >
          <h3 className="mb-2 font-bold text-gray-800 text-lg">あそびかた</h3>
          <ul className="space-y-1 text-gray-700">
            <li>🎯 ものを ただしい ばしょに ドラッグしよう</li>
            <li>🧸 おもちゃは おもちゃばこへ</li>
            <li>🍎 たべものは れいぞうこへ</li>
            <li>👕 ふくは たんすへ</li>
            <li>✏️ ぶんぼうぐは つくえへ</li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
}
