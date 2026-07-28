import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FindBookButton } from '../../components/ui/Button';
import { DateInput } from '../../components/ui/Input';
import { Icon } from '../../components/ui/Icon';
import { booksAPI, librariesAPI, rentalsAPI } from '../../api/api';
import bookcheck from '../../assets/icons/navigation/bookcheck.svg';
import styles from './BookingPage.module.css';

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    description: string;
    library: string;
}

interface Library {
    id: number;
    name: string;
    address: string;
    totalCopies: number;
    availableCopies: number;
    description?: string;
}

export const BookingPage: React.FC = () => {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();

    const [book, setBook] = useState<Book | null>(null);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [selectedLibrary, setSelectedLibrary] = useState<number | null>(null);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookResponse = await booksAPI.getById(Number(bookId));
                setBook(bookResponse.data);

                const librariesResponse = await librariesAPI.getAll();
                console.log('Библиотеки с бэкенда:', librariesResponse.data);
                setLibraries(librariesResponse.data);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }
        };

        if (bookId) {
            fetchData();
        }
    }, [bookId]);

    const parseDate = (dateStr: string): Date | null => {
        const parts = dateStr.split('.');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        return new Date(year, month, day);
    };

    // ===== ФОРМАТИРОВАНИЕ ДАТЫ ДЛЯ API =====
    const formatDateForApi = (dateStr: string): string => {
        if (!dateStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
        return dateStr;
    };

    const handleBooking = async () => {
        if (!selectedLibrary) {
            alert('Выберите библиотеку');
            return;
        }
        if (!dateStart || !dateEnd) {
            alert('Выберите даты');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const startDate = parseDate(dateStart);
        const endDate = parseDate(dateEnd);
        
        if (!startDate || !endDate) {
            alert('Некорректный формат даты');
            return;
        }
        
        if (startDate < today) {
            alert('Дата выдачи не может быть в прошлом');
            return;
        }
        
        if (endDate < today) {
            alert('Дата возврата не может быть в прошлом');
            return;
        }
        
        if (endDate <= startDate) {
            alert('Дата возврата должна быть позже даты выдачи');
            return;
        }
        
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) {
            alert('Максимальный срок аренды — 30 дней');
            return;
        }

        setIsLoading(true);
        try {
            await rentalsAPI.create({
                bookId: Number(bookId),
                libraryId: selectedLibrary,
                dateStart: formatDateForApi(dateStart),
                dateEnd: formatDateForApi(dateEnd),
            });

            const selectedLib = libraries.find((l) => l.id === selectedLibrary);

            navigate('/booking-success', {
                state: {
                    bookTitle: book?.title || '',
                    bookAuthor: book?.author || '',
                    libraryName: selectedLib?.name || '',
                    libraryAddress: selectedLib?.address || '',
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                },
            });
        } catch (error: any) {
            console.error('Booking error:', error);
            alert(error.response?.data?.message || 'Ошибка бронирования');
        } finally {
            setIsLoading(false);
        }
    };

    // Если книга не загружена - показываем загрузку
    if (!book) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <h1>Загрузка...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <section className={styles.containerBook}>
                <h1 className={styles.pageTitle}>Бронирование книги {book.title}</h1>

                {/* Блок с информацией о книге */}
                <div className={styles.bookBlock}>
                    <div className={styles.bookCover}>
                        <div className={styles.coverPlaceholder}>
                            <Icon name="book" size={64} />
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
                    {libraries.map((library) => (
                        <div
                            key={library.id}
                            className={`${styles.libraryCard} ${
                                selectedLibrary === library.id ? styles.libraryCardActive : ''
                            } ${library.availableCopies === 0 ? styles.libraryCardDisabled : ''}`}
                            onClick={() => {
                                if (library.availableCopies > 0) {
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
                                    {library.availableCopies || 0}/{library.totalCopies || 0}
                                </span>
                            </div>
                        </div>
                    ))}
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