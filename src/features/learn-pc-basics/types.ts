export interface PCPart {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface LearningProgress {
  userId?: string;
  completedParts: string[];
  currentPart?: string;
  lastAccessedAt: Date;
}

// マウスと仲良くなろうゲームの型定義
export interface MouseFriendStage {
  id: string;
  title: string;
  description: string;
  instruction: string;
  duration: number; // 秒
  targetCount?: number; // 必要な操作回数
  difficulty: "easy" | "medium" | "hard";
}

export interface MouseFriendProgress {
  currentStage: number;
  stagesCompleted: boolean[];
  totalStars: number;
  bestTimes: number[];
  unlockedStages: number;
}

export interface GameState {
  stage: number;
  isPlaying: boolean;
  score: number;
  timeLeft: number;
  currentTarget?: {
    x: number;
    y: number;
    id: string;
  };
}
