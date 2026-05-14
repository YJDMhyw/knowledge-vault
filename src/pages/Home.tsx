import { useNavigate } from 'react-router-dom';
import { GraduationCap, Plus, Clock, BookOpen, Target, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useAppStore } from '../context/AppContext';
import { ConceptCard } from '../components/Concept';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { concepts, getRecentConcepts, getTodayLearnedCount, getPendingReviewCount } = useAppStore();

  const totalConcepts = concepts.length;
  const todayLearned = getTodayLearnedCount();
  const pendingReview = getPendingReviewCount();
  const recentConcepts = getRecentConcepts(5);

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  const handleAddConcept = () => {
    navigate('/categories');
  };

  const handleBrowseCategories = () => {
    navigate('/categories');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.welcome}>
          <div className={styles.welcomeIcon}>
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className={styles.title}>欢迎回来</h1>
            <p className={styles.subtitle}>继续你的知识探索之旅</p>
          </div>
        </div>
      </header>

      <section className={styles.stats}>
        <div className={`${styles.statCard} ${styles.statPrimary}`}>
          <div className={styles.statIcon}>
            <BookOpen size={28} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalConcepts}</span>
            <span className={styles.statLabel}>总概念</span>
          </div>
          <div className={styles.statDecoration}></div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={28} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{todayLearned}</span>
            <span className={styles.statLabel}>今日学习</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={28} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{pendingReview}</span>
            <span className={styles.statLabel}>待复习</span>
          </div>
        </div>
      </section>

      <section className={styles.quickAction}>
        <div className={styles.quickActionContent}>
          <div className={styles.quickActionIcon}>
            <GraduationCap size={48} />
          </div>
          <div>
            <h2 className={styles.quickActionTitle}>开始考核</h2>
            <p className={styles.quickActionDesc}>
              检验你的学习成果，强化记忆效果
            </p>
          </div>
        </div>
        <button className={styles.quickActionBtn} onClick={handleStartQuiz}>
          <span>开始考核</span>
          <TrendingUp size={20} />
        </button>
      </section>

      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrapper}>
            <Award size={20} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>最近添加</h2>
          </div>
          <button className={styles.addBtn} onClick={handleAddConcept}>
            <Plus size={16} />
            <span>添加概念</span>
          </button>
        </div>

        {recentConcepts.length > 0 ? (
          <div className={styles.conceptList}>
            {recentConcepts.map((concept, index) => (
              <div 
                key={concept.id} 
                className={styles.conceptItem}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ConceptCard concept={concept} expanded={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <p className={styles.emptyText}>还没有添加任何概念</p>
            <button className={styles.emptyBtn} onClick={handleAddConcept}>
              <Plus size={16} />
              <span>添加第一个概念</span>
            </button>
          </div>
        )}
      </section>

      <section className={styles.browseSection}>
        <div className={styles.browseCard} onClick={handleBrowseCategories}>
          <div className={styles.browseIcon}>
            <BookOpen size={32} />
          </div>
          <div className={styles.browseContent}>
            <h3 className={styles.browseTitle}>浏览知识目录</h3>
            <p className={styles.browseDesc}>探索所有分类和概念</p>
          </div>
          <div className={styles.browseArrow}>→</div>
        </div>
      </section>
    </div>
  );
}