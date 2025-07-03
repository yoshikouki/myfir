import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypingPracticeProvider, useTypingPractice } from "../TypingPracticeContext";

// LocalStorageのモック
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// データモジュールのモック
vi.mock("../../data", () => ({
  typingCourses: [
    {
      id: "test-course",
      title: "テストコース",
      description: "テスト用のコース",
      icon: "🧪",
      order: 1,
      color: "from-blue-400 to-green-500",
    },
  ],
  typingLessons: [
    {
      id: "test-lesson-1",
      title: "レッスン1",
      description: "最初のレッスン",
      targetText: "いぬ",
      romajiText: "inu",
      level: "beginner",
      icon: "🐕",
      courseId: "test-course",
    },
    {
      id: "test-lesson-2",
      title: "レッスン2",
      description: "2番目のレッスン",
      targetText: "ねこ",
      romajiText: "neko",
      level: "beginner",
      icon: "🐱",
      courseId: "test-course",
    },
  ],
}));

describe("TypingPracticeContext", () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TypingPracticeProvider>{children}</TypingPracticeProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("初期状態が正しく設定される", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    expect(result.current.state.courses).toHaveLength(1);
    expect(result.current.state.lessons).toHaveLength(2);
    expect(result.current.state.currentCourse).toBeNull();
    expect(result.current.state.currentLesson).toBeNull();
    expect(result.current.state.completedLessons).toEqual([]);
    expect(result.current.state.isLoading).toBe(false);
  });

  it("コースを設定できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const course = result.current.state.courses[0];

    act(() => {
      result.current.actions.setCourse(course);
    });

    expect(result.current.state.currentCourse).toBe(course);
    expect(result.current.state.currentLesson).toBeNull(); // レッスンはクリアされる
  });

  it("レッスンを設定できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const lesson = result.current.state.lessons[0];

    act(() => {
      result.current.actions.setLesson(lesson);
    });

    expect(result.current.state.currentLesson).toBe(lesson);
  });

  it("レッスンを完了できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const lessonId = "test-lesson-1";
    const stats = { totalKeystrokes: 5, completionTime: 30000 };

    act(() => {
      result.current.actions.completeLesson(lessonId, stats);
    });

    expect(result.current.state.completedLessons).toContain(lessonId);
    expect(result.current.state.recentStats[lessonId]).toEqual(stats);
  });

  it("重複したレッスン完了は追加されない", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const lessonId = "test-lesson-1";
    const stats = { totalKeystrokes: 5 };

    act(() => {
      result.current.actions.completeLesson(lessonId, stats);
      result.current.actions.completeLesson(lessonId, stats); // 重複
    });

    expect(result.current.state.completedLessons).toEqual([lessonId]);
  });

  it("進捗をリセットできる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    // まず進捗を作る
    act(() => {
      result.current.actions.completeLesson("test-lesson-1", { totalKeystrokes: 5 });
      result.current.actions.setCourse(result.current.state.courses[0]);
      result.current.actions.setLesson(result.current.state.lessons[0]);
    });

    // リセット
    act(() => {
      result.current.actions.resetProgress();
    });

    expect(result.current.state.completedLessons).toEqual([]);
    expect(result.current.state.recentStats).toEqual({});
    expect(result.current.state.currentCourse).toBeNull();
    expect(result.current.state.currentLesson).toBeNull();
  });

  it("コースのレッスンを取得できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const courseLessons = result.current.actions.getCourseLessons("test-course");

    expect(courseLessons).toHaveLength(2);
    expect(courseLessons[0].courseId).toBe("test-course");
    expect(courseLessons[1].courseId).toBe("test-course");
  });

  it("次のレッスンを取得できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const nextLesson = result.current.actions.getNextLesson("test-lesson-1", "test-course");

    expect(nextLesson?.id).toBe("test-lesson-2");
  });

  it("最後のレッスンの次はnullを返す", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const nextLesson = result.current.actions.getNextLesson("test-lesson-2", "test-course");

    expect(nextLesson).toBeNull();
  });

  it("前のレッスンを取得できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const prevLesson = result.current.actions.getPreviousLesson("test-lesson-2", "test-course");

    expect(prevLesson?.id).toBe("test-lesson-1");
  });

  it("最初のレッスンの前はnullを返す", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    const prevLesson = result.current.actions.getPreviousLesson("test-lesson-1", "test-course");

    expect(prevLesson).toBeNull();
  });

  it("レッスン完了状況を確認できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    expect(result.current.actions.isLessonCompleted("test-lesson-1")).toBe(false);

    act(() => {
      result.current.actions.completeLesson("test-lesson-1", { totalKeystrokes: 5 });
    });

    expect(result.current.actions.isLessonCompleted("test-lesson-1")).toBe(true);
    expect(result.current.actions.isLessonCompleted("test-lesson-2")).toBe(false);
  });

  it("コースの進捗を取得できる", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    // 最初の状態
    let progress = result.current.actions.getCourseProgress("test-course");
    expect(progress).toEqual({
      completed: 0,
      total: 2,
      percentage: 0,
    });

    // 1つ完了
    act(() => {
      result.current.actions.completeLesson("test-lesson-1", { totalKeystrokes: 5 });
    });

    progress = result.current.actions.getCourseProgress("test-course");
    expect(progress).toEqual({
      completed: 1,
      total: 2,
      percentage: 50,
    });

    // 全て完了
    act(() => {
      result.current.actions.completeLesson("test-lesson-2", { totalKeystrokes: 5 });
    });

    progress = result.current.actions.getCourseProgress("test-course");
    expect(progress).toEqual({
      completed: 2,
      total: 2,
      percentage: 100,
    });
  });

  it("LocalStorageから進捗を復元できる", () => {
    // LocalStorageに既存データを設定
    const completedLessons = ["test-lesson-1"];
    const recentStats = {
      "test-lesson-1": { totalKeystrokes: 5, completionTime: 30000 },
    };

    mockLocalStorage.setItem(
      "myfir-typing-completed-lessons",
      JSON.stringify(completedLessons),
    );
    mockLocalStorage.setItem("myfir-typing-recent-stats", JSON.stringify(recentStats));

    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    expect(result.current.state.completedLessons).toContain("test-lesson-1");
    expect(result.current.state.recentStats["test-lesson-1"]).toEqual(
      recentStats["test-lesson-1"],
    );
  });

  it("進捗変更時にLocalStorageに保存される", () => {
    const { result } = renderHook(() => useTypingPractice(), { wrapper });

    act(() => {
      result.current.actions.completeLesson("test-lesson-1", { totalKeystrokes: 5 });
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "myfir-typing-completed-lessons",
      JSON.stringify(["test-lesson-1"]),
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "myfir-typing-recent-stats",
      JSON.stringify({ "test-lesson-1": { totalKeystrokes: 5 } }),
    );
  });
});
