import React from 'react';
import { LoginButton, ProfileButton } from '../../ui/Button';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>📚 Library</h1>
      </div>
      <nav className={styles.nav}>
        <a href="/" className={styles.navLink}>Главная</a>
        <a href="/books" className={styles.navLink}>Книги</a>
        <a href="/libraries" className={styles.navLink}>Библиотеки</a>
      </nav>
      <div className={styles.actions}>
        <LoginButton onClick={() => console.log('Вход')} />
        <ProfileButton onClick={() => console.log('Профиль')} />
      </div>
    </header>
  );
};