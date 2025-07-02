export interface Animal {
  id: string;
  name: string;
  emoji: string;
  sound: string;
  habitat: string;
  color: string;
}

export interface GameLevel {
  id: string;
  name: string;
  description: string;
  animals: Animal[];
  timeLimit: number;
  targetCount: number;
}

export interface GameStats {
  score: number;
  foundAnimals: string[];
  timeRemaining: number;
  accuracy: number;
  completionTime?: number;
}
