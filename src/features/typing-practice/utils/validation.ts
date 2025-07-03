import type {
  CourseId,
  LessonProgress,
  TypingCourse,
  TypingLesson,
  TypingSettings,
  TypingStats,
} from "../types";

/**
 * データバリデーション機能
 * 型安全性とデータ整合性を保証
 */

// エラークラス
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// 基本バリデーション関数
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0 && Number.isFinite(value);
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && Number.isFinite(value);
}

function _isValidUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isValidISODate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toISOString() === value;
}

// コースバリデーション
export function validateCourse(data: unknown): TypingCourse {
  if (!data || typeof data !== "object") {
    throw new ValidationError("コースデータが無効です");
  }

  const course = data as Partial<TypingCourse>;

  if (!isNonEmptyString(course.id)) {
    throw new ValidationError("コースIDが無効です", "id");
  }

  if (!isNonEmptyString(course.title)) {
    throw new ValidationError("コースタイトルが無効です", "title");
  }

  if (!isNonEmptyString(course.description)) {
    throw new ValidationError("コース説明が無効です", "description");
  }

  if (!isNonEmptyString(course.icon)) {
    throw new ValidationError("コースアイコンが無効です", "icon");
  }

  if (!isNonNegativeNumber(course.order)) {
    throw new ValidationError("コース順序が無効です", "order");
  }

  if (!isNonEmptyString(course.color)) {
    throw new ValidationError("コースカラーが無効です", "color");
  }

  if (
    !course.targetLevel ||
    !["beginner", "intermediate", "advanced"].includes(course.targetLevel)
  ) {
    throw new ValidationError("対象レベルが無効です", "targetLevel");
  }

  // オプショナルフィールドのバリデーション
  if (course.estimatedDuration !== undefined && !isPositiveNumber(course.estimatedDuration)) {
    throw new ValidationError("推定時間が無効です", "estimatedDuration");
  }

  if (course.prerequisites && !Array.isArray(course.prerequisites)) {
    throw new ValidationError("前提コースが無効です", "prerequisites");
  }

  if (course.tags && !Array.isArray(course.tags)) {
    throw new ValidationError("タグが無効です", "tags");
  }

  return course as TypingCourse;
}

// レッスンバリデーション
export function validateLesson(data: unknown): TypingLesson {
  if (!data || typeof data !== "object") {
    throw new ValidationError("レッスンデータが無効です");
  }

  const lesson = data as Partial<TypingLesson>;

  if (!isNonEmptyString(lesson.id)) {
    throw new ValidationError("レッスンIDが無効です", "id");
  }

  if (!isNonEmptyString(lesson.title)) {
    throw new ValidationError("レッスンタイトルが無効です", "title");
  }

  if (!isNonEmptyString(lesson.description)) {
    throw new ValidationError("レッスン説明が無効です", "description");
  }

  if (!isNonEmptyString(lesson.targetText)) {
    throw new ValidationError("対象テキストが無効です", "targetText");
  }

  if (!lesson.level || !["beginner", "intermediate", "advanced"].includes(lesson.level)) {
    throw new ValidationError("レベルが無効です", "level");
  }

  if (!isNonEmptyString(lesson.icon)) {
    throw new ValidationError("アイコンが無効です", "icon");
  }

  if (!isNonEmptyString(lesson.courseId)) {
    throw new ValidationError("コースIDが無効です", "courseId");
  }

  if (!isNonNegativeNumber(lesson.order)) {
    throw new ValidationError("順序が無効です", "order");
  }

  // オプショナルフィールドのバリデーション
  if (lesson.romajiText !== undefined && !isNonEmptyString(lesson.romajiText)) {
    throw new ValidationError("ローマ字テキストが無効です", "romajiText");
  }

  if (lesson.estimatedTime !== undefined && !isPositiveNumber(lesson.estimatedTime)) {
    throw new ValidationError("推定時間が無効です", "estimatedTime");
  }

  if (lesson.tags && !Array.isArray(lesson.tags)) {
    throw new ValidationError("タグが無効です", "tags");
  }

  return lesson as TypingLesson;
}

// 統計バリデーション
export function validateStats(data: unknown): TypingStats {
  if (!data || typeof data !== "object") {
    throw new ValidationError("統計データが無効です");
  }

  const stats = data as Partial<TypingStats>;

  if (!isNonNegativeNumber(stats.totalKeystrokes)) {
    throw new ValidationError("総キーストローク数が無効です", "totalKeystrokes");
  }

  // オプショナルフィールドのバリデーション
  if (stats.correctKeystrokes !== undefined && !isNonNegativeNumber(stats.correctKeystrokes)) {
    throw new ValidationError("正解キーストローク数が無効です", "correctKeystrokes");
  }

  if (
    stats.incorrectKeystrokes !== undefined &&
    !isNonNegativeNumber(stats.incorrectKeystrokes)
  ) {
    throw new ValidationError("不正解キーストローク数が無効です", "incorrectKeystrokes");
  }

  if (stats.completionTime !== undefined && !isPositiveNumber(stats.completionTime)) {
    throw new ValidationError("完了時間が無効です", "completionTime");
  }

  if (stats.startedAt !== undefined && !isValidISODate(stats.startedAt)) {
    throw new ValidationError("開始時刻が無効です", "startedAt");
  }

  if (stats.completedAt !== undefined && !isValidISODate(stats.completedAt)) {
    throw new ValidationError("完了時刻が無効です", "completedAt");
  }

  if (stats.wpm !== undefined && !isNonNegativeNumber(stats.wpm)) {
    throw new ValidationError("WPMが無効です", "wpm");
  }

  if (
    stats.accuracy !== undefined &&
    (typeof stats.accuracy !== "number" || stats.accuracy < 0 || stats.accuracy > 100)
  ) {
    throw new ValidationError("正確性が無効です（0-100%）", "accuracy");
  }

  if (stats.maxStreakLength !== undefined && !isNonNegativeNumber(stats.maxStreakLength)) {
    throw new ValidationError("最大連続正解数が無効です", "maxStreakLength");
  }

  return stats as TypingStats;
}

// 進捗バリデーション
export function validateLessonProgress(data: unknown): LessonProgress {
  if (!data || typeof data !== "object") {
    throw new ValidationError("レッスン進捗データが無効です");
  }

  const progress = data as Partial<LessonProgress>;

  if (!isNonEmptyString(progress.lessonId)) {
    throw new ValidationError("レッスンIDが無効です", "lessonId");
  }

  if (!isNonEmptyString(progress.courseId)) {
    throw new ValidationError("コースIDが無効です", "courseId");
  }

  if (typeof progress.isCompleted !== "boolean") {
    throw new ValidationError("完了状態が無効です", "isCompleted");
  }

  if (!isNonNegativeNumber(progress.attemptCount)) {
    throw new ValidationError("試行回数が無効です", "attemptCount");
  }

  // オプショナルフィールドのバリデーション
  if (progress.completedAt !== undefined && !isValidISODate(progress.completedAt)) {
    throw new ValidationError("完了時刻が無効です", "completedAt");
  }

  if (progress.lastAttemptAt !== undefined && !isValidISODate(progress.lastAttemptAt)) {
    throw new ValidationError("最終試行時刻が無効です", "lastAttemptAt");
  }

  if (progress.bestStats !== undefined) {
    validateStats(progress.bestStats);
  }

  return progress as LessonProgress;
}

// 設定バリデーション
export function validateSettings(data: unknown): TypingSettings {
  if (!data || typeof data !== "object") {
    throw new ValidationError("設定データが無効です");
  }

  const settings = data as Partial<TypingSettings>;

  if (typeof settings.soundEnabled !== "boolean") {
    throw new ValidationError("音声設定が無効です", "soundEnabled");
  }

  if (
    !settings.keyboardLayout ||
    !["qwerty", "dvorak", "colemak"].includes(settings.keyboardLayout)
  ) {
    throw new ValidationError("キーボードレイアウトが無効です", "keyboardLayout");
  }

  if (typeof settings.showKeyboardHints !== "boolean") {
    throw new ValidationError("キーボードヒント設定が無効です", "showKeyboardHints");
  }

  if (typeof settings.showProgressBar !== "boolean") {
    throw new ValidationError("進捗バー設定が無効です", "showProgressBar");
  }

  if (typeof settings.autoAdvance !== "boolean") {
    throw new ValidationError("自動進行設定が無効です", "autoAdvance");
  }

  if (!settings.theme || !["light", "dark", "auto"].includes(settings.theme)) {
    throw new ValidationError("テーマ設定が無効です", "theme");
  }

  return settings as TypingSettings;
}

// データ整合性チェック
export function validateDataConsistency(
  courses: TypingCourse[],
  lessons: TypingLesson[],
): void {
  const courseIds = new Set(courses.map((c) => c.id));
  const lessonsByCourse = new Map<CourseId, TypingLesson[]>();

  // レッスンのコースIDがコースに存在するかチェック
  for (const lesson of lessons) {
    if (!courseIds.has(lesson.courseId)) {
      throw new ValidationError(
        `レッスン ${lesson.id} のコースID ${lesson.courseId} が存在しません`,
      );
    }

    if (!lessonsByCourse.has(lesson.courseId)) {
      lessonsByCourse.set(lesson.courseId, []);
    }
    lessonsByCourse.get(lesson.courseId)?.push(lesson);
  }

  // 各コース内でのレッスン順序をチェック
  for (const [courseId, courseLessons] of lessonsByCourse) {
    const orders = courseLessons
      .map((l) => l.order)
      .filter((order): order is number => order !== undefined)
      .sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        throw new ValidationError(`コース ${courseId} のレッスン順序が不正です`);
      }
    }
  }
}

// 安全なJSONパース
export function safeJsonParse<T>(json: string, validator: (data: unknown) => T): T | null {
  try {
    const data = JSON.parse(json);
    return validator(data);
  } catch (error) {
    console.warn("JSONパースまたはバリデーションに失敗:", error);
    return null;
  }
}

// バッチバリデーション
export function validateCourses(data: unknown[]): TypingCourse[] {
  return data.map((item, index) => {
    try {
      return validateCourse(item);
    } catch (error) {
      throw new ValidationError(
        `コース ${index + 1}: ${error instanceof Error ? error.message : "不明なエラー"}`,
      );
    }
  });
}

export function validateLessons(data: unknown[]): TypingLesson[] {
  return data.map((item, index) => {
    try {
      return validateLesson(item);
    } catch (error) {
      throw new ValidationError(
        `レッスン ${index + 1}: ${error instanceof Error ? error.message : "不明なエラー"}`,
      );
    }
  });
}
