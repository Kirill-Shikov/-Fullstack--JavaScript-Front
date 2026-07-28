import React from 'react';
import { Icon } from '../Icon';
import styles from './LoginButton.module.css';

interface LoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Вход',
  className = '',
}) => {
  return (
    <button 
      className={`${styles.loginButton} ${styles.smallBtnShadow} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};