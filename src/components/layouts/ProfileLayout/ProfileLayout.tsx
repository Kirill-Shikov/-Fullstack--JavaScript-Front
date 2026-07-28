import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import userround from '../../../assets/icons/navigation/userround.svg';
import logout from '../../../assets/icons/navigation/logout.svg';
import librarybig from '../../../assets/icons/navigation/librarybig.svg';
import house from '../../../assets/icons/navigation/house.svg';
import styles from './ProfileLayout.module.css';

const Icon: React.FC<{ name: string }> = ({ name }) => {
  const icons: Record<string, string> = {
    'house': house,
    'librarybig': librarybig,
    'userround': userround,
    'logout': logout,
  };
  
  return (
    <img 
      src={icons[name]} 
      alt={name}
      className={styles.navIcon}
    />
  );
};

interface ProfileLayoutProps {
  children: React.ReactNode;
  userAvatar?: string | null;
  defaultAvatar?: string;
  userName?: string;
  userEmail?: string;
  activeTab?: string; // добавляем
  onTabChange?: (tab: string) => void; // добавляем
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({ 
  children,
  userAvatar = null,
  defaultAvatar,
  userName = 'Капитолина',
  activeTab = 'main',
  onTabChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const navItems = [
    { id: 'main', path: '/profile', label: 'Главная', icon: 'house' },
    { id: 'books', path: '/profile/books', label: 'Мои книги', icon: 'librarybig' },
    { id: 'settings', path: '/profile/settings', label: 'Профиль', icon: 'userround' },
  ];

  const handleNavClick = (itemId: string, path: string) => {
    if (onTabChange) {
      onTabChange(itemId);
    }
    navigate(path);
  };


  return (
    <div className={styles.profileLayout}>
      {/* Левая панель */}
      <aside className={styles.sidebar}>
        {/* Блок с аватаром пользователя */}
        <div className={styles.userBlock}>
          <div className={styles.avatarWrapper}>
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName}
                className={styles.avatarImageUser}
              />
            ) : (
              <div className={styles.avatarImage}>
                <img 
                  src={userround}
                  alt={userName}
                  className={styles.avatarDefaultImage}
                />
              </div>
            )}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Привет, {userName}!</span>
          </div>
        </div>

        {/* Навигация */}
        <nav className={styles.navigation}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.path)}
              className={`${styles.navItem} ${
                activeTab === item.id ? styles.active : ''
              }`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Кнопка выхода */}
        <button onClick={handleLogout} className={styles.logoutButton}>
          <Icon name="logout" />
          <span>Выход</span>
        </button>

        {/* Логотип */}
        <div className={styles.logo}>
          
          <span>ЛОГО</span>
        </div>
      </aside>

      {/* Основной контент */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};