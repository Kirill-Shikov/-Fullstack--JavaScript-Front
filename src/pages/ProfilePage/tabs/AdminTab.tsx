import React from 'react';
import { FindBookButton } from '../../../components/ui/Button';
import { useAdminTab } from '../../../hooks/useAdminTab';
import styles from '../tabs/AdminTab.module.css';

export const AdminTab: React.FC = () => {
  const {
    stats,
    loading,
    userName,
    isAdmin,
    navigateToUsers,
    navigateToAddBook,
    navigateToBooks,
    navigateToLibraries,
  } = useAdminTab();

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <h2 className={styles.greeting}>Добро пожаловать в админ-панель!</h2>
        <div className={styles.loading}>Загрузка статистики...</div>
      </div>
    );
  }

  return (
    <div className={styles.adminStatsRow}>
      {/* Приветствие */}
      <h1 className={styles.adminGreeting}>
        {isAdmin ? 'Добро пожаловать в админ-панель!' : 'Добро пожаловать в панель библиотекаря!'}
      </h1>

      {/* Первая строка статистики */}
      <div className={styles.adminRow}>
        
        {/* ============================================= */}
        {/* ЛЕВАЯ КАРТОЧКА (adminStatCardLeft) */}
        {/* ============================================= */}
        <div className={styles.adminStatCard}>
          <div className={styles.adminStatCardLeft}>
            
            {isAdmin ? (
              // АДМИН: Слева Библиотеки + кнопка
              <>
                <span className={styles.adminStatLabel}>Всего библиотек:<span className={styles.adminStatNumber}>{stats?.totalLibraries}</span></span>
                <div className={styles.adminActions}>
                  <FindBookButton 
                    className={styles.adminButton}
                    onClick={navigateToLibraries}
                  >
                    Добавить библиотеку
                  </FindBookButton>
                </div>
              </>
            ) : (
              // БИБЛИОТЕКАРЬ: Слева Пользователи (из правой части) + кнопка Открыть список
              <>
                <span className={styles.adminStatLabel}>Всего пользователей:<span className={styles.adminStatNumber}>{stats?.totalUsers}</span></span>
                <span className={styles.adminStatLabel}>С активными бронированиями:<span className={styles.adminStatNumber}>{stats?.activeBookings}</span></span>
                <span className={styles.adminStatLabel}>Новых сообщений:<span className={styles.adminStatNumber}>{stats?.newMessages}</span></span>
                <div className={styles.adminActions}>
                  <FindBookButton 
                    className={styles.adminOpenListButton}
                    onClick={navigateToUsers}
                  >
                    Открыть список
                  </FindBookButton>
                </div>
              </>
            )}
            
          </div>
        </div>


        {/* ============================================= */}
        {/* ПРАВАЯ КАРТОЧКА (adminStatCardRight) */}
        {/* ============================================= */}
        <div className={styles.adminStatCard}>
          <div className={styles.adminStatCardRight}>
            
            {isAdmin ? (
              // АДМИН: Справа Пользователи + кнопка
              <>
                <span className={styles.adminStatLabel}>Всего пользователей:<span className={styles.adminStatNumber}>{stats?.totalUsers}</span></span>
                <span className={styles.adminStatLabel}>С активными бронированиями:<span className={styles.adminStatNumber}>{stats?.activeBookings}</span></span>
                <span className={styles.adminStatLabel}>Новых сообщений:<span className={styles.adminStatNumber}>{stats?.newMessages}</span></span>
                <div className={styles.adminActions}>
                  <FindBookButton 
                    className={styles.adminOpenListButton}
                    onClick={navigateToUsers}
                  >
                    Открыть список
                  </FindBookButton>
                </div>
              </>
            ) : (
              // БИБЛИОТЕКАРЬ: Справа Библиотеки + кнопка Добавить книгу
              <>
                <span className={styles.adminStatLabel}>Всего библиотек:<span className={styles.adminStatNumber}>{stats?.totalLibraries}</span></span>
                <div className={styles.adminActions}>
                  <FindBookButton 
                    className={styles.adminButton}
                    onClick={navigateToBooks}
                  >
                    Добавить книгу
                  </FindBookButton>
                </div>
              </>
            )}
            
          </div>
        </div>
        
      </div>

      {/* Вторая строка статистики - только для админа */}
      {isAdmin && (
        <div className={styles.adminStatsRow}>
          <div className={styles.adminStatCard}>
            <div className={styles.adminStatCardLeft}>
              <span className={styles.adminStatLabel}>Всего книг в системе:<span className={styles.adminStatNumber}>{stats?.totalBooks}</span></span>
              <span className={styles.adminStatLabel}>Активные бронирования:<span className={styles.adminStatNumber}>{stats?.activeRentals}</span></span>
              <div className={styles.adminActions}>
                <FindBookButton
                  className={styles.adminAddBookButton}
                  onClick={navigateToLibraries}  
                >
                  Добавить книгу
                </FindBookButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};