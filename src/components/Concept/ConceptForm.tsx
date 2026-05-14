import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Concept } from '../../types';
import { useAppStore } from '../../context/AppContext';
import styles from './ConceptForm.module.css';

interface ConceptFormProps {
  concept?: Concept | null;
  defaultCategoryId?: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ConceptForm({ concept, defaultCategoryId, onClose, onSubmit }: ConceptFormProps) {
  const { addConcept, updateConcept } = useAppStore();
  const [name, setName] = useState('');
  const [definition, setDefinition] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (concept) {
      setName(concept.name);
      setDefinition(concept.definition);
    } else {
      setName('');
      setDefinition('');
    }
  }, [concept]);

  const validate = () => {
    if (!name.trim()) {
      setError('请输入概念名称');
      return false;
    }
    if (!definition.trim()) {
      setError('请输入定义内容');
      return false;
    }
    if (!defaultCategoryId && !concept) {
      setError('请先选择一个目录');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (concept) {
      updateConcept(concept.id, { name, definition });
    } else {
      addConcept({ name, definition, categoryId: defaultCategoryId! });
    }
    onSubmit();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{concept ? '编辑概念' : '添加概念'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>概念名称</label>
            <input
              type="text"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="输入概念名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>定义内容</label>
            <textarea
              className={`${styles.textarea} ${error ? styles.inputError : ''}`}
              placeholder="输入定义内容"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              rows={5}
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              取消
            </button>
            <button type="submit" className={styles.submitBtn}>
              {concept ? '保存' : '添加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
