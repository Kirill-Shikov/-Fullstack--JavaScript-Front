import React from 'react';
import { Input } from '../../../components/ui/Input';
import { FindBookButton, DeleteUserButton, LoginButton } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';
import { SupportChatWidget } from '../../../components/widgets/SupportChat/SupportChatWidget';
import { SupportChatButton } from '../../../components/ui/Button/SupportChatButton';
import { useUserDetail } from '../../../hooks/useUserDetail';
import styles from '../ProfilePage.module.css';

export const UserDetailPage: React.FC = () => {
    const {
        user,
        loading,
        error,
        isEditModalOpen,
        isDeleteModalOpen,
        isChatOpen,
        editData,
        books,
        booksLoading,
        activeFilter,
        filteredBooks,
        isSelectOpen,
        isAdmin,
        setIsEditModalOpen,
        setIsDeleteModalOpen,
        setIsChatOpen,
        setEditData,
        setActiveFilter,
        setIsSelectOpen,
        handleToggleChat,
        handleEdit,
        handleDelete,
        navigateBack,
        getRoleLabel,
        fetchUser,
    } = useUserDetail();
    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div className={styles.error}>Пользователь не найден</div>;

    return (
        <div className={styles.userDetailPage}>
            <div className={styles.userDetailHeader}>
                <h1 className={styles.userDetailName}>{user.name}</h1>
                <FindBookButton
                    className={styles.backButton}
                    onClick={navigateBack}
                >
                    <Icon name="arrow-big-left" size={24} />
                    Назад
                </FindBookButton>
            </div>

            {/* Блок личной информации */}
            <div className={styles.userDetailInfo}>
                <h3 className={styles.titlelInfo}>Личная информация</h3>
                <div className={styles.blockinfo}>
                    <div className={styles.userDetailRow}>
                        <span className={styles.userDetailLabel}>ФИО:</span>
                        <span className={styles.userDetailLabel}>Телефон:</span>
                        <span className={styles.userDetailLabel}>Почта:</span>
                        <span className={styles.userDetailLabel}>Роль:</span>
                        <span className={styles.userDetailLabel}>Дата регистрации:</span>
                    </div>
                    <div className={styles.userDetailRow}>
                        <span>{user.name}</span>
                        <span>{user.contactPhone || '—'}</span>
                        <span>{user.email}</span>
                        <span>{getRoleLabel(user.role)}</span>
                        <span>{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                </div>

                <div className={styles.userDetailActions}>
                    {/* ========== КНОПКИ ОБЕРНУТЫ В ПРОВЕРКУ ========== */}
                    {isAdmin && (
                        <>
                            <FindBookButton
                                className={styles.userDetailEditBtn}
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Редактировать
                            </FindBookButton>
                            <DeleteUserButton
                                className={styles.userDetailDeleteBtn}
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                Удалить пользователя
                            </DeleteUserButton>
                        </>
                    )}
                    {/* ================================================ */}
                </div>
            </div>

            {/* --- БЛОК КНИГ ПОЛЬЗОВАТЕЛЯ --- */}
            <div className={styles.userBooksSection}>
                <h3 className={styles.booksTitle}>Книги пользователя</h3>
                
                {/* Панель фильтров (вкладки) */}
                <div className={styles.filterWrapper}>
                    <button 
                        className={`${styles.filterButton} ${activeFilter === 'all' ? styles.filterBtnActive : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        Все
                    </button>
                    <button 
                        className={`${styles.filterButton} ${activeFilter === 'active' ? styles.filterBtnActive : ''}`}
                        onClick={() => setActiveFilter('active')}
                    >
                        <Icon name="bookmarked" className={styles.filterIcon} />
                        Забронирована
                    </button>
                    <button 
                        className={`${styles.filterButton} ${activeFilter === 'returned' ? styles.filterBtnActive : ''}`}
                        onClick={() => setActiveFilter('returned')}
                    >
                        <Icon name="squarecheck" className={styles.filterIcon} />
                        Возвращена
                    </button>
                </div>

                {/* Таблица с книгами (используем стили из AdminUsersTab) */}
                {booksLoading ? (
                    <div className={styles.loading}>Загрузка книг...</div>
                ) : filteredBooks.length === 0 ? (
                    <div className={styles.emptyState}>У пользователя нет книг в этом разделе</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.bookTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название книги / автор</th>
                                    <th>Библиотека</th>
                                    <th>Дата выдачи</th>
                                    <th>Дата возврата</th>
                                    <th>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map((book) => (
                                    <tr key={book.id} className={styles.userRow}>
                                        <td className={styles.cellIdP}>{book.id}</td>
                                        <td>
                                            <div className={styles.userContactInfo}>
                                                <div className={styles.userName}>{book.title}</div>
                                                <div className={styles.userName}>/ {book.author}</div>
                                            </div>
                                        </td>
                                        <td className={styles.userName}>{book.library}</td>
                                        <td>{book.issuedAt}</td>
                                        <td>{book.returnedAt}</td>
                                        <td>
                                            <div
                                                className={`${styles.roleIconWrapper} ${book.status === 'active' ? styles.roleAdmin : styles.roleClient}`}
                                            >
                                                <Icon 
                                                    name={book.status === 'active' ? 'bookmarked' : 'squarecheck'} 
                                                    size={24} 
                                                    className={styles.statusIconGreen} // Добавляем класс для зеленого цвета
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

             {/* Виджет поддержки */}
            <div className={styles.chatWidgetWrapper}>
                <div className={styles.chatContainer}>
                    {isChatOpen && (
                        <div className={styles.chatWindow}>
                            <SupportChatWidget 
                               isOpen={isChatOpen}
    onClose={() => {
        setIsChatOpen(false);
        fetchUser();
    }}
    userId={user?.id}
                            />
                        </div>
                    )}
                    <SupportChatButton onClick={handleToggleChat} hasUnread={user?.hasUnreadMessages} isActive={isChatOpen}/>
                </div>
            </div>
            
            {/* Модалка редактирования */}
            {isEditModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsEditModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Редактировать личные данные</h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                <Icon name="x" size={24} className={styles.iconX} />
                            </button>
                        </div>
                        <div className={styles.modalFields}>
                            {/* ФИО */}
                            <div className={styles.modalField}>
                                <label>ФИО</label>
                                <Input
                                    placeholder="Иванов Иван Иванович"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData({ ...editData, name: e.target.value })
                                    }
                                />
                            </div>

                            {/* Телефон и Email в одной строке */}
                            <div className={styles.modalRow}>
                                <div className={styles.modalFieldHalf}>
                                    <label>Телефон</label>
                                    <Input
                                        placeholder="+790999999"
                                        type="tel"
                                        value={editData.contactPhone}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                contactPhone: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className={styles.modalFieldHalf}>
                                    <label>Email</label>
                                    <Input
                                        placeholder="ivanov@mail.com"
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) =>
                                            setEditData({ ...editData, email: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Роль и дата регистрации в одной строке */}
                            <div className={styles.modalRow}>
                                <div className={styles.modalFieldHalf}>
                                    <label>Роль</label>
                                    <div className={styles.selectWrapper}>
                                        {/* Само поле выбора */}
                                        <div
                                            className={`${styles.modalSelect} ${isSelectOpen ? styles.open : ''} ${editData.role ? styles.filled : ''}`}
                                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                                        >
                                            {/* Отображаем текст выбранной роли */}
                                            {editData.role === 'client'
                                                ? 'Клиент'
                                                : editData.role === 'manager'
                                                  ? 'Библиотекарь'
                                                  : editData.role === 'admin'
                                                    ? 'Администратор'
                                                    : 'Выберите роль'}

                                            <Icon
                                                name={isSelectOpen ? 'chevron-up' : 'chevron-down'}
                                                className={styles.chevrondownIcon}
                                            />
                                        </div>

                                        {/* Выпадающий список */}
                                        {isSelectOpen && (
                                            <div className={styles.dropdownList}>
                                                <div
                                                    className={`${styles.dropdownItem} ${editData.role === 'client' ? styles.active : ''}`}
                                                    onClick={() => {
                                                        setEditData({
                                                            ...editData,
                                                            role: 'client',
                                                        });
                                                        setIsSelectOpen(false);
                                                    }}
                                                >
                                                    Клиент
                                                </div>
                                                <div
                                                    className={`${styles.dropdownItem} ${editData.role === 'manager' ? styles.active : ''}`}
                                                    onClick={() => {
                                                        setEditData({
                                                            ...editData,
                                                            role: 'manager',
                                                        });
                                                        setIsSelectOpen(false);
                                                    }}
                                                >
                                                    Библиотекарь
                                                </div>
                                                <div
                                                    className={`${styles.dropdownItem} ${editData.role === 'admin' ? styles.active : ''}`}
                                                    onClick={() => {
                                                        setEditData({ ...editData, role: 'admin' });
                                                        setIsSelectOpen(false);
                                                    }}
                                                >
                                                    Администратор
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.modalFieldHalf}>
                                    <label>Дата регистрации</label>
                                    <Input
                                        placeholder="12.03.2024"
                                        readOnly
                                        className={styles.dateText}
                                        value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalButtons}>
                            <FindBookButton
                                className={styles.modalCancel}
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Отмена
                            </FindBookButton>
                            <LoginButton className={styles.modalSubmit} onClick={handleEdit}>
                                Сохранить изменение
                            </LoginButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Модалка удаления */}
            {isDeleteModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Вы действительно хотите удалить пользователя?</h3>
                        <div className={styles.modalButtons}>
                            <FindBookButton
                                className={styles.modalCancel}
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Вернуться назад 
                            </FindBookButton>
                            <DeleteUserButton className={styles.modalSubmit} onClick={handleDelete}>
                                Да, удалить пользователя
                            </DeleteUserButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};