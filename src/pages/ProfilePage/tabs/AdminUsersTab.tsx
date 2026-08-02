import React from 'react';
import { Input } from '../../../components/ui/Input';
import { FindBookButton, LoginButton } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { Icon } from '../../../components/ui/Icon';
import { useAdminUsers } from '../../../hooks/useAdminUsers';
import search from '../../../assets/icons/navigation/search.svg';
import styles from '../tabs/AdminUsersTab.module.css';

export const AdminUsersTab: React.FC = () => {
    const {
        loading,
        error,
        searchQuery,
        roleFilter,
        currentPage,
        isModalOpen,
        newUser,
        isSubmitting,
        isAdmin,
        currentUsers,
        totalPages,
        setSearchQuery,
        setRoleFilter,
        setCurrentPage,
        setIsModalOpen,
        setNewUser,
        handleAddUser,
        handleRowClick,
        getRoleIcon,
        getRoleClass,
    } = useAdminUsers();

    if (loading) return <div className={styles.loading}>Загрузка...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.profilePage}>
            <div className={styles.wrapperprofile}>
                <h2 className={styles.greeting}>Пользователи</h2>
                {isAdmin && (
                    <FindBookButton className={styles.adminAddBookButton} onClick={() => setIsModalOpen(true)}>
                        Добавить пользователя
                    </FindBookButton>
                )}
            </div>

            <div className={styles.searchWrapper}>
                <img src={search} alt="" className={styles.searchIcon} aria-hidden="true" />
            </div>
            <Input
                placeholder="Введите имя пользователя, id, телефон или почту"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />

            <div className={styles.filterWrapper}>
                <button className={`${styles.filterButton} ${roleFilter === 'all' ? styles.filterBtnActive : ''}`} onClick={() => setRoleFilter('all')}>Все</button>
                <button className={`${styles.filterButton} ${roleFilter === 'admin' ? styles.filterBtnActive : ''}`} onClick={() => setRoleFilter('admin')}>
                    <Icon name="contactround" className={styles.filterIcon} /> Администратор
                </button>
                <button className={`${styles.filterButton} ${roleFilter === 'manager' ? styles.filterBtnActive : ''}`} onClick={() => setRoleFilter('manager')}>
                    <Icon name="bookopen" className={styles.filterIcon} /> Библиотекарь
                </button>
                <button className={`${styles.filterButton} ${roleFilter === 'client' ? styles.filterBtnActive : ''}`} onClick={() => setRoleFilter('client')}>
                    <Icon name="userround" className={styles.filterIcon} /> Клиент
                </button>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.bookTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>ФИО / Контакты</th>
                            <th>Последняя активность</th>
                            <th>Активные брони</th>
                            <th>Роль</th>
                            <th>Чат</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length === 0 ? (
                            <tr><td colSpan={6} className={styles.emptyState}>Пользователи не найдены</td></tr>
                        ) : (
                            currentUsers.map((user) => (
                                <tr key={user.id} className={styles.userRow} onClick={() => handleRowClick(user.id)}>
                                    <td className={styles.cellIdP}>{user.id}</td>
                                    <td>
                                        <div className={styles.userContactInfo}>
                                            <div className={styles.userName}>{user.name}</div>
                                            <div className={styles.userEmail}>{user.email}</div>
                                            {user.contactPhone && <div className={styles.userPhone}>{user.contactPhone}</div>}
                                        </div>
                                    </td>
                                    <td className={styles.lastActivity}>{user.lastActivity || '—'}</td>
                                    <td className={styles.activeBookings}>{user.activeBookings || 0}</td>
                                    <td>
                                        <div className={`${styles.roleIconWrapper} ${getRoleClass(user.role)}`}>
                                            <Icon name={getRoleIcon(user.role)} size={24} />
                                        </div>
                                    </td>
                                    <td>
                                        <button className={styles.chatButton}>
                                            <Icon name="message-square" size={24} />
                                            {user.hasUnreadMessages && <span className={styles.unreadDot} />}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className={styles.paginationWrapper}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => { setCurrentPage(page); }}
                    />
                </div>
            )}

            {/* ===== ПОПАП ДОБАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯ ===== */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Добавление нового пользователя</h3>
                            <button className={styles.modalClose} onClick={() => setIsModalOpen(false)}>
                                <Icon name="x" size={24} className={styles.iconX} />
                            </button>
                        </div>
                        <div className={styles.modalFields}>
                            <div className={styles.modalField}>
                                <label>ФИО</label>
                                <Input placeholder="Иванов Иван Иванович" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                            </div>
                            <div className={styles.modalRow}>
                                <div className={styles.modalFieldHalf}>
                                    <label>Телефон</label>
                                    <Input placeholder="+790999999" type="tel" value={newUser.contactPhone} onChange={(e) => setNewUser({ ...newUser, contactPhone: e.target.value })} />
                                </div>
                                <div className={styles.modalFieldHalf}>
                                    <label>Email</label>
                                    <Input placeholder="ivanov@mail.com" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                </div>
                            </div>
                            <div className={styles.modalField}>
                                <label>Роль</label>
                                <div className={styles.radioGroup}>
                                    <label className={`${styles.radioCard} ${newUser.role === 'client' ? styles.radioCardActive : ''}`} onClick={() => setNewUser({ ...newUser, role: 'client' })}>
                                        <div className={styles.radioCircle}>{newUser.role === 'client' && <div className={styles.radioDot} />}</div>
                                        <span>Клиент</span>
                                    </label>
                                    <label className={`${styles.radioCard} ${newUser.role === 'manager' ? styles.radioCardActive : ''}`} onClick={() => setNewUser({ ...newUser, role: 'manager' })}>
                                        <div className={styles.radioCircle}>{newUser.role === 'manager' && <div className={styles.radioDot} />}</div>
                                        <span>Библиотекарь</span>
                                    </label>
                                    <label className={`${styles.radioCard} ${newUser.role === 'admin' ? styles.radioCardActive : ''}`} onClick={() => setNewUser({ ...newUser, role: 'admin' })}>
                                        <div className={styles.radioCircle}>{newUser.role === 'admin' && <div className={styles.radioDot} />}</div>
                                        <span>Администратор</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalButtons}>
                            <FindBookButton className={styles.modalCancel} onClick={() => setIsModalOpen(false)}>Отмена</FindBookButton>
                            <LoginButton className={styles.modalSubmit} onClick={handleAddUser} disabled={isSubmitting}>
                                {isSubmitting ? 'Добавление...' : 'Добавить пользователя'}
                            </LoginButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};