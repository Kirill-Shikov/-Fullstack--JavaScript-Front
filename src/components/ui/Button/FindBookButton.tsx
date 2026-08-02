import React from 'react';
import { Icon } from '../Icon';
import styles from './FindBookButton.module.css';

interface FindBookButtonProps {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export const FindBookButton: React.FC<FindBookButtonProps> = ({ 
  onClick, 
  disabled = false,
  className = '',
  children = 'Найти книгу',
  type = 'button',
}) => {
  return (
    <button 
      className={`${styles.findBookButton} ${styles.smallBtnShadow} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type} 
    >
      {children}
    </button>
  );
};