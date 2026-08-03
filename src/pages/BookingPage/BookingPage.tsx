import React from 'react';
import { useParams } from 'react-router-dom';
import { FindBookButton } from '../../components/ui/Button';
import { DateInput } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { useBooking } from '../../hooks/useBooking';
import bookcheck from '../../assets/icons/navigation/bookcheck.svg';
import styles from './BookingPage.module.css';

export const BookingPage: React.FC = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const {
        book,
        libraries,
        selectedLibrary,
        dateStart,
        dateEnd,
        isLoading,
        setSelectedLibrary,
        setDateStart,
        setDateEnd,
        handleBooking,
    } = useBooking(bookId);

    if (!book) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <h1>Загрузка...</h1>
                </div>
            </div>
        );
    }
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    return (
        <div className={styles.page}>
            <section className={styles.containerBook}>
                <h1 className={styles.pageTitle}>Бронирование книги {book.title}</h1>

                {/* Блок с информацией о книге */}
                <div className={styles.bookBlock}>
                    <div className={styles.bookCover}>
                        <div className={styles.coverPlaceholder}>
                            <img 
            src={`${API_URL}${book.coverImage}`} 
            alt={book.title} 
            className={styles.bookCoverImage} 
        />
                        </div>
                    </div>
                    <div className={styles.bookInfo}>
                        <h2 className={styles.bookTitle}>{book.title}</h2>
                        <span className={styles.wrapperImfo}>
                            <p className={styles.bookAuthor}>Автор: </p>
                            {book.author}
                        </span>
                        <span className={styles.wrapperImfo}>
                            <p className={styles.bookYear}>Год: </p>
                            {book.year}
                        </span>
                        <span className={styles.wrapperImfoBook}>
                            <p className={styles.bookDescription}>Описание:</p>
                            {book.description}
                        </span>
                    </div>
                </div>
            </section>

            {/* Выбор библиотеки */}
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Выберите библиотеку</h3>
                <div className={styles.libraryList}>
                    {libraries.map((library) => {
                        // Используем данные из библиотеки (bookTotalCopies, bookAvailableCopies)
                        const available = library.bookAvailableCopies || 0;
                        const total = library.bookTotalCopies || 0;
                        const isAvailable = available > 0;

                        return (
                            
                            <div
                                key={library.id}
                                className={`${styles.libraryCard} ${
                                    selectedLibrary === library.id ? styles.libraryCardActive : ''
                                } ${!isAvailable ? styles.libraryCardDisabled : ''}`}
                               onClick={() => {
    if (isAvailable) {
        console.log('✅ Устанавливаем selectedLibrary:', library.id);
        setSelectedLibrary(library.id);
    }
}}
                            >
                                <div className={styles.libraryInfo}>
                                    <h4 className={styles.libraryName}>{library.name}</h4>
                                    <p className={styles.libraryAddress}>{library.address}</p>
                                </div>
                                <div className={styles.libraryStatus}>
                                    <img
                                        src={bookcheck}
                                        alt=""
                                        className={styles.bookcheck}
                                        aria-hidden="true"
                                    />
                                    <span className={styles.libraryCount}>
                                        {available} из {total}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Выбор периода */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Выберите период бронирования</h3>
                <div className={styles.dateWrapper}>
                    <div className={styles.dateField}>
                        <label className={styles.dateLabel}>Выдача книги</label>
                        <DateInput
                            value={dateStart}
                            onChange={setDateStart}
                            placeholder="Выберите дату"
                            className={styles.dateInputFull}
                        />
                    </div>
                    <div className={styles.dateField}>
                        <label className={styles.dateLabel}>Возврат книги</label>
                        <DateInput
                            value={dateEnd}
                            onChange={setDateEnd}
                            placeholder="Выберите дату"
                            className={styles.dateInputFull}
                        />
                    </div>
                </div>
            </div>

            {/* Кнопка подтверждения */}
            <div className={styles.submitWrapper}>
                <FindBookButton onClick={handleBooking} disabled={isLoading}>
                    {isLoading ? 'Бронирование...' : 'Подтвердить бронирование'}
                </FindBookButton>
            </div>
        </div>
    );
};