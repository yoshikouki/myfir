"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Home, Trophy } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { completionMessages, encouragementMessages, soundCategories } from "../data";
import type { PlaybackState, Sound, SoundCategory } from "../types";
import { AudioPlayer } from "./AudioPlayer";
import { CategorySelector } from "./CategorySelector";
import { SoundButton } from "./SoundButton";

export function SoundPlayer() {
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentSound: null,
    isPlaying: false,
    volume: 75,
    duration: 0,
    currentTime: 0,
  });
  const [playedSounds, setPlayedSounds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string>("");

  const showFeedback = useCallback((message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(""), 3000);
  }, []);

  const getRandomMessage = useCallback((messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  const handleCategorySelect = useCallback((category: SoundCategory) => {
    setSelectedCategory(category);
    setPlaybackState((prev) => ({
      ...prev,
      currentSound: null,
      isPlaying: false,
    }));
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
    setPlaybackState((prev) => ({
      ...prev,
      currentSound: null,
      isPlaying: false,
    }));
  }, []);

  const handlePlaySound = useCallback(
    (sound: Sound) => {
      // 新しい音を再生する前に、前の音を記録
      if (!playedSounds.has(sound.id)) {
        setPlayedSounds((prev) => new Set([...prev, sound.id]));
        showFeedback(getRandomMessage(encouragementMessages));
      }

      setPlaybackState((prev) => ({
        ...prev,
        currentSound: sound,
        isPlaying: true,
        currentTime: 0,
      }));

      // 全ての音を聞いたかチェック
      const totalSounds = soundCategories.reduce((total, cat) => total + cat.sounds.length, 0);
      if (playedSounds.size + 1 >= totalSounds) {
        setTimeout(() => {
          showFeedback(getRandomMessage(completionMessages));
        }, 2000);
      }
    },
    [playedSounds, showFeedback, getRandomMessage],
  );

  const handlePauseSound = useCallback(() => {
    setPlaybackState((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  const handlePlaybackStateChange = useCallback((newState: Partial<PlaybackState>) => {
    setPlaybackState((prev) => ({ ...prev, ...newState }));
  }, []);

  const totalSounds = soundCategories.reduce((total, cat) => total + cat.sounds.length, 0);
  const progressPercentage = Math.round((playedSounds.size / totalSounds) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 pb-32">
      {/* ヘッダー */}
      <header className="bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {selectedCategory ? (
                <motion.button
                  onClick={handleBackToCategories}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-2 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">もどる</span>
                </motion.button>
              ) : (
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <Home className="size-4" />
                    <span className="hidden sm:inline">ホームに もどる</span>
                  </motion.button>
                </Link>
              )}
              <h1 className="font-bold text-2xl text-gray-800 sm:text-3xl">
                {selectedCategory ? selectedCategory.name : "がっきを ならそう"}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* フィードバック */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="-translate-x-1/2 fixed top-24 left-1/2 z-50 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 p-4 font-bold text-white text-xl shadow-xl"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* メインコンテンツ */}
      <main className="p-6">
        <div className="mx-auto max-w-6xl">
          {!selectedCategory ? (
            /* カテゴリー選択画面 */
            <>
              {/* 説明セクション */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 rounded-3xl bg-white p-8 shadow-lg"
              >
                <div className="text-center">
                  <div className="mb-4 text-6xl">🎵</div>
                  <h2 className="mb-4 font-bold text-3xl text-gray-800">
                    どんな おとを きいてみる？
                  </h2>
                  <p className="text-gray-600 text-lg">
                    すきな カテゴリーを えらんで いろいろな おとを きいてみよう！
                  </p>
                </div>
              </motion.div>

              {/* カテゴリー選択 */}
              <CategorySelector
                categories={soundCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />

              {/* 進捗表示 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 rounded-2xl bg-white p-6 shadow-lg"
              >
                <h3 className="mb-4 font-bold text-gray-800 text-xl">きいた おとの かず</h3>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-gray-600">
                    きいた おと: {playedSounds.size} / {totalSounds}
                  </span>
                  <span className="font-bold text-green-600 text-lg">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="h-4 rounded-full bg-gray-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                    style={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {playedSounds.size === totalSounds && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 text-center"
                  >
                    <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 p-4 font-bold text-white text-xl shadow-lg">
                      <Trophy className="size-6" />
                      <span>🎉 サウンド マスター おめでとう！ 🎉</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </>
          ) : (
            /* サウンド一覧画面 */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {selectedCategory.sounds.map((sound, index) => (
                <motion.div
                  key={sound.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SoundButton
                    sound={sound}
                    isPlaying={playbackState.isPlaying}
                    isCurrentSound={playbackState.currentSound?.id === sound.id}
                    onPlay={handlePlaySound}
                    onPause={handlePauseSound}
                    categoryColor={selectedCategory.color}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* オーディオプレイヤー */}
      <AudioPlayer
        playbackState={playbackState}
        onPlaybackStateChange={handlePlaybackStateChange}
      />
    </div>
  );
}
