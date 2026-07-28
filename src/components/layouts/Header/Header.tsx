import React, { useState } from 'react';
import { LoginButton, ProfileButton } from '../../ui/Button';
import { LoginModal } from '../../auth/LoginModal';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();  // ← ПЕРЕЗАГРУЗКА ПОСЛЕ ВЫХОДА
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  console.log('🔵 Header render, user:', user);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.actions}>
          {user ? (
            <ProfileButton onClick={handleProfileClick} />
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
          // Просто закрываем модалку, user обновится сам через useAuth
          setIsLoginModalOpen(false);
        }}
      />
    </>
  );
};