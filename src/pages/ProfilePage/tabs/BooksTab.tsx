import React from 'react';
import styles from '../tabs/BooksTab.module.css';
import { Icon } from '../../../components/ui';
import { LoginButton } from '../../../components/ui/Button/LoginButton';
import { SupportChatWidget } from '../../../components/widgets/SupportChat/SupportChatWidget';
import { SupportChatButton } from '../../../components/ui/Button/SupportChatButton';
import { useBooksTab } from '../../../hooks/useBooksTab';

export const BooksTab: React.FC = () => {
  const {
    filter,
    userBooks,
    filteredBooks,
    loading,
    error,
    isChatOpen,
    setFilter,
    setIsChatOpen,
    handleToggleChat,
    getStatusIcon,
    getRowStatusClass,
    navigateToSearch,
    reloadPage,
  } = useBooksTab();

  // Показываем загрузку
  if (loading) {
    return (
      <div className={styles.profilePage}>
        <h2 className={styles.greeting}>Мои книги</h2>
        <div className={styles.loadingState}>Загрузка книг...</div>
      </div>
    );
  }

  // Если нет книг - показываем заглушку
  if (userBooks.length === 0 && !error) {
    return (
      <div className={styles.profilePage}>
        <h2 className={styles.greeting}>Мои книги</h2>
        <div className={styles.wrapperEmptyState}>
          <p className={styles.emptyState}>У вас нет активных броней — найдите книгу и забронируйте её!</p>
          <LoginButton
            className={styles.secondaryButton}
            onClick={navigateToSearch}
          >
            Найти книгу
          </LoginButton>
        </div>
<div className={styles.chatWidgetWrapper}>
    {isChatOpen && (
        <SupportChatWidget 
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)} 
        />
    )}
    <SupportChatButton onClick={handleToggleChat} />
</div>
      </div>
    );
  }

  // Если ошибка
  if (error) {
    return (
      <div className={styles.profilePage}>
        <h2 className={styles.greeting}>Мои книги</h2>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <h2 className={styles.greeting}>Мои книги</h2>

      {/* Фильтры */}
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'booked' ? styles.filterActive : ''}`}
          onClick={() => setFilter('booked')}
        >
          <img src={getStatusIcon('Забронирована')} alt="" className={styles.filterIcon} />
          Забронирована
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'returned' ? styles.filterActive : ''}`}
          onClick={() => setFilter('returned')}
        >
          <img src={getStatusIcon('Возвращена')} alt="" className={styles.filterIcon} />
          Возвращена
        </button>
      </div>

      {/* Таблица книг */}
      <div className={styles.tableWrapper}>
        <table className={styles.bookTable}>
          <thead>
            <tr>
              <th className={styles.bookId}>ID</th>
              <th>Обложка</th>
              <th>Название книги / автор</th>
              <th>Библиотека</th>
              <th>Выдача</th>
              <th>Возврат</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr 
                key={book.id} 
                className={`${styles.tableRow} ${getRowStatusClass(book.status)}`}
              >
                <td className={styles.cellId}>{book.id}</td>
                <td className={styles.cellCover}>
                  <div className={styles.bookCoverPlaceholder}>
                    <Icon name="book" size={24} />
                  </div>
                </td>
                <td className={styles.cellBook}>
                  <span className={styles.bookTitle}>{book.title}</span>
                  <span className={styles.bookAuthorTable}>/ {book.author}</span>
                </td>
                <td className={styles.cellLibrary}>{book.library}</td>
                <td className={styles.cellDate}>{book.issueDate}</td>
                <td className={styles.cellDate}>{book.returnDate}</td>
                <td className={styles.cellStatus}>
                  <div className={styles.statusWrapper}>
                    <img 
                      src={getStatusIcon(book.status)} 
                      alt={book.status}
                      className={styles.statusIcon}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Виджет поддержки */}
<div className={styles.chatWidgetWrapper}>
    {isChatOpen && (
        <SupportChatWidget 
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)} 
        />
    )}
    <SupportChatButton onClick={handleToggleChat} />
</div>
    </div>
  );
};