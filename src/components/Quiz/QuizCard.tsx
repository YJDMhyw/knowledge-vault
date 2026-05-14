import { useEffect, useState } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { useQuizStore } from '../../context/QuizContext';
import styles from './QuizCard.module.css';

export default function QuizCard() {
  const {
    phase,
    quizItems,
    pushSequence,
    currentSequenceIndex,
    inputValue,
    setInputValue,
    revealAnswer,
    nextQuestion,
    markAsRead
  } = useQuizStore();

  const [fadeOut, setFadeOut] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const currentConceptIndex = pushSequence[currentSequenceIndex] ?? 0;
  const currentItem = quizItems[currentConceptIndex];

  useEffect(() => {
    if (phase === 'showing') {
      setFadeOut(false);
      setFadeIn(false);
    }
    if (phase === 'revealing') {
      const timer1 = setTimeout(() => setFadeOut(true), 0);
      const timer2 = setTimeout(() => setFadeIn(true), 600);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [phase, currentSequenceIndex]);

  const handleReveal = () => {
    revealAnswer();
  };

  const handleNext = () => {
    nextQuestion();
  };

  const handleMarkAsRead = () => {
    markAsRead();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (phase === 'showing') {
        handleReveal();
      }
    }
  };

  if (phase === 'idle') {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>点击下方按钮开始考核</p>
      </div>
    );
  }

  if (phase === 'completed') {
    return (
      <div className={styles.completed}>
        <div className={styles.completedIcon}>✓</div>
        <h2 className={styles.completedTitle}>本轮考核完成</h2>
        <p className={styles.completedSubtitle}>
          共 {quizItems.length} 个概念
        </p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.roundInfo}>
        <span className={styles.roundBadge}>
          第 {currentItem?.round + 1} 轮
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.conceptArea}>
          <div className={`${styles.concept} ${fadeOut ? styles.fadeOut : ''}`}>
            <div className={styles.conceptHeader}>
              <BookOpen size={18} className={styles.conceptIcon} />
              <span className={styles.conceptLabel}>概念</span>
            </div>
            <h2 className={styles.conceptText}>{currentItem?.concept.name}</h2>
          </div>

          <div className={`${styles.definition} ${fadeIn ? styles.fadeIn : ''}`}>
            <span className={styles.definitionLabel}>定义</span>
            <p className={styles.definitionText}>{currentItem?.concept.definition}</p>
          </div>
        </div>

        {phase === 'showing' && (
          <div className={styles.inputArea}>
            <textarea
              className={styles.input}
              placeholder="输入你的理解..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
            />
            <div className={styles.actions}>
              <button className={styles.readBtn} onClick={handleMarkAsRead}>
                <BookOpen size={16} />
                <span>阅</span>
              </button>
              <button className={styles.nextBtn} onClick={handleReveal}>
                <span>显示答案</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {phase === 'revealing' && (
          <div className={styles.revealActions}>
            <button className={styles.continueBtn} onClick={handleNext}>
              <span>继续</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}