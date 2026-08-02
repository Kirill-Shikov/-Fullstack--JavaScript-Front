import React from 'react';
import userround from '../../../assets/icons/navigation/userround.svg';
import { useProfileLayout } from '../../../hooks/useProfileLayout';
import { Icon } from '../../ui/Icon'; 
import styles from './ProfileLayout.module.css';

interface ProfileLayoutProps {
  children: React.ReactNode;
  userAvatar?: string | null;
  defaultAvatar?: string;
  userName?: string;
  userEmail?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ 
  children,
  userAvatar = null,
  defaultAvatar,
  userName = '',
  activeTab, 
  onTabChange,
}) => {
  const {
    userName: displayName,
    avatarUrl,
    navItems,
    currentActiveTab,
    handleNavClick,
    handleLogout,
  } = useProfileLayout(userAvatar, userName);

  const avatarSrc = userAvatar 
    ? `http://localhost:3000${userAvatar}` 
    : userround;

  return (
    <div className={styles.profileLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.userBlock}>
          <div className={styles.avatarWrapper}>
            <img 
              src={avatarSrc}
              alt={userName}
              className={styles.avatarImageUser}
              onError={(e) => {
                console.error('❌ Ошибка загрузки аватара:', userAvatar);
                e.currentTarget.src = userround;
              }}
            />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Привет, {userName}!</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`${styles.navItem} ${
                currentActiveTab === item.id ? styles.active : ''
              }`}
            >
              <Icon name={item.icon} size={24} />  
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className={styles.logoutButton}>
          <Icon name="logout" size={24} />
          <span>Выход</span>
        </button>

        <div className={styles.logo}>
          <span>ЛОГО</span>
        </div>
      </aside>

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};