import React from 'react';
import { FindBookButton } from '../Button';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import styles from './BookCard.module.css';

/**
 * Интерфейс книги
 * library может быть как строкой (название), так и объектом с полем name
 */
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

/**
 * Компонент карточки книги
 * Отображает информацию о книге и кнопку для бронирования
 */
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

    /**
     * Обработчик клика по кнопке
     * Если передан onBook - вызывает его, иначе переходит на страницу бронирования
     */
    const handleBook = () => {
        if (onBook) {
            onBook(book.id);
        } else {
            navigate(`/booking/${book.id}`);
        }
    };

    /**
     * Получение названия библиотеки
     * Поддерживает два формата: строка или объект
     */
    const getLibraryName = (library: string | { id: number; name: string }): string => {
        if (typeof library === 'string') return library;
        return library?.name || 'Библиотека не указана';
    };
    
    const libraryDisplay = getLibraryName(book.library);
    
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
                        {libraryDisplay}
                    </p>
                )}
            </div>
            </div>

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