export interface TypingLesson {
  id: string;
  title: string;
  description: string;
  targetText: string;
  romajiText?: string; // ローマ字入力用のテキスト
  level: "beginner" | "intermediate" | "advanced";
  icon: string;
  courseId?: string; // 所属するコースのID
  wordEmojis?: Record<string, string>; // 単語と絵文字のマッピング
}

export interface TypingCourse {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number; // 表示順序
  color: string; // コースのテーマカラー
}

export interface TypingStats {
  totalKeystrokes: number;
  completionTime?: number;
}
