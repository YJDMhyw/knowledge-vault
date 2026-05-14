import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../context/AppContext';
import { useQuizStore } from '../context/QuizContext';
import { QuizCard } from '../components/Quiz';
import styles from './Quiz.module.css';

export default function Quiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get('categoryId');
  
  const { concepts, categories, updateConcept } = useAppStore();
  const { phase, startQuiz, resetQuiz, quizItems } = useQuizStore();

  const category = categories.find(c => c.id === categoryId);
  const categoryConcepts = categoryId 
    ? concepts.filter(c => c.categoryId === categoryId)
    : [];
  const unmasteredCount = categoryConcepts.filter(c => c.quizCount === 0).length;

  useEffect(() => {
    if (categoryId && phase === 'idle' && categoryConcepts.length > 0) {
      startQuiz(categoryConcepts, categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    if (phase === 'completed' && quizItems.length > 0) {
      quizItems.forEach(item => {
        updateConcept(item.concept.id, {
          quizCount: item.concept.quizCount + 1,
          correctCount: item.mastered || item.skipped 
            ? item.concept.correctCount + 1 
            : item.concept.correctCount
        });
      });
    }
  }, [phase]);

  const handleStartQuiz = () => {
    if (categoryConcepts.length > 0 && categoryId) {
      startQuiz(categoryConcepts, categoryId);
    }
  };

  const handleBack = () => {
    resetQuiz();
    navigate('/categories');
  };

  const handleRestart = () => {
    resetQuiz();
    if (categoryConcepts.length > 0 && categoryId) {
      startQuiz(categoryConcepts, categoryId);
    }
  };

  if (!categoryId) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>知识考核</h1>
        </header>
        <div className={styles.errorState}>
          <p className={styles.errorText}>请从目录页面选择要考核的次级目录</p>
          <button className={styles.backBtn} onClick={() => navigate('/categories')}>
            <ArrowLeft size={18} />
            <span>返回目录</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.headerBackBtn} onClick={handleBack}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {category?.name ? `${category.name}` : '知识考核'}
          </h1>
          <p className={styles.subtitle}>
            共 {unmasteredCount} 个未掌握概念
          </p>
        </div>
      </header>

      {phase === 'idle' ? (
        <div className={styles.startScreen}>
          <div className={styles.startCard}>
            <div className={styles.startIcon}>
              <GraduationCap size={48} />
            </div>
            <h2 className={styles.startTitle}>开始考核</h2>
            <p className={styles.startDesc}>
              从「{category?.name}」目录中随机抽取概念进行考核
            </p>
            {unmasteredCount > 0 ? (
              <button className={styles.startBtn} onClick={handleStartQuiz}>
                <GraduationCap size={18} />
                <span>开始考核</span>
              </button>
            ) : (
              <p className={styles.noData}>所有概念已掌握！</p>
            )}
          </div>
        </div>
      ) : phase === 'completed' ? (
        <div className={styles.resultScreen}>
          <QuizCard />
          <div className={styles.resultActions}>
            <button className={styles.restartBtn} onClick={handleRestart}>
              重新考核
            </button>
            <button className={styles.backToListBtn} onClick={handleBack}>
              返回目录
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.quizArea}>
          <QuizCard />
        </div>
      )}
    </div>
  );
}