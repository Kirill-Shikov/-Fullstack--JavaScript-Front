import React from 'react';
import { Icon } from '../Icon';
import styles from './LoginButton.module.css';

interface LoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Вход'
}) => {
  return (
    <button 
      className={`${styles.loginButton} ${styles.smallBtnShadow}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};