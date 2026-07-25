import React, { useState } from 'react';
import { LoginButton } from '../../ui/Button';
import { LoginModal } from '../../auth/LoginModal';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = (email: string, password: string) => {
    console.log('Вход:', { email, password });
    // Здесь будет запрос к API
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.actions}>
          <LoginButton onClick={() => setIsLoginModalOpen(true)} />
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
        onLogin={handleLogin}
      />
    </>
  );
};