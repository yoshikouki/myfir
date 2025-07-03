import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TypingLesson } from "../../types";
import { useTypingGame } from "../useTypingGame";

// PlayerContextのモック
vi.mock("@/src/contexts/PlayerContext", () => ({
  usePlayerActions: () => ({
    completeActivity: vi.fn().mockResolvedValue({
      leveledUp: false,
      progress: {
        level: 1,
        experience: 25,
        totalExperience: 25,
        nextLevelExp: 50,
        title: "はじめて の たんけんか",
        completedActivities: [],
        lastPlayDate: new Date().toISOString(),
      },
    }),
  }),
}));

describe("useTypingGame", () => {
  const mockLesson: TypingLesson = {
    id: "test-lesson",
    title: "テストレッスン",
    description: "テスト用のレッスンです",
    targetText: "いぬ",
    romajiText: "inu",
    level: "beginner",
    icon: "🐕",
    courseId: "animals",
  };

  const mockCallbacks = {
    onComplete: vi.fn(),
    onNext: vi.fn(),
    onLevelUp: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態が正しく設定される", () => {
    const { result } = renderHook(() =>
      useTypingGame({
        lesson: mockLesson,
        ...mockCallbacks,
      }),
    );

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.typedText).toBe("");
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.inputText).toBe("inu");
    expect(result.current.displayText).toBe("いぬ");
    expect(result.current.currentChar).toBe("i");
    expect(result.current.progress).toBe(0);
  });

  it("正しいキー入力でテキストが進む", () => {
    const { result } = renderHook(() =>
      useTypingGame({
        lesson: mockLesson,
        ...mockCallbacks,
      }),
    );

    act(() => {
      result.current.handleKeyPress("i");
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.typedText).toBe("i");
    expect(result.current.currentChar).toBe("n");
    expect(result.current.progress).toBeCloseTo(33.33, 1);
  });

  it("間違ったキー入力でも統計が更新される", () => {
    const { result } = renderHook(() =>
      useTypingGame({
        lesson: mockLesson,
        ...mockCallbacks,
      }),
    );

    act(() => {
      result.current.handleKeyPress("x"); // 間違ったキー
    });

    expect(result.current.currentIndex).toBe(0); // 進まない
    expect(result.current.typedText).toBe(""); // 進まない
    expect(result.current.stats.totalKeystrokes).toBe(1); // 統計は更新される
  });

  it("レッスン完了時にコールバックが呼ばれる", async () => {
    const { result } = renderHook(() =>
      useTypingGame({
        lesson: mockLesson,
        ...mockCallbacks,
      }),
    );

    // 全文字を入力
    act(() => {
      result.current.handleKeyPress("i");
    });
    act(() => {
      result.current.handleKeyPress("n");
    });

    // 最後の文字入力で完了になる
    await act(async () => {
      result.current.handleKeyPress("u");
      // handleCompletionは非同期なので少し待つ
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isCompleted).toBe(true);
    expect(result.current.progress).toBe(100);
    expect(mockCallbacks.onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        totalKeystrokes: 3,
        completionTime: expect.any(Number),
      }),
    );
  });

  it("完了後のスペースキーで次へ進む", async () => {
    const { result } = renderHook(() =>
      useTypingGame({
        lesson: mockLesson,
        ...mockCallbacks,
      }),
    );

    // 完了状態にする
    act(() => {
      result.current.handleKeyPress("i");
    });
    act(() => {
      result.current.handleKeyPress("n");
    });

    await act(async () => {
      result.current.handleKeyPress("u");
      // 完了処理の非同期処理を待つ
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(result.current.isCompleted).toBe(true);

    // スペースキーで次へ
    act(() => {
      result.current.handleKeyPress(" ");
    });

    expect(mockCallbacks.onNext).toHaveBeenCalled();
  });

  it("リセット機能が正しく動作する", () => {
    const { result } = renderHook(() =>
      useTypingGame({
        lesson: mockLesson,
        ...mockCallbacks,
      }),
    );

    // 進捗を作る
    act(() => {
      result.current.handleKeyPress("i");
      result.current.handleKeyPress("n");
    });

    // リセット
    act(() => {
      result.current.reset();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.typedText).toBe("");
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.stats.totalKeystrokes).toBe(0);
  });

  it("新しいレッスンでinputTextとdisplayTextが更新される", () => {
    const { result, rerender } = renderHook(
      ({ lesson }) =>
        useTypingGame({
          lesson,
          ...mockCallbacks,
        }),
      {
        initialProps: { lesson: mockLesson },
      },
    );

    // 進捗を作る
    act(() => {
      result.current.handleKeyPress("i");
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.typedText).toBe("i");

    // 新しいレッスン
    const newLesson: TypingLesson = {
      ...mockLesson,
      id: "new-lesson",
      targetText: "ねこ",
      romajiText: "neko",
    };

    rerender({ lesson: newLesson });

    // inputTextとdisplayTextは新しいレッスンの値に更新される
    expect(result.current.inputText).toBe("neko");
    expect(result.current.displayText).toBe("ねこ");
    // 状態は維持される（リセットされない）
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.typedText).toBe("i");
  });

  it("スペース文字の処理を確認する", () => {
    const lessonWithSpaces: TypingLesson = {
      ...mockLesson,
      targetText: "いぬ ねこ",
      romajiText: "inu neko",
    };

    const { result } = renderHook(() =>
      useTypingGame({
        lesson: lessonWithSpaces,
        ...mockCallbacks,
      }),
    );

    // 初期状態を確認
    expect(result.current.inputText).toBe("inu neko");
    expect(result.current.currentChar).toBe("i");

    // "inu"まで入力
    act(() => {
      result.current.handleKeyPress("i");
    });
    act(() => {
      result.current.handleKeyPress("n");
    });
    act(() => {
      result.current.handleKeyPress("u");
    });

    // "inu"入力後、インデックスは3になり、現在文字は' '（スペース）
    expect(result.current.currentIndex).toBe(3);
    expect(result.current.typedText).toBe("inu");
    expect(result.current.currentChar).toBe(" ");
  });
});
