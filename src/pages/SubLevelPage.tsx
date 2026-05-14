import { useState } from 'react';
import { Plus, ArrowLeft, Folder, ArrowRight, Trash2, Edit2, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../context/AppContext';
import { CategoryForm } from '../components/Category';
import styles from './SubLevelPage.module.css';

interface SubLevelPageProps {
  topCategoryId: string;
  onNavigateBack: () => void;
  onNavigateToConcepts: (categoryId: string) => void;
}

export default function SubLevelPage({ topCategoryId, onNavigateBack, onNavigateToConcepts }: SubLevelPageProps) {
  const navigate = useNavigate();
  const { categories, concepts, deleteCategory } = useAppStore();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const topCategory = categories.find(c => c.id === topCategoryId);
  const subCategories = categories.filter(c => c.parentId === topCategoryId);

  const getConceptCount = (subCatId: string) => {
    return concepts.filter(c => c.categoryId === subCatId).length;
  };

  const getUnmasteredCount = (subCatId: string) => {
    return concepts.filter(c => c.categoryId === subCatId && c.quizCount === 0).length;
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定删除目录「${name}」吗？这将同时删除其下所有概念。`)) {
      deleteCategory(id);
    }
  };

  const handleEdit = (categoryId: string) => {
    setEditingCategory(categoryId);
    setShowCategoryForm(true);
  };

  const handleStartQuiz = (subCatId: string) => {
    navigate(`/quiz?categoryId=${subCatId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onNavigateBack}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{topCategory?.name}</h1>
          <p className={styles.subtitle}>点击次级目录查看概念，或点击考核按钮开始测试</p>
        </div>
        <button 
          className={styles.addBtn} 
          onClick={() => {
            setEditingCategory(null);
            setShowCategoryForm(true);
          }}
        >
          <Plus size={18} />
          <span>新建目录</span>
        </button>
      </div>

      <div className={styles.container}>
        {subCategories.length > 0 ? (
          <div className={styles.list}>
            {subCategories.map((category, index) => {
              const conceptCount = getConceptCount(category.id);
              const unmasteredCount = getUnmasteredCount(category.id);
              return (
                <div
                  key={category.id}
                  className={styles.item}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div 
                    className={styles.itemInner}
                    onClick={() => onNavigateToConcepts(category.id)}
                  >
                    <div className={styles.itemIcon}>
                      <Folder size={24} />
                    </div>
                    <div className={styles.itemContent}>
                      <h3 className={styles.itemTitle}>{category.name}</h3>
                      <p className={styles.itemDesc}>
                        {conceptCount} 个概念
                        {unmasteredCount > 0 && ` · ${unmasteredCount} 个未掌握`}
                      </p>
                    </div>
                    <ArrowRight size={18} className={styles.itemArrow} />
                  </div>
                  
                  <div className={styles.itemActions}>
                    {conceptCount > 0 && (
                      <button
                        className={styles.quizBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartQuiz(category.id);
                        }}
                        title="开始考核"
                      >
                        <GraduationCap size={14} />
                      </button>
                    )}
                    <button
                      className={styles.actionBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(category.id);
                      }}
                      title="编辑"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={styles.actionBtnDelete}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id, category.name);
                      }}
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📁</div>
            <h3 className={styles.emptyTitle}>还没有次级目录</h3>
            <p className={styles.emptyText}>点击右上角按钮创建次级目录</p>
            <button 
              className={styles.emptyBtn}
              onClick={() => setShowCategoryForm(true)}
            >
              <Plus size={18} />
              <span>创建目录</span>
            </button>
          </div>
        )}
      </div>

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory ? categories.find(c => c.id === editingCategory) || null : null}
          parentId={topCategoryId}
          onClose={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          onSubmit={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}