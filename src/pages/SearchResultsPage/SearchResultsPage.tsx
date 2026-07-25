import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { FindBookButton } from '../../components/ui/Button';
import { SearchInput, DateInput } from '../../components/ui/Input';
import { BookCard, Book } from '../../components/ui/BookCard';
import books2 from '../../assets/icons/book/books2.svg';
import styles from './SearchResultsPage.module.css';

const mockBooks: Book[] = [
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
    {
        id: 4,
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        year: 1967,
        description: 'Роман о дьяволе, любви и творчестве.',
        library: 'Библиотека им. Булгакова',
        coverImage: '',
    },
    {
        id: 5,
        title: 'Идиот',
        author: 'Фёдор Достоевский',
        year: 1869,
        description: 'Роман о «положительно прекрасном человеке».',
        library: 'Городская библиотека',
        coverImage: '',
    },
    {
        id: 6,
        title: 'Доктор Живаго',
        author: 'Борис Пастернак',
        year: 1957,
        description: 'Роман о судьбе человека на фоне русской истории.',
        library: 'Центральная библиотека',
        coverImage: '',
    },
    {
        id: 7,
        title: 'Тихий Дон',
        author: 'Михаил Шолохов',
        year: 1940,
        description: 'Роман-эпопея о казачестве в годы Первой мировой и Гражданской войны.',
        library: 'Библиотека им. Шолохова',
        coverImage: '',
    },
    {
        id: 8,
        title: 'Евгений Онегин',
        author: 'Александр Пушкин',
        year: 1833,
        description: 'Роман в стихах о судьбе русского дворянина.',
        library: 'Библиотека им. Пушкина',
        coverImage: '',
    },
    {
        id: 9,
        title: 'Мёртвые души',
        author: 'Николай Гоголь',
        year: 1842,
        description: 'Поэма о русской душе и человеческих пороках.',
        library: 'Городская библиотека',
        coverImage: '',
    },
];

export const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
     const navigate = useNavigate();
    const titleParam = searchParams.get('title') || '';
    const authorParam = searchParams.get('author') || '';

    const [searchQuery, setSearchQuery] = useState(titleParam);
    const [authorQuery, setAuthorQuery] = useState(authorParam);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [results, setResults] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const performSearch = (title: string, author: string) => {
        setIsLoading(true);
        
        setTimeout(() => {
            const filtered = mockBooks.filter((book) => {
                const matchTitle = book.title.toLowerCase().includes(title.toLowerCase());
                const matchAuthor = book.author.toLowerCase().includes(author.toLowerCase());
                
                if (title.trim() && author.trim()) {
                    return matchTitle && matchAuthor;  // И
                }
                if (title.trim()) {
                    return matchTitle;
                }
                if (author.trim()) {
                    return matchAuthor;
                }
                return true;
            });
            setResults(filtered);
            setIsLoading(false);
        }, 300);
    };

    const handleSearch = () => {
        const title = searchQuery.trim();
        const author = authorQuery.trim();
        
        if (title || author) {
            const params = new URLSearchParams();
            if (title) params.set('title', title);
            if (author) params.set('author', author);
            navigate(`/search?${params.toString()}`);
            performSearch(title, author);
        } else {
            performSearch('', '');
        }
    };

    // При загрузке или изменении параметров — выполняем поиск
    useEffect(() => {
        performSearch(titleParam, authorParam);
    }, [titleParam, authorParam]);

    return (
        <div className={styles.page}>
            <div className={styles.pageBlock}>
                <div className={styles.searchSection}>
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

                    <div className={styles.searchButtonWrapper}>
                        <FindBookButton onClick={handleSearch} />
                    </div>
                </div>
                <div className={styles.decorContainer}>
                    <img src={books2} alt="" className={styles.decorUp} aria-hidden="true" />
                </div>
            </div>

            <div className={styles.resultsBlock}>
                {results.length > 0 && (
                    <div className={styles.resultsHeader}>
                        <h2 className={styles.resultsTitle}>
                            Найдено: {results.length} {results.length === 1 ? 'книга' : 'книг'}
                        </h2>
                    </div>
                )}

                {results.length > 0 ? (
                    <div className={styles.resultsGrid}>
                        {results.map((book) => (
                            <BookCard key={book.id} book={book} size="medium" onBook={() => {}} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyResults}>
                        <p className={styles.emptyTitle}>По вашему запросу ничего не найдено</p>
                        <p className={styles.emptyHint}>
                            К сожалению, по указанным данным книга не найдена. Проверьте правильность написания или попробуйте изменить параметры поиска (автор, название, дата).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};