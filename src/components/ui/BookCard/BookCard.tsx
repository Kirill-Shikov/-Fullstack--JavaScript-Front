import React from 'react';
import { FindBookButton } from '../Button';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import styles from './BookCard.module.css';

export interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    description?: string;
    library: string | { id: number; name: string; address: string; description: string };
    coverImage?: string;
}

interface BookCardProps {
    book: Book;
    size?: 'small' | 'medium' | 'large' | 'compact';
    onBook?: (bookId: number) => void;
    showDescription?: boolean;
    showLibrary?: boolean;
    buttonText?: string;
    className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({
    book,
    size = 'medium',
    onBook,
    showDescription = true,
    showLibrary = true,
    buttonText = 'Забронировать',
    className = '',
}) => {
    const navigate = useNavigate();

    const handleBook = () => {
        if (onBook) {
            onBook(book.id);
        } else {
            navigate(`/booking/${book.id}`);
        }
    };

    // Получаем название библиотеки
    const getLibraryName = (library: string | { id: number; name: string }): string => {
        if (typeof library === 'string') return library;
        return library?.name || 'Библиотека не указана';
    };
    
    return (
        <div className={`${styles.bookCard} ${styles[size]} ${className}`}>
          <div className={styles.wrapperBook}>
            <div className={styles.bookCover}>
                {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className={styles.coverImage} />
                ) : (
                    <div className={styles.placeholderCover}>
                        <Icon name="book" size={size === 'small' ? 32 : 48} />
                    </div>
                )}
            </div>

            <div className={styles.bookInfo}>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookAuthor}>
                    <span className={styles.authorLabel}>Автор:</span> {book.author}
                </p>
                <p className={styles.bookYear}>
                    <span className={styles.yearLabel}>Год:</span> {book.year}
                </p>

                {showDescription && book.description && (
                    <p className={styles.bookDescription}>
                        <span className={styles.descriptionLabel}>Описание:</span>{' '}
                        {book.description}
                    </p>
                )}

                {showLibrary && (
                    <p className={styles.bookLibrary}>
                        <span className={styles.libraryLabel}>Библиотека:</span>
                        <Icon name="location" size={16} className={styles.locationIcon} />
                        {typeof book.library === 'string' ? book.library : book.library?.name || 'Библиотека не указана'}
                    </p>
                )}
            </div>
            </div>

            {/* Кнопка бронирования */}
        
          <div className={styles.bookButtonWrapper}>
            <FindBookButton 
              onClick={handleBook}
              className={styles.bookButton}
            >
              {buttonText}
            </FindBookButton>
          </div>
        
        </div>
    );
};
