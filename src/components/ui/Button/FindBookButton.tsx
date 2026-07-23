import React from 'react';
import { Icon } from '../Icon';
import styles from './FindBookButton.module.css';

interface FindBookButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const FindBookButton: React.FC<FindBookButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Найти книгу'
}) => {
  return (
    <button 
      className={`${styles.findBookButton} ${styles.smallBtnShadow}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};