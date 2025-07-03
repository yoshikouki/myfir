import { describe, expect, it } from "vitest";
import type { TypingStats } from "../../types";
import {
  calculateAccuracy,
  calculateErrors,
  calculateWPM,
  formatCompletionTime,
  formatStatsForChildren,
  getPerformanceGrade,
} from "../typingStats";

describe("typingStats utilities", () => {
  describe("calculateWPM", () => {
    it("正しくWPMを計算する", () => {
      const stats: TypingStats = {
        totalKeystrokes: 5,
        completionTime: 60000, // 1分
      };
      const textLength = 5;

      const wpm = calculateWPM(stats, textLength);
      expect(wpm).toBe(5); // 5文字 / 1分 = 5WPM
    });

    it("完了時間が0の場合は0を返す", () => {
      const stats: TypingStats = {
        totalKeystrokes: 5,
        completionTime: 0,
      };
      const textLength = 5;

      const wpm = calculateWPM(stats, textLength);
      expect(wpm).toBe(0);
    });

    it("完了時間がない場合は0を返す", () => {
      const stats: TypingStats = {
        totalKeystrokes: 5,
      };
      const textLength = 5;

      const wpm = calculateWPM(stats, textLength);
      expect(wpm).toBe(0);
    });
  });

  describe("calculateAccuracy", () => {
    it("完璧な入力の場合は100%を返す", () => {
      const stats: TypingStats = {
        totalKeystrokes: 5,
      };
      const textLength = 5;

      const accuracy = calculateAccuracy(stats, textLength);
      expect(accuracy).toBe(100);
    });

    it("間違いがある場合は正しい正確性を計算する", () => {
      const stats: TypingStats = {
        totalKeystrokes: 8, // 5文字 + 3つの間違い
      };
      const textLength = 5;

      const accuracy = calculateAccuracy(stats, textLength);
      expect(accuracy).toBe(62.5); // (5/8) * 100 = 62.5%
    });

    it("キーストロークが0の場合は0を返す", () => {
      const stats: TypingStats = {
        totalKeystrokes: 0,
      };
      const textLength = 5;

      const accuracy = calculateAccuracy(stats, textLength);
      expect(accuracy).toBe(0);
    });
  });

  describe("calculateErrors", () => {
    it("エラー数を正しく計算する", () => {
      const stats: TypingStats = {
        totalKeystrokes: 8,
      };
      const textLength = 5;

      const errors = calculateErrors(stats, textLength);
      expect(errors).toBe(3); // 8 - 5 = 3エラー
    });

    it("エラーがない場合は0を返す", () => {
      const stats: TypingStats = {
        totalKeystrokes: 5,
      };
      const textLength = 5;

      const errors = calculateErrors(stats, textLength);
      expect(errors).toBe(0);
    });

    it("負の値にならない", () => {
      const stats: TypingStats = {
        totalKeystrokes: 3,
      };
      const textLength = 5;

      const errors = calculateErrors(stats, textLength);
      expect(errors).toBe(0); // 負の値ではなく0
    });
  });

  describe("formatCompletionTime", () => {
    it("秒のみの場合", () => {
      expect(formatCompletionTime(30000)).toBe("30びょう");
      expect(formatCompletionTime(1000)).toBe("1びょう");
    });

    it("分のみの場合", () => {
      expect(formatCompletionTime(60000)).toBe("1ふん");
      expect(formatCompletionTime(120000)).toBe("2ふん");
    });

    it("分と秒の場合", () => {
      expect(formatCompletionTime(90000)).toBe("1ふん30びょう");
      expect(formatCompletionTime(135000)).toBe("2ふん15びょう");
    });
  });

  describe("getPerformanceGrade", () => {
    it("最高グレードを返す", () => {
      const grade = getPerformanceGrade(98, 15);
      expect(grade.grade).toBe("かんぺき！");
      expect(grade.emoji).toBe("🏆");
    });

    it("とても良いグレードを返す", () => {
      const grade = getPerformanceGrade(92, 9);
      expect(grade.grade).toBe("とても よい！");
      expect(grade.emoji).toBe("🌟");
    });

    it("良いグレードを返す", () => {
      const grade = getPerformanceGrade(85, 6);
      expect(grade.grade).toBe("よくできました！");
      expect(grade.emoji).toBe("👍");
    });

    it("基本グレードを返す", () => {
      const grade = getPerformanceGrade(70, 3);
      expect(grade.grade).toBe("がんばったね！");
      expect(grade.emoji).toBe("💪");
    });
  });

  describe("formatStatsForChildren", () => {
    it("完全な統計情報をフォーマットする", () => {
      const stats: TypingStats = {
        totalKeystrokes: 8,
        completionTime: 90000,
      };
      const textLength = 5;

      const formatted = formatStatsForChildren(stats, textLength);

      expect(formatted.accuracy).toBe(62.5);
      expect(formatted.wpm).toBe(3); // 5文字 / 1.5分 ≈ 3.33 → 3
      expect(formatted.errors).toBe(3);
      expect(formatted.completionTime).toBe("1ふん30びょう");
      expect(formatted.performance.grade).toBe("がんばったね！");
    });

    it("完了時間がない場合", () => {
      const stats: TypingStats = {
        totalKeystrokes: 5,
      };
      const textLength = 5;

      const formatted = formatStatsForChildren(stats, textLength);

      expect(formatted.accuracy).toBe(100);
      expect(formatted.wpm).toBe(0);
      expect(formatted.errors).toBe(0);
      expect(formatted.completionTime).toBeUndefined();
      expect(formatted.performance.grade).toBe("がんばったね！");
    });
  });
});
