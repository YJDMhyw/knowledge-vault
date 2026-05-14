import { create } from 'zustand';
import { Concept, Category, QuizRecord } from '../types';
import { saveData, loadData, generateId } from '../utils/storage';

interface AppState {
  concepts: Concept[];
  categories: Category[];
  quizRecords: QuizRecord[];
  selectedCategoryId: string | null;
  isLoading: boolean;
  addConcept: (concept: Omit<Concept, 'id' | 'createdAt' | 'updatedAt' | 'quizCount' | 'correctCount'>) => void;
  updateConcept: (id: string, updates: Partial<Concept>) => void;
  deleteConcept: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'order'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  selectCategory: (id: string | null) => void;
  addQuizRecord: (record: Omit<QuizRecord, 'id' | 'timestamp'>) => void;
  getConceptsByCategory: (categoryId: string | null) => Concept[];
  getRecentConcepts: (limit?: number) => Concept[];
  getTodayLearnedCount: () => number;
  getPendingReviewCount: () => number;
}

const initialCategories: Category[] = [
  {
    id: 'cat-philosophy',
    name: '哲学',
    parentId: null,
    order: 0,
    createdAt: Date.now()
  },
  {
    id: 'cat-philosophy-ancient',
    name: '古代哲学',
    parentId: 'cat-philosophy',
    order: 0,
    createdAt: Date.now()
  },
  {
    id: 'cat-philosophy-modern',
    name: '现代哲学',
    parentId: 'cat-philosophy',
    order: 1,
    createdAt: Date.now()
  },
  {
    id: 'cat-science',
    name: '科学',
    parentId: null,
    order: 1,
    createdAt: Date.now()
  },
  {
    id: 'cat-science-physics',
    name: '物理学',
    parentId: 'cat-science',
    order: 0,
    createdAt: Date.now()
  },
  {
    id: 'cat-literature',
    name: '文学',
    parentId: null,
    order: 2,
    createdAt: Date.now()
  }
];

const initialConcepts: Concept[] = [
  {
    id: 'concept-1',
    name: '存在',
    definition: '柏拉图提出的核心哲学概念，指超越具体事物的永恒不变的理念世界中的事物。',
    categoryId: 'cat-philosophy-ancient',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    quizCount: 5,
    correctCount: 3
  },
  {
    id: 'concept-2',
    name: '理念',
    definition: '柏拉图哲学中的核心理论，认为真实世界是由永恒不变的理念构成的，感官世界只是理念的不完美复制。',
    categoryId: 'cat-philosophy-ancient',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    quizCount: 3,
    correctCount: 2
  },
  {
    id: 'concept-3',
    name: '量子纠缠',
    definition: '两个或多个粒子之间存在的一种特殊关联，即使相隔很远，测量一个粒子的状态会瞬间影响另一个粒子的状态。',
    categoryId: 'cat-science-physics',
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
    quizCount: 8,
    correctCount: 6
  },
  {
    id: 'concept-4',
    name: '相对论',
    definition: '爱因斯坦提出的物理理论，包括狭义相对论和广义相对论，揭示了时间、空间和引力的本质关系。',
    categoryId: 'cat-science-physics',
    createdAt: Date.now() - 3600000 * 6,
    updatedAt: Date.now() - 3600000 * 6,
    quizCount: 2,
    correctCount: 1
  },
  {
    id: 'concept-5',
    name: '意识流',
    definition: '文学创作中的一种写作技巧，通过连续的思想流动来表现人物的内心世界，不受逻辑和语法约束。',
    categoryId: 'cat-literature',
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 3,
    quizCount: 0,
    correctCount: 0
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  concepts: loadData<Concept[]>('concepts') || initialConcepts,
  categories: loadData<Category[]>('categories') || initialCategories,
  quizRecords: loadData<QuizRecord[]>('quizRecords') || [],
  selectedCategoryId: null,
  isLoading: false,

  addConcept: (conceptData) => {
    const newConcept: Concept = {
      ...conceptData,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      quizCount: 0,
      correctCount: 0
    };
    set((state) => {
      const newConcepts = [...state.concepts, newConcept];
      saveData('concepts', newConcepts);
      return { concepts: newConcepts };
    });
  },

  updateConcept: (id, updates) => {
    set((state) => {
      const newConcepts = state.concepts.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
      );
      saveData('concepts', newConcepts);
      return { concepts: newConcepts };
    });
  },

  deleteConcept: (id) => {
    set((state) => {
      const newConcepts = state.concepts.filter((c) => c.id !== id);
      saveData('concepts', newConcepts);
      return { concepts: newConcepts };
    });
  },

  addCategory: (categoryData) => {
    const state = get();
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
      createdAt: Date.now(),
      order: state.categories.filter((c) => c.parentId === categoryData.parentId).length
    };
    set((state) => {
      const newCategories = [...state.categories, newCategory];
      saveData('categories', newCategories);
      return { categories: newCategories };
    });
  },

  updateCategory: (id, updates) => {
    set((state) => {
      const newCategories = state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      saveData('categories', newCategories);
      return { categories: newCategories };
    });
  },

  deleteCategory: (id) => {
    set((state) => {
      const idsToDelete = new Set<string>();
      const findChildren = (parentId: string) => {
        idsToDelete.add(parentId);
        state.categories
          .filter((c) => c.parentId === parentId)
          .forEach((c) => findChildren(c.id));
      };
      findChildren(id);

      const newCategories = state.categories.filter((c) => !idsToDelete.has(c.id));
      const newConcepts = state.concepts.filter((c) => !idsToDelete.has(c.categoryId));

      saveData('categories', newCategories);
      saveData('concepts', newConcepts);

      return {
        categories: newCategories,
        concepts: newConcepts,
        selectedCategoryId: state.selectedCategoryId === id ? null : state.selectedCategoryId
      };
    });
  },

  selectCategory: (id) => {
    set({ selectedCategoryId: id });
  },

  addQuizRecord: (recordData) => {
    const newRecord: QuizRecord = {
      ...recordData,
      id: generateId(),
      timestamp: Date.now()
    };
    set((state) => {
      const newRecords = [...state.quizRecords, newRecord];
      saveData('quizRecords', newRecords);

      const newConcepts = state.concepts.map((c) => {
        if (c.id === recordData.conceptId) {
          return {
            ...c,
            quizCount: c.quizCount + 1,
            correctCount: recordData.isCorrect ? c.correctCount + 1 : c.correctCount
          };
        }
        return c;
      });
      saveData('concepts', newConcepts);

      return { quizRecords: newRecords, concepts: newConcepts };
    });
  },

  getConceptsByCategory: (categoryId) => {
    const state = get();
    if (categoryId === null) {
      return state.concepts;
    }

    const categoryIds = new Set<string>();
    const collectCategoryIds = (id: string) => {
      categoryIds.add(id);
      state.categories
        .filter((c) => c.parentId === id)
        .forEach((c) => collectCategoryIds(c.id));
    };
    collectCategoryIds(categoryId);

    return state.concepts.filter((c) => categoryIds.has(c.categoryId));
  },

  getRecentConcepts: (limit = 5) => {
    const state = get();
    return [...state.concepts]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  },

  getTodayLearnedCount: () => {
    const state = get();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return state.quizRecords.filter((r) => r.timestamp >= todayStart.getTime()).length;
  },

  getPendingReviewCount: () => {
    const state = get();
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    return state.concepts.filter((c) => {
      if (c.quizCount === 0) return true;
      const lastQuiz = state.quizRecords
        .filter((r) => r.conceptId === c.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      return lastQuiz && lastQuiz.timestamp < threeDaysAgo;
    }).length;
  }
}));
