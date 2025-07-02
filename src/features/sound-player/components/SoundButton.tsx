"use client";

import { motion } from "framer-motion";
import { Pause, Play, Volume2 } from "lucide-react";
import { useCallback } from "react";
import type { Sound } from "../types";

interface SoundButtonProps {
  sound: Sound;
  isPlaying: boolean;
  isCurrentSound: boolean;
  onPlay: (sound: Sound) => void;
  onPause: () => void;
  categoryColor: string;
}

export function SoundButton({
  sound,
  isPlaying,
  isCurrentSound,
  onPlay,
  onPause,
  categoryColor,
}: SoundButtonProps) {
  const handleClick = useCallback(() => {
    if (isCurrentSound && isPlaying) {
      onPause();
    } else {
      onPlay(sound);
    }
  }, [isCurrentSound, isPlaying, onPlay, onPause, sound]);

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`group relative min-h-[120px] w-full`}
    >
      <div
        className={`rounded-3xl bg-gradient-to-br ${categoryColor} p-1 shadow-lg transition-all duration-300 ${
          isCurrentSound && isPlaying
            ? "shadow-2xl ring-4 ring-white ring-opacity-60"
            : "hover:shadow-xl"
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl bg-white p-6">
          {/* 再生状態の視覚フィードバック */}
          {isCurrentSound && isPlaying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-200 to-blue-200"
            />
          )}

          {/* 音の絵文字 */}
          <div className="relative z-10 mb-3 text-5xl">{sound.emoji}</div>

          {/* 音の名前 */}
          <h3 className="relative z-10 mb-2 font-bold text-gray-800 text-lg">{sound.name}</h3>

          {/* 説明 */}
          <p className="relative z-10 mb-4 text-gray-600 text-sm">{sound.description}</p>

          {/* 再生ボタン */}
          <div className="relative z-10 flex items-center justify-center">
            <div
              className={`rounded-full p-3 transition-all duration-300 ${
                isCurrentSound && isPlaying
                  ? "bg-red-500"
                  : "bg-green-500 group-hover:bg-green-600"
              }`}
            >
              {isCurrentSound && isPlaying ? (
                <Pause className="size-6 text-white" />
              ) : (
                <Play className="ml-1 size-6 text-white" />
              )}
            </div>
          </div>

          {/* サウンドアイコン */}
          <div className="absolute top-3 right-3">
            <Volume2
              className={`size-5 transition-colors duration-300 ${
                isCurrentSound && isPlaying ? "text-green-500" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
