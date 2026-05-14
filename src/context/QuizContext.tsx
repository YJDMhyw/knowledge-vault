import { create } from 'zustand';
import { Concept } from '../types';
import { shuffleArray } from '../utils/storage';

interface QuizItem {
  concept: Concept;
  round: number;
  mastered: boolean;
  skipped: boolean;
  hasInput: boolean[];
}

type QuizPhase = 'idle' | 'showing' | 'revealing' | 'completed';

interface QuizState {
  phase: QuizPhase;
  quizItems: QuizItem[];
  pushSequence: number[];
  currentSequenceIndex: number;
  inputValue: string;
  categoryId: string | null;
  startQuiz: (concepts: Concept[], categoryId: string) => void;
  setInputValue: (value: string) => void;
  revealAnswer: () => void;
  nextQuestion: () => void;
  markAsRead: () => void;
  resetQuiz: () => void;
}

const MAX_QUIZ_COUNT = 10;

function generatePushSequence(count: number): number[] {
  if (count === 0) return [];
  
  const sequence: number[] = [];
  
  const round1: number[] = [];
  for (let i = 0; i < count; i++) {
    round1.push(i);
  }
  
  const round2: number[] = [];
  for (let i = 1; i < count; i++) {
    round2.push(i);
  }
  round2.push(0);
  
  let i = 0, j = 0;
  while (i < round1.length || j < round2.length) {
    if (i < round1.length) {
      sequence.push(round1[i]);
      i++;
    }
    if (j < round2.length) {
      sequence.push(round2[j]);
      j++;
    }
  }
  
  return sequence;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  phase: 'idle',
  quizItems: [],
  pushSequence: [],
  currentSequenceIndex: 0,
  inputValue: '',
  categoryId: null,

  startQuiz: (allConcepts, categoryId) => {
    const unmasteredConcepts = allConcepts.filter(c => c.quizCount === 0);
    
    if (unmasteredConcepts.length === 0) {
      return;
    }
    
    const shuffledConcepts = shuffleArray(unmasteredConcepts);
    const selectedConcepts = shuffledConcepts.slice(0, MAX_QUIZ_COUNT);
    
    const quizItems: QuizItem[] = selectedConcepts.map((concept) => ({
      concept,
      round: 0,
      mastered: false,
      skipped: false,
      hasInput: [false, false]
    }));
    
    const pushSequence = generatePushSequence(selectedConcepts.length);
    
    set({
      phase: 'showing',
      quizItems,
      pushSequence,
      currentSequenceIndex: 0,
      inputValue: '',
      categoryId
    });
  },

  setInputValue: (value) => {
    set({ inputValue: value });
  },

  revealAnswer: () => {
    const state = get();
    const { quizItems, pushSequence, currentSequenceIndex, inputValue } = state;
    
    if (currentSequenceIndex >= pushSequence.length) return;
    
    const conceptIndex = pushSequence[currentSequenceIndex];
    const currentItem = quizItems[conceptIndex];
    const currentRound = currentItem.round;
    
    const updatedItems = [...quizItems];
    const hasContent = inputValue.trim() !== '';
    
    updatedItems[conceptIndex] = {
      ...currentItem,
      hasInput: [
        currentRound === 0 ? hasContent : currentItem.hasInput[0],
        currentRound === 1 ? hasContent : currentItem.hasInput[1]
      ]
    };
    
    if (updatedItems[conceptIndex].hasInput[0] && updatedItems[conceptIndex].hasInput[1]) {
      updatedItems[conceptIndex].mastered = true;
    }
    
    set({
      quizItems: updatedItems,
      phase: 'revealing'
    });
  },

  nextQuestion: () => {
    const state = get();
    let { quizItems, pushSequence, currentSequenceIndex } = state;
    
    const currentConceptIndex = pushSequence[currentSequenceIndex];
    quizItems[currentConceptIndex].round++;
    
    currentSequenceIndex++;
    
    while (currentSequenceIndex < pushSequence.length) {
      const nextConceptIndex = pushSequence[currentSequenceIndex];
      const nextItem = quizItems[nextConceptIndex];
      
      if (nextItem.mastered || nextItem.skipped) {
        currentSequenceIndex++;
        continue;
      }
      
      break;
    }
    
    if (currentSequenceIndex >= pushSequence.length) {
      set({ phase: 'completed' });
      return;
    }
    
    set({
      quizItems: [...quizItems],
      currentSequenceIndex,
      phase: 'showing',
      inputValue: ''
    });
  },

  markAsRead: () => {
    const state = get();
    const { quizItems, pushSequence, currentSequenceIndex } = state;
    
    if (currentSequenceIndex >= pushSequence.length) return;
    
    const conceptIndex = pushSequence[currentSequenceIndex];
    const updatedItems = [...quizItems];
    
    updatedItems[conceptIndex] = {
      ...updatedItems[conceptIndex],
      mastered: true,
      skipped: true
    };
    
    set({ quizItems: updatedItems });
    
    state.nextQuestion();
  },

  resetQuiz: () => {
    set({
      phase: 'idle',
      quizItems: [],
      pushSequence: [],
      currentSequenceIndex: 0,
      inputValue: '',
      categoryId: null
    });
  }
}));