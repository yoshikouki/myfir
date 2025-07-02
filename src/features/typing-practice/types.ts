export interface TypingLesson {
  id: string;
  title: string;
  description: string;
  targetText: string;
  romajiText?: string; // ローマ字入力用のテキスト
  level: "beginner" | "intermediate" | "advanced";
  icon: string;
}

export interface TypingStats {
  totalKeystrokes: number;
  completionTime?: number;
}
