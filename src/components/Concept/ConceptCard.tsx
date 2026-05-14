import { ChevronDown, ChevronUp, Edit2, Trash2, BookOpen } from 'lucide-react';
import { Concept } from '../../types';
import { useAppStore } from '../../context/AppContext';
import { formatDate } from '../../utils/storage';
import styles from './ConceptCard.module.css';

interface ConceptCardProps {
  concept: Concept;
  onEdit?: (concept: Concept) => void;
  onDelete?: (id: string) => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export default function ConceptCard({
  concept,
  onEdit,
  onDelete,
  expanded = false,
  onToggleExpand
}: ConceptCardProps) {
  const category = useAppStore((state) =>
    state.categories.find((c) => c.id === concept.categoryId)
  );

  const accuracy = concept.quizCount > 0 
    ? Math.round((concept.correctCount / concept.quizCount) * 100) 
    : 0;

  return (
    <div className={`${styles.card} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.header} onClick={onToggleExpand}>
        <div className={styles.iconWrapper}>
          <BookOpen size={18} className={styles.icon} />
        </div>
        <div className={styles.info}>
          <div className={styles.titleRow}>
            <h3 className={styles.name}>{concept.name}</h3>
            {category && (
              <span className={styles.categoryTag}>{category.name}</span>
            )}
          </div>
          <div className={styles.stats}>
            <span className={styles.stat}>
              考核 {concept.quizCount} 次
            </span>
            <span className={styles.statDivider}>·</span>
            <span className={`${styles.stat} ${styles.accuracy}`}>
              正确率 {accuracy}%
            </span>
          </div>
        </div>
        <div className={styles.actions}>
          {onEdit && (
            <button
              className={styles.actionBtn}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(concept);
              }}
              title="编辑"
            >
              <Edit2 size={16} />
            </button>
          )}
          {onDelete && (
            <button
              className={styles.actionBtnDelete}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(concept.id);
              }}
              title="删除"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button className={styles.expandBtn}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <div className={`${styles.content} ${expanded ? styles.show : ''}`}>
        <div className={styles.definition}>
          <span className={styles.label}>定义</span>
          <p className={styles.text}>{concept.definition}</p>
        </div>
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            创建于 {formatDate(concept.createdAt)}
          </span>
          {concept.updatedAt !== concept.createdAt && (
            <>
              <span className={styles.metaDivider}>·</span>
              <span className={styles.metaItem}>
                更新于 {formatDate(concept.updatedAt)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}