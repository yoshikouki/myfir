export interface Sound {
  id: string;
  name: string;
  emoji: string;
  audioFile: string;
  description: string;
  category: "instrument" | "animal" | "nature" | "transport";
}

export interface SoundCategory {
  id: string;
  name: string;
  emoji: string;
  sounds: Sound[];
  color: string;
}

export interface PlaybackState {
  currentSound: Sound | null;
  isPlaying: boolean;
  volume: number;
  duration: number;
  currentTime: number;
}
