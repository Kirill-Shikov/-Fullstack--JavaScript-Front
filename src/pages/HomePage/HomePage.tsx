import React from 'react';
import { FindBookButton } from '../../components/ui/Button';
import { HorizontalScroll } from '../../components/widgets/HorizontalScroll/HorizontalScroll';
import { SearchInput, DateInput } from '../../components/ui/Input';
import { BookCard } from '../../components/ui/BookCard';
import { LibrariesMap } from '../../components/widgets/LibrariesMap/LibrariesMap';
import { useHomePage } from '../../hooks/useHomePage';
import Group from '../../assets/icons/backgrounds/Group1.svg';
import Group1 from '../../assets/icons/book/Group.svg';
import amorphousshape3 from '../../assets/icons/backgrounds/amorphousshape3.svg';
import stackofbooks1 from '../../assets/icons/book/stackofbooks1.svg';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
    const {
        searchQuery,
        authorQuery,
        dateStart,
        dateEnd,
        editorBooks,
        newBooks,
        loading,
        setSearchQuery,
        setAuthorQuery,
        setDateStart,
        setDateEnd,
        handleSearch,
        handleBook,
    } = useHomePage();

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.loading}>Загрузка книг...</div>
            </div>
        );
    }

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