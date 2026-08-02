import React from 'react';
import { Input } from '../../../components/ui/Input';
import { FindBookButton, LoginButton } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { Icon } from '../../../components/ui/Icon';
import { useAdminLibraries } from '../../../hooks/useAdminLibraries';
import search from '../../../assets/icons/navigation/search.svg';
import styles from '../../ProfilePage/tabs/AdminLibrariesTab.module.css';

export const AdminLibrariesTab: React.FC = () => {
    const {
        loading,
        error,
        searchQuery,
        currentPage,
        isModalOpen,
        newLibrary,
        isSubmitting,
        currentLibraries,
        totalPages,
        setSearchQuery,
        setCurrentPage,
        setIsModalOpen,
        setNewLibrary,
        handleAddLibrary,
        handleRowClick,
    } = useAdminLibraries();

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.profilePage}>
            <div className={styles.wrapperprofile}>
                <h2 className={styles.greeting}>Библиотеки</h2>
                <FindBookButton
                    className={styles.adminAddBookButton}
                    onClick={() => setIsModalOpen(true)}
                >
                    Добавить библиотеку
                </FindBookButton>
            </div>

            <div className={styles.searchWrapper}>
          <img src={search} alt="" className={styles.searchIcon} aria-hidden="true" />
      </div>
        <Input
          placeholder="Введите ID библиотеки или адрес"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />

            {/* Таблица */}
            <div className={styles.tableWrapper}>
                <table className={styles.bookTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Адрес</th>
                            <th>Всего книг</th>
                            <th>Доступно</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLibraries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>
                                    Библиотеки не найдены
                                </td>
                            </tr>
                        ) : (
                            currentLibraries.map((library) => (
                                <tr
                                    key={library.id}
                                    className={styles.userRow}
                                    onClick={() => handleRowClick(library.id)}
                                >
                                    <td className={styles.cellIdP}>{library.id}</td>
                                    <td>{library.name}</td>
                                    <td>{library.address}</td>
                                    <td>{library.totalCopies}</td>
                                    <td>{library.availableCopies}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className={styles.paginationWrapper}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            const wrapper = document.querySelector(`.${styles.tableWrapper}`);
                            if (wrapper) {
                                wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                    />
                </div>
            )}

            {/* ===== ПОПАП ДОБАВЛЕНИЯ БИБЛИОТЕКИ ===== */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Добавить новую библиотеку</h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setIsModalOpen(false)}
                            >
                                <Icon name="x" size={24} className={styles.iconX} />
                            </button>
                        </div>

                        <div className={styles.modalFields}>
                            {/* Название - во всю строку */}
                            <div className={styles.modalField}>
                                <label>Название</label>
                                <Input
                                    placeholder="Например, Центральная городская библиотека"
                                    value={newLibrary.name}
                                    onChange={(e) =>
                                        setNewLibrary({ ...newLibrary, name: e.target.value })
                                    }
                                />
                            </div>

                            {/* Адрес - во всю строку */}
                            <div className={styles.modalField}>
                                <label>Адрес</label>
                                <Input
                                    placeholder="Например, ул. Бауманская, д. 58/25"
                                    value={newLibrary.address}
                                    onChange={(e) =>
                                        setNewLibrary({ ...newLibrary, address: e.target.value })
                                    }
                                />
                            </div>

                            {/* Описание - во всю строку */}
                            <div className={styles.modalField}>
                                <label>Описание</label>
                                <textarea
                                    className={styles.modalTextarea}
                                    placeholder="Например, Крупнейший центр чтения ."
                                    value={newLibrary.description}
                                    onChange={(e) =>
                                        setNewLibrary({ ...newLibrary, description: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className={styles.modalButtons}>
                            <FindBookButton
                                className={styles.modalCancel}
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отменить
                            </FindBookButton>
                            <LoginButton
                                className={styles.modalSubmit}
                                onClick={handleAddLibrary}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Добавление...' : 'Добавить библиотеку'}
                            </LoginButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};