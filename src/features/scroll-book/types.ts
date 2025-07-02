export interface BookPage {
  id: string;
  title: string;
  content: string;
  illustration: string;
  backgroundColor: string;
  textColor: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  pages: BookPage[];
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number;
}

export interface ReadingProgress {
  currentPage: number;
  scrollProgress: number;
  timeSpent: number;
  completed: boolean;
}
