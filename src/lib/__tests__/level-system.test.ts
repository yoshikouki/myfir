import { beforeEach, describe, expect, it } from "vitest";
import {
  ACTIVITY_EXP_REWARDS,
  addExperience,
  completeActivity,
  getPlayerProgress,
  getProgressPercentage,
  resetProgress,
} from "../level-system";

describe("Level System", () => {
  beforeEach(() => {
    // 各テスト前にプログレスをリセット
    resetProgress();
  });

  it("should start with initial progress", () => {
    const progress = getPlayerProgress();
    expect(progress.level).toBe(1);
    expect(progress.experience).toBe(0);
    expect(progress.totalExperience).toBe(0);
    expect(progress.title).toBe("はじめて の たんけんか");
    expect(progress.completedActivities).toEqual([]);
  });

  it("should add experience correctly", () => {
    const result = addExperience({
      activity: "test-activity",
      baseExp: 20,
      bonusExp: 10,
    });

    expect(result.newProgress.totalExperience).toBe(30);
    expect(result.newProgress.experience).toBe(30);
    expect(result.leveledUp).toBe(false);
  });

  it("should level up when reaching threshold", () => {
    const result = addExperience({
      activity: "test-activity",
      baseExp: 60, // レベル2の閾値(50)を超える
    });

    expect(result.leveledUp).toBe(true);
    expect(result.newProgress.level).toBe(2);
    expect(result.newProgress.title).toBe("げんき な がくしゅうしゃ");
  });

  it("should complete activity and track first time bonus", () => {
    const result = completeActivity("typing-lesson-1", "typing-lesson-complete");

    expect(result.isFirstTime).toBe(true);
    expect(result.progress.completedActivities).toContain("typing-lesson-1");

    // 基本経験値 + 初回ボーナス
    const expectedExp =
      ACTIVITY_EXP_REWARDS["typing-lesson-complete"] +
      ACTIVITY_EXP_REWARDS["first-time-activity"];
    expect(result.progress.totalExperience).toBe(expectedExp);
  });

  it("should not give first time bonus on repeat", () => {
    // 初回完了
    completeActivity("typing-lesson-1", "typing-lesson-complete");

    // 2回目完了
    const result = completeActivity("typing-lesson-1", "typing-lesson-complete");

    expect(result.isFirstTime).toBe(false);
    // 基本経験値のみ（初回ボーナスなし）
    const expectedNewExp = ACTIVITY_EXP_REWARDS["typing-lesson-complete"];
    expect(result.progress.totalExperience).toBe(
      ACTIVITY_EXP_REWARDS["typing-lesson-complete"] +
        ACTIVITY_EXP_REWARDS["first-time-activity"] +
        expectedNewExp,
    );
  });

  it("should calculate progress percentage correctly", () => {
    const progress = getPlayerProgress();

    // 初期状態（レベル1、経験値0、次レベルまで50）
    expect(getProgressPercentage(progress)).toBe(0);

    // 25経験値追加（50%）
    addExperience({ activity: "test", baseExp: 25 });
    const updatedProgress = getPlayerProgress();
    expect(getProgressPercentage(updatedProgress)).toBe(50);
  });

  it("should handle multiple level ups", () => {
    // 大量の経験値でレベル3まで上がる
    const result = addExperience({
      activity: "big-achievement",
      baseExp: 150,
    });

    expect(result.leveledUp).toBe(true);
    expect(result.newProgress.level).toBe(3);
    expect(result.newProgress.title).toBe("すごい チャレンジャー");
  });
});
