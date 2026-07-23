import React from 'react';
import { Icon } from '../Icon';
import styles from './PaginationNextButton.module.css';

interface PaginationNextButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string; 
}

export const PaginationNextButton: React.FC<PaginationNextButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = ''
}) => {
  return (
    <button 
      className={`${styles.nextButton} ${styles.smallBtnShadow} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Следующая страница"
    >
      <Icon name="chevrons-right" size={24} />
    </button>
  );
};