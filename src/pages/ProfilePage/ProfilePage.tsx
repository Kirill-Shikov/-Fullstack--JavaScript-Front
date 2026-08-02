// src/pages/ProfilePage/ProfilePage.tsx
import React from 'react';
import { ProfileLayout } from '../../components/layouts/ProfileLayout';
import { MainTab, BooksTab, ProfileTab, AdminTab, AdminUsersTab, AdminLibrariesTab, UserDetailPage, LibraryDetailPage, AdminAddBookPage } from './tabs';
import { useProfilePage } from '../../hooks/useProfilePage';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const {
    activeTab,
    profile,
    stats,
    books,
    loading,
    error,
    fetchProfile,
  } = useProfilePage();

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        return <AdminTab />;
      case 'main':
        return <MainTab stats={stats} />;
      case 'books':
        return <BooksTab />;
      case 'settings':
        return <ProfileTab user={profile} onUpdate={fetchProfile} />;
      case 'users':
        return <AdminUsersTab />;
      case 'libraries':
        return <AdminLibrariesTab />;
      case 'managerBooks':
        return <AdminAddBookPage />;
      case 'userDetail':
        return <UserDetailPage />;
      case 'libraryDetail':
        return <LibraryDetailPage />;
      default:
        return <MainTab stats={stats} />;
    }
  };

  if (loading) {
    return (
      <ProfileLayout 
        userName="Загрузка..."
        activeTab={activeTab}
      >
        <div className={styles.loading}>Загрузка профиля...</div>
      </ProfileLayout>
    );
  }

  if (error) {
    return (
      <ProfileLayout 
        userName="Ошибка"
        activeTab={activeTab}
      >
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchProfile}>Попробовать снова</button>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout 
      userAvatar={profile?.avatar || null}
      userName={profile?.name || 'Пользователь'}
      userEmail={profile?.email || ''}
      activeTab={activeTab}
    >
      {renderContent()}
    </ProfileLayout>
  );
};