import type { TypingStats } from "../types";

/**
 * タイピング統計計算のユーティリティ関数群
 */

/**
 * WPM（Words Per Minute）を計算
 * 日本語の場合、一般的に1文字=1単語として計算
 */
export function calculateWPM(stats: TypingStats, textLength: number): number {
  if (!stats.completionTime || stats.completionTime === 0) return 0;

  const minutes = stats.completionTime / (1000 * 60);
  const words = textLength; // 日本語では文字数を単語数とする

  return Math.round(words / minutes);
}

/**
 * 正確性を計算（正解率）
 */
export function calculateAccuracy(stats: TypingStats, textLength: number): number {
  if (stats.totalKeystrokes === 0) return 0;

  const correctKeystrokes = textLength;
  const accuracy = (correctKeystrokes / stats.totalKeystrokes) * 100;

  return Math.round(accuracy * 10) / 10; // 小数点第1位まで
}

/**
 * 誤入力数を計算
 */
export function calculateErrors(stats: TypingStats, textLength: number): number {
  return Math.max(0, stats.totalKeystrokes - textLength);
}

/**
 * 完了時間を読みやすい形式にフォーマット
 */
export function formatCompletionTime(timeMs: number): string {
  const seconds = Math.round(timeMs / 1000);

  if (seconds < 60) {
    return `${seconds}びょう`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}ふん`;
  }

  return `${minutes}ふん${remainingSeconds}びょう`;
}

/**
 * パフォーマンス評価を取得
 * 子ども向けの励ましの表現
 */
export function getPerformanceGrade(
  accuracy: number,
  wpm: number,
): {
  grade: string;
  message: string;
  emoji: string;
} {
  if (accuracy >= 95 && wpm >= 10) {
    return {
      grade: "かんぺき！",
      message: "すごいじょうずに できたね！",
      emoji: "🏆",
    };
  }

  if (accuracy >= 90 && wpm >= 8) {
    return {
      grade: "とても よい！",
      message: "がんばって れんしゅうしたね！",
      emoji: "🌟",
    };
  }

  if (accuracy >= 80 && wpm >= 5) {
    return {
      grade: "よくできました！",
      message: "もう すこし れんしゅうしよう！",
      emoji: "👍",
    };
  }

  return {
    grade: "がんばったね！",
    message: "つぎも いっしょに がんばろう！",
    emoji: "💪",
  };
}

/**
 * 統計データを子ども向けにフォーマット
 */
export function formatStatsForChildren(stats: TypingStats, textLength: number) {
  const accuracy = calculateAccuracy(stats, textLength);
  const wpm = calculateWPM(stats, textLength);
  const errors = calculateErrors(stats, textLength);
  const performance = getPerformanceGrade(accuracy, wpm);

  return {
    accuracy,
    wpm,
    errors,
    performance,
    completionTime: stats.completionTime
      ? formatCompletionTime(stats.completionTime)
      : undefined,
  };
}
