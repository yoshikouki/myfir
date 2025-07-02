"use client";

import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getPlayerProgress,
  getProgressPercentage,
  type PlayerProgress,
} from "@/src/lib/level-system";

interface PlayerLevelProps {
  compact?: boolean;
  showTitle?: boolean;
  className?: string;
}

export function PlayerLevel({
  compact = false,
  showTitle = true,
  className = "",
}: PlayerLevelProps) {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(getPlayerProgress());
  }, []);

  // ハイドレーション完了まで何も表示しない
  if (!mounted || !progress) {
    return null;
  }

  const progressPercentage = getProgressPercentage(progress);

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-white shadow-lg ${className}`}
      >
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
        <span className="font-bold text-sm">Lv.{progress.level}</span>
        <div className="h-2 w-12 rounded-full bg-white/30">
          <motion.div
            className="h-full rounded-full bg-white"
            style={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-white p-4 shadow-lg ${className}`}
    >
      {/* レベルとタイトル */}
      <div className="mb-3 text-center">
        <div className="mb-1 flex items-center justify-center gap-1">
          <Star className="size-5 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-2xl text-gray-800">レベル {progress.level}</span>
        </div>
        {showTitle && <p className="font-medium text-gray-600 text-sm">{progress.title}</p>}
      </div>

      {/* 経験値バー */}
      <div className="mb-2">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-gray-600">
            <Zap className="size-3" />
            けいけんち
          </span>
          <span className="text-gray-500">
            {progress.experience} / {progress.nextLevelExp}
          </span>
        </div>
        <div className="h-3 rounded-full bg-gray-200 p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{ width: `${progressPercentage}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* 進捗情報 */}
      <div className="flex justify-between text-gray-500 text-xs">
        <span>つぎまで: {progress.nextLevelExp - progress.experience}</span>
        <span>がんばり: {progressPercentage}%</span>
      </div>

      {/* レベルアップが近い場合の励ましメッセージ */}
      {progressPercentage >= 80 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 p-2 text-center"
        >
          <p className="font-bold text-orange-600 text-xs">もうすこしで レベルアップ！ 🎉</p>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * リアルタイムで進捗を更新するためのhook
 */
export function usePlayerProgress() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);

  const refreshProgress = useCallback(() => {
    setProgress(getPlayerProgress());
  }, []);

  useEffect(() => {
    refreshProgress();

    // ストレージ変更を監視
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "myfir-player-progress") {
        refreshProgress();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshProgress]);

  return { progress, refreshProgress };
}
