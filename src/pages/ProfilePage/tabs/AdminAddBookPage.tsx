import React from 'react';
import { Input } from '../../../components/ui/Input';
import { FindBookButton, LoginButton } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';
import { Counter } from '../../../components/ui/Counter';
import { useAdminAddBook } from '../../../hooks/useAdminAddBook';
import styles from './AdminAddBookPage.module.css';

export const AdminAddBookPage: React.FC = () => {
  const {
    libraries,
    selectedLibraryId,
    isDropdownOpen,
    loading,
    isAddBookModalOpen,
    newBook,
    bookCopies,
    coverFile,
    coverPreview,
    selectedLibrary,
    setIsDropdownOpen,
    setIsAddBookModalOpen,
    setNewBook,
    setBookCopies,
    handleSelectLibrary,
    handleCoverUpload,
    handleUploadClick,
    handleAddBook,
    handleOpenCatalog,
  } = useAdminAddBook();

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.adminAddBookPage}>
      {/* Заголовок */}
      <h1 className={styles.pageTitle}>Книги</h1>
      <p className={styles.pageDescription}>
        Выберите одну из библиотек из списка. Книга будет добавлена именно в выбранную библиотеку.
      </p>

      {/* Выпадающий список */}
      <div className={styles.addBookSelectWrapper}>
        <div 
          className={`${styles.addBookSelect} ${isDropdownOpen ? styles.open : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className={styles.selectPlaceholder}>
            {selectedLibrary ? selectedLibrary.name : 'Выберите библиотеку'}
          </span>
          
          <div className={styles.selectArrow}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {isDropdownOpen && (
          <div className={styles.dropdownOptions}>
            {libraries.map((lib, index) => (
              <div
                key={lib.id}
                className={`${styles.dropdownOption} ${selectedLibraryId === lib.id ? styles.activeOption : ''}`}
                onClick={() => handleSelectLibrary(lib.id)}
              >
                <div className={styles.optionNumber}>{index + 1}</div>
                <span className={styles.optionName}>{lib.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Блок с информацией */}
      {selectedLibrary && (
        <div className={styles.libraryInfoCard}>
          <h3 className={styles.libraryInfoTitle}>Информация</h3>
          
          <div className={styles.libraryInfoGrid}>
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>Название:</span>
    <span className={styles.infoValue}>{selectedLibrary.name}</span>
  </div>
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>Адрес:</span>
    <span className={styles.infoValue}>{selectedLibrary.address}</span>
  </div>
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>Описание:</span>
    <span className={styles.infoValue}>{selectedLibrary.description}</span>
  </div>
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>Всего книг:</span>
    <span className={styles.infoValue}>
      {selectedLibrary.totalBooks != null 
        ? selectedLibrary.totalBooks.toLocaleString('ru-RU') 
        : '—'}
    </span>
  </div>
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>Доступно книг:</span>
    <span className={styles.infoValue}>
      {selectedLibrary.availableBooks != null 
        ? selectedLibrary.availableBooks.toLocaleString('ru-RU') 
        : '—'}
    </span>
  </div>
</div>

          <div className={styles.libraryActions}>
            <FindBookButton 
              className={styles.addBookGreenBtn}
              onClick={() => setIsAddBookModalOpen(true)}
            >
              Добавить книгу
            </FindBookButton>
            
            <LoginButton 
              className={styles.openCatalogYellowBtn}
              onClick={handleOpenCatalog}
            >
              Открыть каталог
            </LoginButton>
          </div>
        </div>
      )}

      {/* ========== МОДАЛКА ДОБАВЛЕНИЯ КНИГИ ========== */}
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
              <FindBookButton className={styles.modalCancel} onClick={() => setIsAddBookModalOpen(false)}>
                Отмена
              </FindBookButton>
              <LoginButton className={styles.modalSubmit} onClick={handleAddBook}>
                Добавить книгу
              </LoginButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};