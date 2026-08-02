import React from 'react';
import { LoginButton, ProfileButton } from '../../ui';
import { LoginModal } from '../../auth/LoginModal';
import { useHeader } from '../../../hooks/useHeader';
import { useAuth } from '../../../hooks/useAuth'; 
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { user: authUser } = useAuth();
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleAboutClick,
    handleLogout,
    handleProfileClick,
    handleLoginSuccess,
  } = useHeader();

  // Используем authUser вместо user из useHeader
  const currentUser = authUser;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.actions}>
          {currentUser ? (
            <ProfileButton 
              onClick={handleProfileClick}
              avatar={currentUser?.avatar || null}
              name={currentUser?.name || ''}
            />
          ) : (
            <LoginButton onClick={() => setIsLoginModalOpen(true)} />
          )}
        </div>
        <div className={styles.logo}>ЛОГО</div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>Библиотеки</a>
          <a href="#about" className={styles.navLink} onClick={handleAboutClick}>О нас</a>
          <a href="/contacts" className={styles.navLink}>Контакты</a>
        </nav>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => {
          setIsLoginModalOpen(false);
        }}
      />
    </>
  );
};