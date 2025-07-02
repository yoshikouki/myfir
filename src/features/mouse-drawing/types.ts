export interface Point {
  x: number;
  y: number;
}

export interface DrawingSettings {
  color: string;
  size: number;
}

export interface DrawingPath {
  points: Point[];
  settings: DrawingSettings;
}
