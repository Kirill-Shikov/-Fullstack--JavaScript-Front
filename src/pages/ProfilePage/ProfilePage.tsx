// src/pages/ProfilePage/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileLayout } from '../../components/layouts/ProfileLayout';
import { MainTab, BooksTab, ProfileTab } from './tabs';
import { useProfile } from '../../hooks/useProfile';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('main');

  // Получаем данные с бекенда
  const { profile, stats, books, loading, error, refetch } = useProfile();

  // Синхронизируем активную вкладку с URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/profile') {
      setActiveTab('main');
    } else if (path === '/profile/books') {
      setActiveTab('books');
    } else if (path === '/profile/settings') {
      setActiveTab('settings');
    }
  }, [location.pathname]);

  // Показываем загрузку
  if (loading) {
    return (
      <ProfileLayout 
        userName="Загрузка..."
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className={styles.loading}>Загрузка профиля...</div>
      </ProfileLayout>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <ProfileLayout 
        userName="Ошибка"
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={refetch}>Попробовать снова</button>
        </div>
      </ProfileLayout>
    );
  }

  // Рендерим активную вкладку с данными
  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return <MainTab stats={stats} />;
      case 'books':
        return <BooksTab />;  // BooksTab сам управляет своими данными
      case 'settings':
        return <ProfileTab user={profile} onUpdate={refetch} />;
      default:
        return <MainTab stats={stats} />;
    }
  };

  return (
    <ProfileLayout 
      userAvatar={profile?.avatar || null}
      userName={profile?.name || 'Пользователь'}
      userEmail={profile?.email || ''}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </ProfileLayout>
  );
};