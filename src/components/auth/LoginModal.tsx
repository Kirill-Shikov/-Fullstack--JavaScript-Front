import React from 'react';
import { Modal } from '../ui/Modal/Modal';
import { FindBookButton, Input, PasswordInput } from '../ui';
import { useLoginModal } from '../../hooks/useLoginModal';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const {
    isRegisterMode,
    fullName,
    email,
    password,
    error,
    isLoadingState,
    setFullName,
    setEmail,
    setPassword,
    toggleMode,
    handleButtonClick,
  } = useLoginModal(onLogin, onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleButtonClick();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRegisterMode ? 'Регистрация' : 'Вход'}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>ФИО</label>
          <Input
            placeholder="Иванов Иван Иванович"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.input}
          />
        </div>

        {isRegisterMode && (
          <div className={styles.field}>
            <label className={styles.label}>Почта</label>
            <Input
              type="email"
              placeholder="ivanov@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <PasswordInput
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.searchButtonWrapper}>
          <FindBookButton 
            onClick={handleButtonClick}
            disabled={isLoadingState}
          >
            {isLoadingState ? 'Загрузка...' : (isRegisterMode ? 'Зарегистрироваться' : 'Войти')}
          </FindBookButton>
        </div>

        <p className={styles.registerHint}>
          {isRegisterMode ? 'У меня уже есть аккаунт!' : 'Нет аккаунта?'}
          <button 
            type="button"
            className={styles.link}
            onClick={toggleMode}
          >
            {isRegisterMode ? ' Войти' : ' Зарегистрироваться'}
          </button>
        </p>
      </form>
    </Modal>
  );
};