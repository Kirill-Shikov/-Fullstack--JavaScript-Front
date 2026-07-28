import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { FindBookButton } from '../../components/ui/Button';
import { SearchInput, DateInput } from '../../components/ui/Input';
import { BookCard, Book } from '../../components/ui/BookCard';
import { booksAPI } from '../../api/api';
import books2 from '../../assets/icons/book/books2.svg';
import styles from './SearchResultsPage.module.css';

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

    const performSearch = async (title: string, author: string) => {
        setIsLoading(true);
        try {
            const params: { title?: string; author?: string } = {};
            if (title.trim()) params.title = title.trim();
            if (author.trim()) params.author = author.trim();
            
            const response = await booksAPI.search(params);
            setResults(response.data);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
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

    const handleBook = (bookId: number) => {
        console.log('Бронирование книги:', bookId);
        navigate(`/booking/${bookId}`);
    };

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
                            <BookCard 
                                key={book.id} 
                                book={book} 
                                size="medium" 
                                onBook={handleBook} 
                                className={styles.btn}
                            />
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