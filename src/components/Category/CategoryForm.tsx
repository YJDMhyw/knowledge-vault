import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category } from '../../types';
import { useAppStore } from '../../context/AppContext';
import styles from './CategoryForm.module.css';

interface CategoryFormProps {
  category?: Category | null;
  parentId?: string | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CategoryForm({ category, parentId, onClose, onSubmit }: CategoryFormProps) {
  const { addCategory, updateCategory } = useAppStore();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName('');
    }
  }, [category]);

  const validate = () => {
    if (!name.trim()) {
      setError('请输入目录名称');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (category) {
      updateCategory(category.id, { name });
    } else {
      addCategory({ name, parentId: parentId || null });
    }
    onSubmit();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {category ? '编辑目录' : '新建目录'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>目录名称</label>
            <input
              type="text"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="输入目录名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              取消
            </button>
            <button type="submit" className={styles.submitBtn}>
              {category ? '保存' : '创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
