import React from 'react';
import { Icon } from '../Icon';
import styles from './PaginationPrevButton.module.css';

interface PaginationPrevButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const PaginationPrevButton: React.FC<PaginationPrevButtonProps> = ({ 
  onClick, 
  disabled = false,
  className = ''
}) => {
  return (
    <button 
      className={`${styles.prevButton} ${styles.smallBtnShadow} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Предыдущая страница"
    >
      <Icon name="chevrons-left" size={24} />
    </button>
  );
};