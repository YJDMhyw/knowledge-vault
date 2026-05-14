import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './CategorySelect.module.css';

interface CategoryOption {
  id: string;
  name: string;
  depth: number;
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CategoryOption[];
  placeholder?: string;
  error?: boolean;
  errorText?: string;
  label?: string;
}

export default function CategorySelect({
  value,
  onChange,
  options,
  placeholder = '请选择',
  error,
  errorText,
  label
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.open : ''} ${error ? styles.error : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? styles.value : styles.placeholder}>
          {selectedOption ? '　'.repeat(selectedOption.depth * 2) + selectedOption.name : placeholder}
        </span>
        <ChevronDown size={16} className={styles.icon} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.length === 0 ? (
            <div className={styles.empty}>暂无选项</div>
          ) : (
            options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.option} ${option.id === value ? styles.selected : ''}`}
                onClick={() => handleSelect(option.id)}
              >
                <span className={styles.optionText}>
                  {'　'.repeat(option.depth * 2)}{option.name}
                </span>
                {option.id === value && <Check size={14} className={styles.checkIcon} />}
              </button>
            ))
          )}
        </div>
      )}

      {error && errorText && <span className={styles.errorText}>{errorText}</span>}
    </div>
  );
}
