// 基本的な識別子の型
export type CourseId = string;
export type LessonId = string;

// レベル定義
export type SkillLevel = "beginner" | "intermediate" | "advanced";

// スキルレベルのラベルマッピング
export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: "かんたん",
  intermediate: "ふつう",
  advanced: "むずかしい",
} as const;

// コースのテーマカラー定義
export type CourseColor =
  | "from-green-400 to-blue-500"
  | "from-pink-400 to-red-500"
  | "from-yellow-400 to-orange-500"
  | "from-purple-400 to-pink-500"
  | "from-indigo-400 to-purple-500";

// タイピングレッスンの詳細設定
export interface TypingLessonConfig {
  handUsage?: "left" | "right" | "both"; // 使用する手
  keyHighlight?: boolean; // キーハイライト表示
  enableHints?: boolean; // ヒント表示
  timeLimit?: number; // 制限時間（ミリ秒）
  targetAccuracy?: number; // 目標正確性（パーセント）
}

export interface TypingLesson {
  readonly id: LessonId;
  readonly title: string;
  readonly description: string;
  readonly targetText: string;
  readonly romajiText?: string; // ローマ字入力用のテキスト
  readonly level: SkillLevel;
  readonly icon: string;
  readonly courseId: CourseId;
  readonly order?: number; // コース内での順序
  readonly config?: TypingLessonConfig; // レッスン固有の設定
  readonly wordEmojis?: Record<string, string>; // 単語と絵文字のマッピング
  readonly estimatedTime?: number; // 推定完了時間（秒）
  readonly tags?: string[]; // 検索・フィルタリング用タグ
}

export interface TypingCourse {
  readonly id: CourseId;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly order: number; // 表示順序
  readonly color: CourseColor; // コースのテーマカラー
  readonly targetLevel: SkillLevel; // 対象レベル
  readonly estimatedDuration?: number; // 推定完了時間（分）
  readonly prerequisites?: CourseId[]; // 前提コース
  readonly tags?: string[]; // 検索・フィルタリング用タグ
}

// タイピング統計の詳細情報
export interface TypingStats {
  totalKeystrokes: number;
  correctKeystrokes?: number;
  incorrectKeystrokes?: number;
  completionTime?: number; // ミリ秒
  startedAt?: string; // ISO datetime
  completedAt?: string; // ISO datetime
  wpm?: number; // Words per minute
  accuracy?: number; // 正確性（パーセント）
  maxStreakLength?: number; // 最大連続正解数
}

// 進捗トラッキング
export interface LessonProgress {
  readonly lessonId: LessonId;
  readonly courseId: CourseId;
  readonly isCompleted: boolean;
  readonly completedAt?: string; // ISO datetime
  readonly bestStats?: TypingStats;
  readonly attemptCount: number;
  readonly lastAttemptAt?: string; // ISO datetime
}

export interface CourseProgress {
  readonly courseId: CourseId;
  readonly startedAt?: string; // ISO datetime
  readonly completedAt?: string; // ISO datetime
  readonly completedLessons: LessonId[];
  readonly totalLessons: number;
  readonly completionPercentage: number;
  readonly averageAccuracy?: number;
  readonly totalPracticeTime?: number; // 秒
}

// API レスポンス型
export interface TypingPracticeData {
  readonly courses: TypingCourse[];
  readonly lessons: TypingLesson[];
  readonly metadata?: {
    readonly version: string;
    readonly lastUpdated: string;
  };
}

// フィルタリング・検索オプション
export interface CourseFilter {
  readonly level?: SkillLevel;
  readonly tags?: string[];
  readonly completed?: boolean;
}

export interface LessonFilter {
  readonly courseId?: CourseId;
  readonly level?: SkillLevel;
  readonly completed?: boolean;
  readonly tags?: string[];
  readonly handUsage?: "left" | "right" | "both";
}

// ソートオプション
export type SortOrder = "asc" | "desc";

export interface SortOption<T = string> {
  readonly field: T;
  readonly order: SortOrder;
}

export type CourseSortField = "order" | "title" | "completionPercentage" | "estimatedDuration";
export type LessonSortField = "order" | "title" | "level" | "estimatedTime";

// ユーザー設定
export interface TypingSettings {
  readonly soundEnabled: boolean;
  readonly keyboardLayout: "qwerty" | "dvorak" | "colemak";
  readonly showKeyboardHints: boolean;
  readonly showProgressBar: boolean;
  readonly autoAdvance: boolean; // 自動で次のレッスンに進む
  readonly theme: "light" | "dark" | "auto";
}

// パフォーマンス評価
export interface PerformanceGrade {
  readonly grade: string;
  readonly message: string;
  readonly emoji: string;
  readonly score: number; // 0-100
}

// エラー処理
export interface TypingError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

// 型ガード関数
export function isValidCourseId(id: unknown): id is CourseId {
  return typeof id === "string" && id.length > 0;
}

export function isValidLessonId(id: unknown): id is LessonId {
  return typeof id === "string" && id.length > 0;
}

export function isValidSkillLevel(level: unknown): level is SkillLevel {
  return typeof level === "string" && level in SKILL_LEVEL_LABELS;
}

// 型安全なデータアクセス関数
export function getSkillLevelLabel(level: SkillLevel): string {
  return SKILL_LEVEL_LABELS[level];
}

// デフォルト値
export const DEFAULT_TYPING_SETTINGS: TypingSettings = {
  soundEnabled: true,
  keyboardLayout: "qwerty",
  showKeyboardHints: true,
  showProgressBar: true,
  autoAdvance: false,
  theme: "auto",
} as const;
