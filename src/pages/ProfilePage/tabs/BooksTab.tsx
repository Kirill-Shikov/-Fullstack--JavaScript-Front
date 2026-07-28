// src/pages/ProfilePage/tabs/BooksTab.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../ProfilePage.module.css';
import { Icon } from '../../../components/ui';
import bookmarked from '../../../assets/icons/navigation/bookmarked.svg';
import squarecheck from '../../../assets/icons/navigation/squarecheck.svg';
import { LoginButton } from '../../../components/ui/Button/LoginButton';
import { api } from '../../../api/axios.config';

type FilterType = 'all' | 'booked' | 'returned';

interface Book {
  id: number;
  title: string;
  author: string;
  library: string;
  issueDate: string;
  returnDate: string;
  status: 'Забронирована' | 'Возвращена';
  coverImage?: string;
}

export const BooksTab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState<FilterType>('all');
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем параметр фильтра в URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'booked') {
      setFilter('booked');
    } else if (filterParam === 'returned') {
      setFilter('returned');
    }
  }, [location.search]);

  // Загружаем книги с бекенда
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Заменить на правильный эндпоинт
        // Согласно документации: GET /api/client/rentals
        const response = await api.get('/client/rentals');
        
        // Преобразуем данные с бекенда в формат для отображения
        const formattedBooks = response.data.map((rental: any) => ({
          id: rental.id,
          title: rental.book?.title || 'Название не указано',
          author: rental.book?.author || 'Автор не указан',
          library: rental.library?.name || 'Библиотека не указана',
          issueDate: rental.dateStart ? new Date(rental.dateStart).toLocaleDateString('ru-RU') : '',
          returnDate: rental.dateEnd ? new Date(rental.dateEnd).toLocaleDateString('ru-RU') : '',
          status: rental.status === 'reserved' || rental.status === 'active' 
            ? 'Забронирована' 
            : 'Возвращена',
          coverImage: rental.book?.coverImage || '',
        }));
        
        setUserBooks(formattedBooks);
      } catch (err: any) {
        console.error('Error fetching books:', err);
        setError(err.response?.data?.message || 'Ошибка загрузки книг');
        
        // Если бекенд еще не готов - используем мок-данные
        // Временно, пока бекенд не готов
        setUserBooks([
          { 
            id: 1, 
            title: 'Мастер и Маргарита', 
            author: 'М.А. Булгаков', 
            library: 'Центральная городская библиотека им. Н.А. Некрасова',
            issueDate: '10.08.2025',
            returnDate: '25.08.2025',
            status: 'Забронирована' 
          },
          { 
            id: 2, 
            title: 'Братья Карамазовы', 
            author: 'Ф.М. Достоевский', 
            library: 'Центральная городская библиотека им. Н.А. Некрасова',
            issueDate: '15.04.2025',
            returnDate: '30.04.2025',
            status: 'Забронирована' 
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Фильтруем книги
  const getFilteredBooks = () => {
    switch (filter) {
      case 'booked':
        return userBooks.filter(book => book.status === 'Забронирована');
      case 'returned':
        return userBooks.filter(book => book.status === 'Возвращена');
      default:
        return userBooks;
    }
  };

  const filteredBooks = getFilteredBooks();

  // Получаем иконку для статуса
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Забронирована':
        return bookmarked;
      case 'Возвращена':
        return squarecheck;
      default:
        return '';
    }
  };

  // Получаем класс статуса для строки
  const getRowStatusClass = (status: string) => {
    switch (status) {
      case 'Забронирована':
        return styles.rowBooked;
      case 'Возвращена':
        return styles.rowReturned;
      default:
        return '';
    }
  };

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
            onClick={() => navigate('/search')}
          >
            Найти книгу
          </LoginButton>
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
          <img src={bookmarked} alt="" className={styles.filterIcon} />
          Забронирована
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'returned' ? styles.filterActive : ''}`}
          onClick={() => setFilter('returned')}
        >
          <img src={squarecheck} alt="" className={styles.filterIcon} />
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
    </div>
  );
};