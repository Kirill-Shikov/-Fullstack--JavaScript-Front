import React from 'react';
import { Icon } from '../Icon';
import styles from './ProfileButton.module.css';

interface ProfileButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Войти в ЛК',
  className = '',
}) => {
  return (
    <button 
      className={`${styles.profileButton} ${styles.smallBtnShadow} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.wrapperIcon}>
      <Icon 
        name="userround" 
        size={20} 
        className={styles.profileIcon}
      />
      </div>
      {children}
    </button>
  );
};