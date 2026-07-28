// src/pages/ProfilePage/tabs/ProfileTab.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Input, PasswordInput } from '../../../components/ui/Input';
import { UserProfile, updateProfile, uploadAvatar } from '../../../api/profile.api';
import { Icon } from '../../../components/ui/Icon';
import styles from '../ProfilePage.module.css';

interface ProfileTabProps {
  user: UserProfile | null;
  onUpdate?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Заполняем форму при загрузке данных
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  // Обработчик для телефона - только цифры
  const handlePhoneChange = (value: string) => {
    // Удаляем все не-цифры
    const onlyDigits = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phone: onlyDigits }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const updateData: Partial<UserProfile> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password) {
        // @ts-ignore
        updateData.password = formData.password;
      }

      await updateProfile(updateData);
      
      setMessage({ type: 'success', text: 'Профиль успешно обновлен!' });
      
      if (onUpdate) {
        onUpdate();
      }
      
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Ошибка обновления профиля' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка аватара
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Пожалуйста, выберите изображение' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Размер файла не должен превышать 5MB' });
      return;
    }

    setAvatarLoading(true);
    setMessage(null);

    try {
      await uploadAvatar(file);
      setMessage({ type: 'success', text: 'Аватар успешно обновлен!' });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Ошибка загрузки аватара' 
      });
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Удаление аватара
  const handleDeleteAvatar = async () => {
    setShowDeleteConfirm(false);
    setAvatarLoading(true);
    setMessage(null);

    try {
      await updateProfile({ avatar: null });
      setMessage({ type: 'success', text: 'Аватар удален!' });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Ошибка удаления аватара' 
      });
    } finally {
      setAvatarLoading(false);
    }
  };

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

  return (
    <div className={styles.profilePage}>
      <h2 className={styles.greeting}>Личная информация</h2>

      <form onSubmit={handleSubmit} className={styles.profileInfo}>
        {/* ФИО */}
        <div className={styles.field}>
          <label className={styles.label}>ФИО</label>
          <Input
            placeholder="Иванов Иван Иванович"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Телефон - только цифры */}
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

        {/* Email */}
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

        {/* Пароль */}
        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <PasswordInput
            placeholder="*******************"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Аватар */}
        <div className={styles.field}>
          <label className={styles.label}>Аватар</label>
          <div className={styles.avatarUpload}>
            {user.avatar && (
              <div className={styles.avatarPreview}>
                <img src={user.avatar} alt="Аватар" className={styles.avatarPreviewImg} />
              </div>
            )}

            <div className={styles.avatarButtons}>
              
              <label htmlFor="avatar-upload" className={styles.uploadButton}>
                <Icon name="plus" size={20} />
                {avatarLoading ? 'Загрузка...' : user.avatar ? 'Изменить фото' : 'Добавить фото'}
              </label>

              {user.avatar && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteConfirm(true)}
                    className={styles.deleteAvatarButton}
                    disabled={avatarLoading}
                  >
                    <Icon name="trash-2" size={20} />
                    Удалить фото
                  </button>

                  {showDeleteConfirm && (
                    <div className={styles.confirmOverlay}>
                      <div className={styles.confirmDialog}>
                        <p>Вы уверены, что хотите удалить аватар?</p>
                        <div className={styles.confirmButtons}>
                          <button 
                            type="button" 
                            onClick={() => setShowDeleteConfirm(false)}
                            className={styles.confirmCancel}
                          >
                            Отмена
                          </button>
                          <button 
                            type="button" 
                            onClick={handleDeleteAvatar}
                            className={styles.confirmDelete}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Сообщение об успехе/ошибке */}
        {message && (
          <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.text}
          </div>
        )}

        {/* Кнопка сохранения */}
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};