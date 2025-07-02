"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PlaybackState } from "../types";

interface AudioPlayerProps {
  playbackState: PlaybackState;
  onPlaybackStateChange: (state: Partial<PlaybackState>) => void;
}

export function AudioPlayer({ playbackState, onPlaybackStateChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // 音声ファイルの読み込みと再生制御
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playbackState.currentSound) return;

    // 新しい音声ファイルを設定
    if (audio.src !== playbackState.currentSound.audioFile) {
      audio.src = playbackState.currentSound.audioFile;
      audio.load();
    }

    // 再生/停止制御
    if (playbackState.isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // 自動再生がブロックされた場合の処理
          onPlaybackStateChange({ isPlaying: false });
        });
      }
    } else {
      audio.pause();
    }
  }, [playbackState.currentSound, playbackState.isPlaying, onPlaybackStateChange]);

  // 音量制御
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : playbackState.volume / 100;
    }
  }, [playbackState.volume, isMuted]);

  // 時間更新の処理
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      onPlaybackStateChange({
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
      });
    }
  }, [onPlaybackStateChange]);

  // 再生終了時の処理
  const handleEnded = useCallback(() => {
    onPlaybackStateChange({
      isPlaying: false,
      currentTime: 0,
    });
  }, [onPlaybackStateChange]);

  // 再生/停止ボタン
  const handlePlayPause = useCallback(() => {
    onPlaybackStateChange({ isPlaying: !playbackState.isPlaying });
  }, [playbackState.isPlaying, onPlaybackStateChange]);

  // リスタートボタン
  const handleRestart = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      onPlaybackStateChange({ currentTime: 0 });
    }
  }, [onPlaybackStateChange]);

  // 音量変更
  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      onPlaybackStateChange({ volume: newVolume });
    },
    [onPlaybackStateChange],
  );

  // ミュート切り替え
  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

  // 進捗バー計算
  const progress =
    playbackState.duration > 0 ? (playbackState.currentTime / playbackState.duration) * 100 : 0;

  // 時間フォーマット
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!playbackState.currentSound) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="-translate-x-1/2 fixed bottom-6 left-1/2 z-50 min-w-[320px] max-w-md rounded-3xl bg-white p-6 shadow-2xl"
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      >
        <track kind="captions" srcLang="ja" label="Japanese" />
      </audio>

      {/* 現在再生中の音 */}
      <div className="mb-4 text-center">
        <div className="mb-2 text-4xl">{playbackState.currentSound.emoji}</div>
        <h3 className="font-bold text-gray-800 text-lg">{playbackState.currentSound.name}</h3>
        <p className="text-gray-600 text-sm">{playbackState.currentSound.description}</p>
      </div>

      {/* 進捗バー */}
      <div className="mb-4">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="mt-1 flex justify-between text-gray-500 text-xs">
          <span>{formatTime(playbackState.currentTime)}</span>
          <span>{formatTime(playbackState.duration)}</span>
        </div>
      </div>

      {/* コントロールボタン */}
      <div className="mb-4 flex items-center justify-center gap-4">
        <motion.button
          onClick={handleRestart}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <RotateCcw className="size-5 text-gray-700" />
        </motion.button>

        <motion.button
          onClick={handlePlayPause}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
            playbackState.isPlaying
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {playbackState.isPlaying ? (
            <Pause className="size-8 text-white" />
          ) : (
            <Play className="ml-1 size-8 text-white" />
          )}
        </motion.button>

        <motion.button
          onClick={handleMuteToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
        >
          {isMuted ? (
            <VolumeX className="size-5 text-gray-700" />
          ) : (
            <Volume2 className="size-5 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* 音量スライダー */}
      <div className="flex items-center gap-3">
        <Volume2 className="size-4 text-gray-500" />
        <input
          type="range"
          min="0"
          max="100"
          value={playbackState.volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
          style={{
            background: `linear-gradient(to right, #10B981 0%, #10B981 ${playbackState.volume}%, #E5E7EB ${playbackState.volume}%, #E5E7EB 100%)`,
          }}
        />
        <span className="w-8 text-right text-gray-500 text-sm">
          {Math.round(playbackState.volume)}
        </span>
      </div>
    </motion.div>
  );
}
