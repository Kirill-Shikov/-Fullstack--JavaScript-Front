import React from 'react';
import { Input } from '../../../components/ui/Input';
import { FindBookButton, DeleteUserButton, LoginButton } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';
import { Counter } from '../../../components/ui/Counter';
import { Pagination } from '../../../components/ui/Pagination';
import { useLibraryDetail } from '../../../hooks/useLibraryDetail';
import styles from '../../ProfilePage/tabs/LibraryDetailPage.module.css';

export const LibraryDetailPage: React.FC = () => {
    const {
        library,
        currentBooks,
        loading,
        error,
        bookFilter,
        isEditModalOpen,
        isDeleteModalOpen,
        isAddBookModalOpen,
        isEditBookModalOpen,
        isDeleteBookModalOpen,
        selectedBook,
        editData,
        newBook,
        editBookData,
        coverFile,
        coverPreview,
        bookCopies,
        currentPage,
        totalBookPages,
        isAdmin,
        setBookFilter,
        setIsEditModalOpen,
        setIsDeleteModalOpen,
        setIsAddBookModalOpen,
        setIsEditBookModalOpen,
        setIsDeleteBookModalOpen,
        setSelectedBook,
        setEditData,
        setNewBook,
        setEditBookData,
        setBookCopies,
        setCurrentPage,
        handleEdit,
        handleDelete,
        handleAddBook,
        handleEditBook,
        handleSaveBookEdit,
        handleDeleteBook,
        handleCoverUpload,
        handleUploadClick,
        handleCloseEditBookModal,
        navigateBack,
    } = useLibraryDetail();

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!library) return <div className={styles.error}>Библиотека не найдена</div>;

    return (
        <div className={styles.libraryDetailPage}>
            <div className={styles.libraryDetailHeader}>
                <h1 className={styles.libraryDetailName}>{library.name}</h1>
                <FindBookButton
                    className={styles.backButton}
                    onClick={navigateBack}
                >
                    <Icon name="arrow-big-left" size={24} />
                    Назад
                </FindBookButton>
            </div>

            {/* Информация о библиотеке */}
            <div className={styles.libraryDetailInfo}>
                <h3 className={styles.titlelInfo}>Информация</h3>
                <div className={styles.blockinfo}>
                    <div className={styles.libraryDetailLeft}>
                        <span className={styles.libraryDetailLabel}>Название:</span>
                        <span className={styles.libraryDetailLabel}>Адрес:</span>
                        <span className={styles.libraryDetailLabel}>Описание:</span>
                        <span className={styles.libraryDetailLabel}>Всего книг:</span>
                        <span className={styles.libraryDetailLabel}>Доступно книг:</span>
                    </div>
                    <div className={styles.libraryDetailRight}>
                        <span>{library.name}</span>
                        <span>{library.address}</span>
                        <span>{library.description}</span>
                        <span>{library.totalCopies}</span>
                        <span>{library.availableCopies}</span>
                    </div>
                </div>
                <div className={styles.libraryDetailActions}>
                    {/* ========== ТОЛЬКО ЭТИ КНОПКИ ОБЕРНУТЫ В ПРОВЕРКУ ========== */}
                    {isAdmin && (
                        <>
                            <FindBookButton
                                className={styles.libraryDetailEditBtn}
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Редактировать
                            </FindBookButton>
                            <DeleteUserButton
                                className={styles.libraryDetailDeleteBtn}
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                Удалить библиотеку
                            </DeleteUserButton>
                        </>
                    )}
                    {/* ========================================================== */}
                </div>
            </div>

            {/* Книги библиотеки */}
            <div className={styles.libraryBooksSection}>
                <div className={styles.libraryBooksHeader}>
                    <div className={styles.booksFilters}>
                        <button 
                            className={`${styles.filterTab} ${bookFilter === 'all' ? styles.activeFilter : ''}`}
                            onClick={() => setBookFilter('all')}
                        >
                            Все
                        </button>
                        <button 
                            className={`${styles.filterTab} ${bookFilter === 'author' ? styles.activeFilter : ''}`}
                            onClick={() => setBookFilter('author')}
                        >
                            Автор
                        </button>
                        <button 
                            className={`${styles.filterTab} ${bookFilter === 'copies' ? styles.activeFilter : ''}`}
                            onClick={() => setBookFilter('copies')}
                        >
                            Кол-во экземпляров
                        </button>
                    </div>
                    <FindBookButton
                        className={styles.addBookButton}
                        onClick={() => setIsAddBookModalOpen(true)}
                    >
                        <Icon name="plus" size={20} />
                        Добавить книгу
                    </FindBookButton>
                </div>

                {/* Таблица книг */}
                <div className={styles.tableWrapper}>
                    <table className={styles.bookTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Название</th>
                                <th>Автор</th>
                                <th>Год</th>
                                <th>Описание</th>
                                <th>Кол-во экземпляров</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBooks.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.booksEmpty}>
                                        Книги не найдены
                                    </td>
                                </tr>
                            ) : (
                                currentBooks.map((book) => (
                                    <tr key={book.id} className={styles.bookRow}>
                                        <td className={styles.bookCellId}>{book.id}</td>
                                        <td className={styles.bookCellTitle}>{book.title}</td>
                                        <td className={styles.bookCellAuthor}>{book.author}</td>
                                        <td className={styles.bookCellYear}>{book.year}</td>
                                        <td className={styles.bookCellDescription}>{book.description}</td>
                                        <td className={styles.bookCellCopies}>{book.totalCopies}</td>
                                        <td className={styles.bookCellActions}>
                                            <div className={styles.addButton}>
                                                <button 
                                                    className={styles.addEditButton}
                                                    onClick={() => handleEditBook(book)}
                                                >
                                                    <Icon name="pencil" size={16} />
                                                </button>
                                                <button 
                                                    className={styles.adddeliteButton}
                                                    onClick={() => {
                                                        setSelectedBook(book);
                                                        setIsDeleteBookModalOpen(true);
                                                    }}
                                                >
                                                    <Icon name="trash-2" size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Пагинация */}
                {totalBookPages > 1 && (
                    <div className={styles.paginationWrapper}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalBookPages}
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
            </div>

            {/* ===== МОДАЛКА РЕДАКТИРОВАНИЯ БИБЛИОТЕКИ ===== */}
            {isEditModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Редактировать библиотеку</h3>
                            <button className={styles.modalClose} onClick={() => setIsEditModalOpen(false)}>
                                <Icon name="x" size={24} className={styles.iconX} />
                            </button>
                        </div>
                        <div className={styles.modalFields}>
                            <div className={styles.modalField}>
                                <label>Название</label>
                                <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.modalField}>
                                <label>Адрес</label>
                                <Input
                                    value={editData.address}
                                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                />
                            </div>
                            <div className={styles.modalField}>
                                <label>Описание</label>
                                <textarea
                                    className={styles.modalTextarea}
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className={styles.modalButtons}>
                            <FindBookButton className={styles.modalCancel} onClick={() => setIsEditModalOpen(false)}>Отмена</FindBookButton>
                            <LoginButton className={styles.modalSubmit} onClick={handleEdit}>Сохранить изменение</LoginButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== МОДАЛКА УДАЛЕНИЯ БИБЛИОТЕКИ ===== */}
            {isDeleteModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitleDelite}>Вы действительно хотите удалить библиотеку?</h3>
                        <button className={styles.modalClose} onClick={() => setIsDeleteModalOpen(false)}>
                            <Icon name="x" size={24} className={styles.iconX} />
                        </button>
                        <p className={styles.modalTextDelite}>Вместе с библиотекой будут удалены все книги <br/>
                        и бронирования, относящиеся к ней.</p>
                        <div className={styles.modalButtons}>
                            <FindBookButton
                                className={styles.modalCancel}
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Нет, вернуться назад
                            </FindBookButton>
                            <DeleteUserButton className={styles.modalSubmit} onClick={handleDelete}>
                                Да, удалить библиотеку
                            </DeleteUserButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== МОДАЛКА ДОБАВЛЕНИЯ КНИГИ ===== */}
            {isAddBookModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAddBookModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Добавить книгу</h3>
                            <button className={styles.modalClose} onClick={() => setIsAddBookModalOpen(false)}>
                                <Icon name="x" size={24} className={styles.iconX} />
                            </button>
                        </div>
                        <div className={styles.modalFields}>
                            <div className={styles.modalField}>
                                <label>Название</label>
                                <Input
                                    placeholder="Например, Братья Карамазовы"
                                    value={newBook.title}
                                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                />
                            </div>

                            <div className={styles.modalRow}>
                                <div className={styles.modalFieldHalf}>
                                    <label>Автор</label>
                                    <Input
                                        placeholder="Введите автора"
                                        value={newBook.author}
                                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                                    />
                                </div>
                                <div className={styles.modalFieldHalf}>
                                    <label>Год издания</label>
                                    <Input
                                        placeholder="2024"
                                        value={newBook.year}
                                        onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalField}>
                                <label>Описание</label>
                                <textarea
                                    className={styles.modalTextarea}
                                    placeholder="Добавьте описание"
                                    value={newBook.description}
                                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {/* ===== КОЛ-ВО ЭКЗЕМПЛЯРОВ И ОБЛОЖКА ===== */}
                            <div className={styles.modalRowFotter}>
                                <div className={styles.modalField}>
                                    <label>Кол-во экземпляров</label>
                                    <Counter
                                        value={bookCopies}
                                        onChange={setBookCopies}
                                        min={1}
                                        max={100}
                                    />
                                </div>
                                <div className={styles.modalFieldHalf}>
                                    <div className={styles.coverUpload}>
                                        <input
                                            type="file"
                                            id="cover-upload"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                            className={styles.fileInput}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleUploadClick}
                                            className={`${styles.uploadButton} ${coverPreview ? styles.uploadButtonActive : ''}`}
                                        >
                                            <Icon
                                                name="paperclip"
                                                size={24}
                                                className={`${styles.iconBtn} ${coverPreview ? styles.iconBtnActive : ''}`}
                                            />
                                            {coverPreview ? 'Изменить обложку' : 'Загрузить обложку'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalButtons}>
                            <FindBookButton className={styles.modalCancel} onClick={() => setIsAddBookModalOpen(false)}>Отмена</FindBookButton>
                            <LoginButton className={styles.modalSubmit} onClick={handleAddBook}>Добавить книгу</LoginButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== МОДАЛКА РЕДАКТИРОВАНИЯ КНИГИ ===== */}
            {isEditBookModalOpen && selectedBook && (
                <div className={styles.modalOverlay} onClick={handleCloseEditBookModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Редактировать книгу</h3>
                            <button className={styles.modalClose} onClick={handleCloseEditBookModal}>
                                <Icon name="x" size={24} className={styles.iconX} />
                            </button>
                        </div>
                        <div className={styles.modalFields}>
                            <div className={styles.modalField}>
                                <label>Название</label>
                                <Input
                                    value={editBookData.title}
                                    onChange={(e) => setEditBookData({ ...editBookData, title: e.target.value })}
                                />
                            </div>
                            
                            <div className={styles.modalRow}>
                                <div className={styles.modalFieldHalf}>
                                    <label>Автор</label>
                                    <Input
                                        value={editBookData.author}
                                        onChange={(e) => setEditBookData({ ...editBookData, author: e.target.value })}
                                    />
                                </div>
                                <div className={styles.modalFieldHalf}>
                                    <label>Год издания</label>
                                    <Input
                                        value={editBookData.year}
                                        onChange={(e) => setEditBookData({ ...editBookData, year: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalField}>
                                <label>Описание</label>
                                <textarea
                                    className={styles.modalTextarea}
                                    value={editBookData.description}
                                    onChange={(e) => setEditBookData({ ...editBookData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {/* ===== КОЛ-ВО ЭКЗЕМПЛЯРОВ И ОБЛОЖКА ===== */}
                            <div className={styles.modalRowFotter}>
                                <div className={styles.modalFieldHalf}>
                                    <label>Кол-во экземпляров</label>
                                    <Counter
                                        value={parseInt(editBookData.totalCopies) || 1}
                                        onChange={(val) => setEditBookData({ ...editBookData, totalCopies: String(val) })}
                                        min={1}
                                        max={100}
                                    />
                                </div>
                                <div className={styles.modalFieldHalf}>
                                    <div className={styles.coverUpload}>
                                        <input
                                            type="file"
                                            id="cover-upload-edit"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                            className={styles.fileInput}
                                        />
                                        <div className={styles.coverUploadWrapper}>
                                            {coverPreview ? (
                                                <div className={styles.coverInfo} onClick={() => document.getElementById('cover-upload-edit')?.click()}
            style={{ cursor: 'pointer' }}>
                                                    <span className={styles.coverFileName}>
                                                        <Icon name="paperclip" size={16} />
                                                        {coverFile?.name || 'Обложка'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('cover-upload-edit')?.click()}
                                                    className={styles.uploadButton}
                                                >
                                                    <Icon name="paperclip" size={24} />
                                                    Загрузить обложку
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalButtons}>
                            <FindBookButton className={styles.modalCancel} onClick={handleCloseEditBookModal}>Отмена</FindBookButton>
                            <LoginButton className={styles.modalSubmit} onClick={handleSaveBookEdit}>Сохранить изменение</LoginButton>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== МОДАЛКА УДАЛЕНИЯ КНИГИ ===== */}
            {isDeleteBookModalOpen && selectedBook && (
                <div className={styles.modalOverlay} onClick={() => setIsDeleteBookModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Вы действительно хотите удалить эту книгу?</h3>
                        
                        <div className={styles.modalButtons}>
                            <FindBookButton
                                className={styles.modalCancel}
                                onClick={() => setIsDeleteBookModalOpen(false)}
                            >
                                Вернуться назад
                            </FindBookButton>
                            <DeleteUserButton className={styles.modalSubmit} onClick={handleDeleteBook}>
                                Да, удалить
                            </DeleteUserButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};