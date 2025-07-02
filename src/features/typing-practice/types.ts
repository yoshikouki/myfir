export interface TypingLesson {
  id: string;
  title: string;
  description: string;
  targetText: string;
  level: "beginner" | "intermediate" | "advanced";
  icon: string;
}

export interface TypingStats {
  totalKeystrokes: number;
  correctKeystrokes: number;
  accuracy: number;
  completionTime?: number;
}
