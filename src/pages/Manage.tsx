import { useState } from 'react';
import { Plus, FolderPlus, Edit2, Trash2, BookOpen, Folder } from 'lucide-react';
import { useAppStore } from '../context/AppContext';
import { ConceptForm } from '../components/Concept';
import { CategoryForm } from '../components/Category';
import { Concept, Category } from '../types';
import styles from './Manage.module.css';

export default function Manage() {
  const {
    concepts,
    categories,
    deleteConcept,
    deleteCategory,
    addConcept,
    updateConcept,
    addCategory,
    updateCategory
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'concepts' | 'categories'>('concepts');
  const [showConceptForm, setShowConceptForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingConcept, setEditingConcept] = useState<Concept | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConcepts = concepts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '未分类';
  };

  const handleEditConcept = (concept: Concept) => {
    setEditingConcept(concept);
    setShowConceptForm(true);
  };

  const handleDeleteConcept = (id: string) => {
    if (window.confirm('确定要删除这个概念吗？')) {
      deleteConcept(id);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('确定要删除这个目录及其所有子目录吗？')) {
      deleteCategory(id);
    }
  };

  const handleConceptFormClose = () => {
    setShowConceptForm(false);
    setEditingConcept(null);
  };

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const getParentCategoryName = (parentId: string | null) => {
    if (!parentId) return '顶级目录';
    const parent = categories.find((c) => c.id === parentId);
    return parent?.name || '未知';
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>内容管理</h1>
          <p className={styles.subtitle}>管理你的概念和目录</p>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'concepts' ? styles.active : ''}`}
          onClick={() => setActiveTab('concepts')}
        >
          <BookOpen size={18} />
          <span>概念管理</span>
          <span className={styles.tabBadge}>{concepts.length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Folder size={18} />
          <span>目录管理</span>
          <span className={styles.tabBadge}>{categories.length}</span>
        </button>
      </div>

      {activeTab === 'concepts' && (
        <div className={styles.content}>
          <div className={styles.toolbar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="搜索概念..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className={styles.addBtn}
              onClick={() => setShowConceptForm(true)}
            >
              <Plus size={18} />
              <span>添加概念</span>
            </button>
          </div>

          <div className={styles.list}>
            {filteredConcepts.length > 0 ? (
              filteredConcepts.map((concept, index) => (
                <div
                  key={concept.id}
                  className={styles.item}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={styles.itemContent}>
                    <h3 className={styles.itemTitle}>{concept.name}</h3>
                    <p className={styles.itemDesc}>{concept.definition}</p>
                    <span className={styles.itemMeta}>
                      {getCategoryName(concept.categoryId)} · 考核 {concept.quizCount} 次
                    </span>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleEditConcept(concept)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteConcept(concept.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>{searchTerm ? '没有找到匹配的概念' : '还没有添加任何概念'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className={styles.content}>
          <div className={styles.toolbar}>
            <button
              className={styles.addBtn}
              onClick={() => setShowCategoryForm(true)}
            >
              <FolderPlus size={18} />
              <span>新建目录</span>
            </button>
          </div>

          <div className={styles.list}>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={category.id}
                  className={styles.item}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={styles.itemContent}>
                    <h3 className={styles.itemTitle}>{category.name}</h3>
                    <span className={styles.itemMeta}>
                      {getParentCategoryName(category.parentId)}
                    </span>
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>还没有创建任何目录</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showConceptForm && (
        <ConceptForm
          concept={editingConcept}
          onClose={handleConceptFormClose}
          onSubmit={handleConceptFormClose}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onClose={handleCategoryFormClose}
          onSubmit={handleCategoryFormClose}
        />
      )}
    </div>
  );
}
