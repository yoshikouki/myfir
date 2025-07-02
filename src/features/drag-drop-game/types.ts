export interface DragItem {
  id: string;
  name: string;
  emoji: string;
  category: string;
  color: string;
}

export interface DropZone {
  id: string;
  name: string;
  category: string;
  color: string;
  emoji: string;
}

export interface GameStats {
  correctPlacements: number;
  totalAttempts: number;
  accuracy: number;
  completionTime?: number;
}
