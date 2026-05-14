import { useState } from 'react';
import { Plus, ArrowLeft, FileText } from 'lucide-react';
import { useAppStore } from '../context/AppContext';
import { ConceptCard, ConceptForm } from '../components/Concept';
import { Concept } from '../types';
import styles from './ConceptsPage.module.css';

interface ConceptsPageProps {
  subCategoryId: string;
  onNavigateBack: () => void;
}

export default function ConceptsPage({ subCategoryId, onNavigateBack }: ConceptsPageProps) {
  const { categories, concepts, deleteConcept } = useAppStore();
  const [showConceptForm, setShowConceptForm] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const subCategory = categories.find(c => c.id === subCategoryId);
  const currentConcepts = concepts.filter(c => c.categoryId === subCategoryId);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleEditConcept = (concept: Concept) => {
    setEditingConcept(concept);
    setShowConceptForm(true);
  };

  const handleDeleteConcept = (id: string) => {
    if (window.confirm('确定删除这个概念吗？')) {
      deleteConcept(id);
    }
  };

  const handleConceptFormClose = () => {
    setShowConceptForm(false);
    setEditingConcept(null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onNavigateBack}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{subCategory?.name}</h1>
          <p className={styles.subtitle}>{currentConcepts.length} 个概念</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowConceptForm(true)}>
          <Plus size={18} />
          <span>添加概念</span>
        </button>
      </div>

      <div className={styles.container}>
        {currentConcepts.length > 0 ? (
          <div className={styles.list}>
            {currentConcepts.map((concept, index) => (
              <div
                key={concept.id}
                className={styles.item}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ConceptCard
                  concept={concept}
                  expanded={expandedCards.has(concept.id)}
                  onToggleExpand={() => toggleExpand(concept.id)}
                  onEdit={handleEditConcept}
                  onDelete={handleDeleteConcept}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <h3 className={styles.emptyTitle}>还没有概念</h3>
            <p className={styles.emptyText}>点击右上角按钮添加概念</p>
            <button 
              className={styles.emptyBtn}
              onClick={() => setShowConceptForm(true)}
            >
              <Plus size={18} />
              <span>添加概念</span>
            </button>
          </div>
        )}
      </div>

      {showConceptForm && (
        <ConceptForm
          concept={editingConcept}
          defaultCategoryId={subCategoryId}
          onClose={handleConceptFormClose}
          onSubmit={handleConceptFormClose}
        />
      )}
    </div>
  );
}