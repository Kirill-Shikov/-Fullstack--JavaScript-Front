import React from 'react';
import { Icon } from '../Icon';
import styles from './DeleteUserButton.module.css';

interface DeleteUserButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Удалить пользователя'
}) => {
  return (
    <button 
      className={`${styles.deleteUserButton} ${styles.smallBtnShadow}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};