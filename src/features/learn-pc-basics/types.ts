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