import React from 'react';
import { Icon } from '../Icon';
import styles from './ProfileButton.module.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface ProfileButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  avatar?: string | null;
  name?: string;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ 
  onClick, 
  disabled = false,
  children = 'Войти в ЛК',
  className = '',
  avatar = null,
  name = '',
}) => {
  const avatarUrl = avatar ? `${API_URL}${avatar}` : null;

  return (
    <button 
      className={`${styles.profileButton} ${styles.smallBtnShadow} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {avatarUrl ? (
        <div className={styles.wrapperIcon}>
        <img 
          src={avatarUrl} 
          alt={name}
          className={styles.profileAvatar}
        />
        </div>
      ) : (
        <div className={styles.wrapperIcon}>
          <Icon 
            name="userround" 
            size={20} 
            className={styles.profileIcon}
          />
        </div>
      )}
      {children}
    </button>
  );
};