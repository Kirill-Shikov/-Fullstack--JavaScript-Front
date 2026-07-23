import React from 'react';
import { Icon } from '../Icon';
import styles from './ProfileButton.module.css';

interface ProfileButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Войти в ЛК'
}) => {
  return (
    <button 
      className={`${styles.profileButton} ${styles.smallBtnShadow}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.wrapperIcon}>
      <Icon 
        name="user-round" 
        size={20} 
        className={styles.profileIcon}
      />
      </div>
      {children}
    </button>
  );
};