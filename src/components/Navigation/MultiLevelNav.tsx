import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Minus } from 'lucide-react';
import { Category } from '../../types';
import { useAppStore } from '../../context/AppContext';
import styles from './MultiLevelNav.module.css';

interface TreeNodeProps {
  category: Category;
  categories: Category[];
  level: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

function TreeNode({
  category,
  categories,
  level,
  selectedId,
  onSelect,
  expandedIds,
  onToggleExpand
}: TreeNodeProps) {
  const children = categories.filter((c) => c.parentId === category.id);
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedId === category.id;
  const conceptCount = useAppStore((state) =>
    state.concepts.filter((c) => c.categoryId === category.id).length
  );

  return (
    <div className={styles.treeNode}>
      <div
        className={`${styles.nodeContent} ${isSelected ? styles.selected : ''}`}
        style={{ paddingLeft: `${12 + level * 20}px` }}
        onClick={() => onSelect(category.id)}
      >
        <button
          className={`${styles.expandBtn} ${hasChildren ? styles.hasChildren : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (hasChildren) onToggleExpand(category.id);
          }}
        >
          {hasChildren && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </button>
        <span className={styles.folderIcon}>
          {isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
        </span>
        <span className={styles.nodeName}>{category.name}</span>
        {conceptCount > 0 && <span className={styles.badge}>{conceptCount}</span>}
      </div>
      {hasChildren && isExpanded && (
        <div className={styles.children}>
          {children
            .sort((a, b) => a.order - b.order)
            .map((child) => (
              <TreeNode
                key={child.id}
                category={child}
                categories={categories}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
              />
            ))}
        </div>
      )}
    </div>
  );
}

interface MultiLevelNavProps {
  onAddCategory?: () => void;
}

export default function MultiLevelNav({ onAddCategory }: MultiLevelNavProps) {
  const { categories, selectedCategoryId, selectCategory } = useAppStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(categories.filter((c) => c.parentId !== null).map((c) => c.parentId!))
  );

  const rootCategories = categories
    .filter((c) => c.parentId === null)
    .sort((a, b) => a.order - b.order);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (id: string | null) => {
    selectCategory(id);
  };

  const totalConcepts = useAppStore((state) => state.concepts.length);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>知识目录</h3>
      </div>

      <div className={styles.allItems} onClick={() => handleSelect(null)}>
        <span className={styles.allIcon}>
          <FolderOpen size={16} />
        </span>
        <span className={styles.allLabel}>全部概念</span>
        <span className={styles.badge}>{totalConcepts}</span>
      </div>

      <div className={styles.tree}>
        {rootCategories.map((category) => (
          <TreeNode
            key={category.id}
            category={category}
            categories={categories}
            level={0}
            selectedId={selectedCategoryId}
            onSelect={handleSelect}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
          />
        ))}
      </div>

      {onAddCategory && (
        <button className={styles.addBtn} onClick={onAddCategory}>
          <Plus size={16} />
          <span>新建目录</span>
        </button>
      )}
    </div>
  );
}
