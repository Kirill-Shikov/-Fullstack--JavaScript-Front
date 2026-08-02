import React from 'react';
import { Input, PasswordInput } from '../../../components/ui/Input';
import { FindBookButton } from '../../../components/ui/Button/FindBookButton';
import { Icon } from '../../../components/ui/Icon';
import { useProfileTab } from '../../../hooks/useProfileTab';
import { UserProfile } from '../../../api/profile.api';
import styles from '../tabs/ProfileTab.module.css'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface ProfileTabProps {
  user: UserProfile | null;
  onUpdate?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdate }) => {
  const {
    formData,
    loading,
    avatarLoading,
    message,
    displayAvatar,
    hasAvatar,
    fileInputRef,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    handleAvatarUpload,
    handleDeleteTempAvatar,
    handleUploadClick,
  } = useProfileTab(user, onUpdate);

  if (!user) {
    return (
      <div className={styles.profilePage}>
        <h2 className={styles.greeting}>Личная информация</h2>
        <div className={styles.profileInfo}>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const avatarUrl = displayAvatar ? `${API_URL}${displayAvatar}` : null;

  return (
    <div className={styles.profilePage}>
      <h2 className={styles.greeting}>Личная информация</h2>

      <form onSubmit={handleSubmit} className={styles.profileInfo}>
        <div className={styles.field}>
          <label className={styles.label}>ФИО</label>
          <Input
            placeholder="Иванов Иван Иванович"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Телефон</label>
          <Input
            placeholder="+79991234567"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={styles.input}
            type="tel"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <Input
            placeholder="email@mail.ru"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={styles.input}
            type="email"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <PasswordInput
            placeholder="*******************"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Аватар</label>
          <div className={styles.avatarUpload}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className={styles.fileInput}
              id="avatar-upload"
            />

            {displayAvatar && (
              <div className={styles.avatarPreview}>
                <img 
                  src={`http://localhost:3000${displayAvatar}`} 
                  alt="Аватар" 
                  className={styles.avatarPreviewImg}
                  onError={(e) => {
                    console.error('❌ Ошибка загрузки аватара:', displayAvatar);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className={styles.avatarButtons}>
              <button 
                type="button" 
                onClick={handleUploadClick}
                className={`${styles.uploadButton} ${hasAvatar ? styles.uploadButtonActive : ''}`}
                disabled={avatarLoading}
              >
                <Icon 
                  name="paperclip" 
                  size={24} 
                  className={`${styles.iconBtn} ${hasAvatar ? styles.iconBtnActive : ''}`}
                />
                {avatarLoading ? 'Загрузка...' : hasAvatar ? 'Изменить фото' : 'Добавить фото'}
              </button>

              {hasAvatar && (
                <button 
                  type="button" 
                  onClick={handleDeleteTempAvatar}
                  className={styles.deleteAvatarButton}
                  disabled={avatarLoading}
                >
                  <Icon name="x" size={24} className={styles.iconBtnDelete} />
                  Удалить фото
                </button>
              )}
            </div>
          </div>
        </div>

        

        <FindBookButton 
          className={styles.saveButton}
          disabled={loading}
          type="submit"
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </FindBookButton>
      </form>
    </div>
  );
};