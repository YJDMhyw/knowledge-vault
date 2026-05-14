export interface Concept {
  id: string;
  name: string;
  definition: string;
  categoryId: string;
  createdAt: number;
  updatedAt: number;
  quizCount: number;
  correctCount: number;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  createdAt: number;
}

export interface QuizRecord {
  id: string;
  conceptId: string;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
  concepts: Concept[];
}
