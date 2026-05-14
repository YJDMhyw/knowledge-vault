import { useState } from 'react';
import { Plus, FolderOpen, ArrowRight, Trash2, Edit2 } from 'lucide-react';
import { useAppStore } from '../context/AppContext';
import { CategoryForm } from '../components/Category';
import styles from './TopLevelPage.module.css';

interface TopLevelPageProps {
  onNavigateToSubLevel: (categoryId: string) => void;
}

export default function TopLevelPage({ onNavigateToSubLevel }: TopLevelPageProps) {
  const { categories, deleteCategory, updateCategory } = useAppStore();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const topCategories = categories.filter(c => c.parentId === null);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`确定删除目录「${name}」吗？这将同时删除其下所有子目录和概念。`)) {
      deleteCategory(id);
    }
  };

  const handleEdit = (categoryId: string) => {
    setEditingCategory(categoryId);
    setShowCategoryForm(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>顶级目录</h1>
          <p className={styles.subtitle}>点击目录查看次级分类</p>
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
        {topCategories.length > 0 ? (
          <div className={styles.grid}>
            {topCategories.map((category, index) => {
              const subCount = categories.filter(c => c.parentId === category.id).length;
              const childConceptCount = categories
                .filter(c => c.parentId === category.id)
                .reduce((acc, subCat) => {
                  return acc + categories.filter(c => c.parentId === subCat.id).length;
                }, 0);
              
              return (
                <div
                  key={category.id}
                  className={styles.card}
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div 
                    className={styles.cardInner}
                    onClick={() => onNavigateToSubLevel(category.id)}
                  >
                    <div className={styles.cardIcon}>
                      <FolderOpen size={28} />
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{category.name}</h3>
                      <div className={styles.cardMeta}>
                        <span className={styles.metaItem}>
                          {subCount} 个子目录
                        </span>
                        <span className={styles.metaDivider}>·</span>
                        <span className={styles.metaItem}>
                          {childConceptCount} 个概念
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={20} className={styles.cardArrow} />
                  </div>
                  
                  <div className={styles.cardActions}>
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
            <div className={styles.emptyIcon}>📚</div>
            <h3 className={styles.emptyTitle}>还没有目录</h3>
            <p className={styles.emptyText}>点击右上角按钮创建第一个顶级目录</p>
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
          parentId={null}
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