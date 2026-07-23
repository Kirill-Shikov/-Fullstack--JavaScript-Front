import React from 'react';
import { Icon } from '../Icon';
import styles from './BackButton.module.css';

interface BackButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Назад'
}) => {
  return (
    <button 
      className={`${styles.backButton} ${styles.smallBtnShadow}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon 
        name="arrow-big-left" 
        size={20} 
        className={styles.arrowIcon}
      />
      {children}
    </button>
  );
};