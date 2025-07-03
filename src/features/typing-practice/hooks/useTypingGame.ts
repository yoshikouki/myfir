import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayerActions } from "@/src/contexts/PlayerContext";
import type { TypingLesson, TypingStats } from "../types";

interface UseTypingGameOptions {
  lesson: TypingLesson;
  onComplete: (stats: TypingStats) => void;
  onNext?: () => void;
  onLevelUp?: (data: { level: number; title: string }) => void;
}

interface TypingGameState {
  currentIndex: number;
  typedText: string;
  isCompleted: boolean;
  startTime: number | null;
  stats: TypingStats;
  lastPressedKey: string | undefined;
}

export function useTypingGame({ lesson, onComplete, onNext, onLevelUp }: UseTypingGameOptions) {
  const { completeActivity } = usePlayerActions();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<TypingGameState>({
    currentIndex: 0,
    typedText: "",
    isCompleted: false,
    startTime: null,
    stats: { totalKeystrokes: 0 },
    lastPressedKey: undefined,
  });

  // ローマ字テキストがある場合はそれを使用、なければ通常のテキスト
  const inputText = lesson.romajiText || lesson.targetText;
  const displayText = lesson.targetText; // 表示用は常にひらがな
  const currentChar = inputText[state.currentIndex];
  const progress = (state.currentIndex / inputText.length) * 100;

  // レッスンが変わったら状態をリセット
  useEffect(() => {
    setState({
      currentIndex: 0,
      typedText: "",
      isCompleted: false,
      startTime: null,
      stats: { totalKeystrokes: 0 },
      lastPressedKey: undefined,
    });
  }, []);

  // 初期状態でスペースがある場合は自動的にスキップ
  useEffect(() => {
    setState((prevState) => {
      let nextIndex = prevState.currentIndex;
      let updatedTypedText = prevState.typedText;

      // 現在位置から連続するスペースをすべてスキップ
      while (nextIndex < inputText.length && inputText[nextIndex] === " ") {
        updatedTypedText += " ";
        nextIndex++;
      }

      if (nextIndex !== prevState.currentIndex) {
        return {
          ...prevState,
          typedText: updatedTypedText,
          currentIndex: nextIndex,
        };
      }
      return prevState;
    });
  }, [inputText]);

  // 完了処理
  const handleCompletion = useCallback(
    async (stats: TypingStats) => {
      try {
        // レベルシステム統合 - パーフェクトスコア判定
        const isPerfect = stats.totalKeystrokes === inputText.length;
        const activityType = isPerfect ? "typing-perfect-score" : "typing-lesson-complete";

        // 経験値獲得とレベルアップチェック
        const result = await completeActivity(lesson.id, activityType);

        if (result.leveledUp && onLevelUp) {
          onLevelUp({
            level: result.progress.level,
            title: result.progress.title,
          });
        }

        onComplete(stats);
      } catch (error) {
        console.error("Failed to complete typing lesson:", error);
        // エラーが発生してもゲーム完了は続行
        onComplete(stats);
      }
    },
    [lesson.id, inputText.length, completeActivity, onComplete, onLevelUp],
  );

  // キー入力処理
  const handleKeyPress = useCallback(
    (key: string) => {
      setState((prevState) => {
        // 完了時はスペースキーで次へ進む
        if (prevState.isCompleted) {
          if (key === " " && onNext) {
            onNext();
          }
          return prevState;
        }

        const newState = { ...prevState };

        // 開始時間を記録
        if (!newState.startTime) {
          newState.startTime = Date.now();
        }

        // スペース文字は自動的にスキップ（連続するスペースも処理）
        let nextIndex = newState.currentIndex;
        let updatedTypedText = newState.typedText;

        // 現在位置から連続するスペースをすべてスキップ
        while (nextIndex < inputText.length && inputText[nextIndex] === " ") {
          updatedTypedText += " ";
          nextIndex++;
        }

        if (nextIndex !== newState.currentIndex) {
          newState.typedText = updatedTypedText;
          newState.currentIndex = nextIndex;
          return newState; // スペースをスキップした場合は統計を更新せずに次へ
        }

        // 統計を更新
        newState.stats = { ...newState.stats };
        newState.stats.totalKeystrokes++;

        if (key === currentChar) {
          // 正しいキー
          newState.typedText += key;
          newState.currentIndex++;

          // 完了チェック
          if (newState.currentIndex >= inputText.length) {
            newState.isCompleted = true;
            const completionTime = Date.now() - (newState.startTime || Date.now());
            newState.stats.completionTime = completionTime;

            // 非同期で完了処理を実行
            handleCompletion(newState.stats);
          }
        }

        return newState;
      });

      // キー表示をリセット
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setState((prevState) => ({ ...prevState, lastPressedKey: undefined }));
        timeoutRef.current = null;
      }, 100);
    },
    [currentChar, inputText, onNext, handleCompletion],
  );

  // リセット機能
  const reset = useCallback(() => {
    setState({
      currentIndex: 0,
      typedText: "",
      isCompleted: false,
      startTime: null,
      stats: { totalKeystrokes: 0 },
      lastPressedKey: undefined,
    });
  }, []);

  // キー押下の設定
  const setLastPressedKey = useCallback((key: string) => {
    setState((prevState) => ({ ...prevState, lastPressedKey: key }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    currentIndex: state.currentIndex,
    typedText: state.typedText,
    isCompleted: state.isCompleted,
    stats: state.stats,
    lastPressedKey: state.lastPressedKey,

    // Computed values
    inputText,
    displayText,
    currentChar,
    progress,

    // Actions
    handleKeyPress,
    reset,
    setLastPressedKey,
  };
}
