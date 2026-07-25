import React, { useState } from 'react';
import { FindBookButton, HorizontalScroll } from '../../components/ui/Button';
import { SearchInput, DateInput } from '../../components/ui/Input';
import { BookCard, Book } from '../../components/ui/BookCard';
import { useNavigate } from 'react-router-dom';
import Group from '../../assets/icons/backgrounds/Group1.svg';
import Group1 from '../../assets/icons/book/Group.svg';
import amorphousshape3 from '../../assets/icons/backgrounds/amorphousshape3.svg';
import stackofbooks1 from '../../assets/icons/book/stackofbooks1.svg';
import { LibrariesMap } from '../../components/widgets/LibrariesMap/LibrariesMap';
import styles from './HomePage.module.css';

// Временные данные для "Выбор редакции"
const editorBooks: Book[] = [
    {
        id: 1,
        title: 'Война и мир',
        author: 'Лев Толстой',
        year: 1869,
        description: 'Великий роман-эпопея о жизни русского общества в эпоху наполеоновских войн.',
        library: 'Центральная библиотека',
        coverImage: '',
    },
    {
        id: 2,
        title: 'Преступление и наказание',
        author: 'Фёдор Достоевский',
        year: 1866,
        description: 'Социально-психологический роман о теории и её последствиях.',
        library: 'Городская библиотека',
        coverImage: '',
    },
    {
        id: 3,
        title: 'Анна Каренина',
        author: 'Лев Толстой',
        year: 1877,
        description: 'Роман о трагической любви и поиске смысла жизни.',
        library: 'Библиотека им. Пушкина',
        coverImage: '',
    },
];

const newBooks: Book[] = [
  {
    id: 4,
    title: 'Дом, в котором...',
    author: 'Мариам Петросян',
    year: 2019,
    description: 'Мистический роман-антиутопия о доме для детей-инвалидов, который становится их миром.',
    library: 'Библиотека им. Петросян',
    coverImage: '',
  },
  {
    id: 5,
    title: 'Психология влияния',
    author: 'Роберт Чалдини',
    year: 2021,
    description: 'Классическая книга о том, как люди принимают решения и как на них влиять.',
    library: 'Центральная библиотека',
    coverImage: '',
  },
  {
    id: 6,
    title: 'Сто лет одиночества',
    author: 'Габриэль Гарсиа Маркес',
    year: 2020,
    description: 'Всемирно известный роман о семье Буэндиа и вымышленном городе Макондо.',
    library: 'Городская библиотека',
    coverImage: '',
  },
  {
    id: 7,
    title: 'Искусство войны',
    author: 'Сунь Цзы',
    year: 2022,
    description: 'Древнекитайский трактат о стратегии и тактике, актуальный и сегодня.',
    library: 'Библиотека им. Сунь Цзы',
    coverImage: '',
  },
  {
    id: 8,
    title: 'Маленькая жизнь',
    author: 'Ханья Янагихара',
    year: 2023,
    description: 'Современный роман о дружбе, травме и любви, покоривший читателей по всему миру.',
    library: 'Библиотека им. Янагихара',
    coverImage: '',
  },
  {
    id: 9,
    title: 'Квантовая физика для чайников',
    author: 'Стивен Хокинг',
    year: 2024,
    description: 'Доступное объяснение сложных концепций квантовой физики от великого ученого.',
    library: 'Центральная библиотека',
    coverImage: '',
  },
];

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [authorQuery, setAuthorQuery] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');

    const handleSearch = () => {
        const title = searchQuery.trim();
        const author = authorQuery.trim();
        
        console.log('Поиск:', { title, author, dateStart, dateEnd });
        
        if (title || author) {
            // Передаём параметры через query string
            const params = new URLSearchParams();
            if (title) params.set('title', title);
            if (author) params.set('author', author);
            navigate(`/search?${params.toString()}`);
        } else {
            navigate('/search');
        }
    };

    const handleBook = (bookId: number) => {
        console.log('Бронирование книги:', bookId);
    };
    

    return (
        <div className={styles.page}>
            <div className={styles.pageBlock}>
                <div className={styles.searchSection}>
                    {/* Поиск по названию */}
                    <div className={styles.searchField}>
                        <label className={styles.searchLabel}>Название</label>
                        <SearchInput
                            placeholder="Например, Евгений Онегин"
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSearch={handleSearch}
                            className={styles.homeSearchInput}
                        />
                    </div>

                    {/* Поиск по автору */}
                    <div className={styles.searchField}>
                        <label className={styles.searchLabel}>Автор</label>
                        <SearchInput
                            placeholder="Например, Александр Пушкин"
                            value={authorQuery}
                            onChange={setAuthorQuery}
                            onSearch={handleSearch}
                            className={styles.homeSearchInput}
                        />
                    </div>

                    <div className={styles.wrapper}>
                        <div className={styles.searchField}>
                            <label className={styles.searchLabel}>Выдача книги</label>
                            <DateInput
                                value={dateStart}
                                onChange={setDateStart}
                                placeholder="Дата начала"
                            />
                        </div>
                        <div className={styles.searchField}>
                            <label className={styles.searchLabel}>Возврат книги</label>
                            <DateInput
                                value={dateEnd}
                                onChange={setDateEnd}
                                placeholder="Дата окончания"
                            />
                        </div>
                    </div>

                    {/* Кнопка поиска */}
                    <div className={styles.searchButtonWrapper}>
                        <FindBookButton onClick={handleSearch} />
                    </div>
                </div>
                <div className={styles.decorContainer}>
                    <img src={Group1} alt="" className={styles.decorUp} aria-hidden="true" />
                    <img src={Group} alt="" className={styles.decorBack} aria-hidden="true" />
                </div>
            </div>
            {/* Выбор редакции */}
            <section className={styles.editorSection}>
                <h2 className={styles.sectionTitle}>Выбор редакции</h2>
                <HorizontalScroll title="">
                    {editorBooks.map((book) => (
                        <BookCard key={book.id} book={book} size="large" onBook={handleBook} />
                    ))}
                </HorizontalScroll>
            </section>

            <section id="about" className={styles.aboutSection}>
                <div className={styles.aboutContainer}>
                    {/* Блок с текстом */}
                    <div className={styles.aboutContent}>
                        <h2 className={styles.aboutTitle}>О нас</h2>
                        <p className={styles.aboutText}>
                            Мы — команда энтузиастов, создавшая платформу для поиска и бронирования
                            книг в библиотеках. Наша цель — сделать чтение доступным и удобным для
                            каждого.
                        </p>
                        <p className={styles.aboutText}>
                            Мы объединяем библиотеки со всего города в единую систему, позволяя вам
                            находить нужные книги, бронировать их и получать уведомления о
                            готовности.
                        </p>
                        <p className={styles.aboutText}>
                            Присоединяйтесь к нашему сообществу читателей! Более 10 000 книг уже
                            ждут вас в нашей системе. Читайте больше, узнавайте новое и развивайтесь
                            вместе с нами.
                        </p>
                    </div>

                    {/* Блок с картинками для фона */}
                    <div className={styles.aboutImage}>
                        <img
                            src={stackofbooks1}
                            alt=""
                            className={styles.decorUpg}
                            aria-hidden="true"
                        />
                        <img
                            src={amorphousshape3}
                            alt=""
                            className={styles.decorBackg}
                            aria-hidden="true"
                        />
                    </div>
                </div>
            </section>
{/* Новые поступление */}
            <section className={styles.editorSection}>
                <h2 className={styles.sectionTitle}>Новые поступления</h2>
                <HorizontalScroll title="">
                    {newBooks.map((book) => (
                        <BookCard key={book.id} book={book} size="large" onBook={handleBook} />
                    ))}
                </HorizontalScroll>
            </section>
            <LibrariesMap className={styles.homeLibrariesMap} />

        </div>
    );
};
