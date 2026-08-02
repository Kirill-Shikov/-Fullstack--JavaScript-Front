import React from 'react';
import { Icon } from '../Icon';
import styles from './DeleteUserButton.module.css';

interface DeleteUserButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Удалить пользователя',
  className = '',
}) => {
  return (
    <button 
      className={`${styles.deleteUserButton} ${styles.smallBtnShadow} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};