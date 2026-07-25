import React from 'react';
import { Icon } from '../Icon';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
  disabled?: boolean;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Поиск книги...',
  value = '',
  onChange,
  onSearch,
  disabled = false,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={`${styles.wrapperInput} ${className}`}>
    <input
      type="text"
      className={styles.searchInput} 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
    />
    </div>
  );
};