import React, { useState } from 'react';
import { Modal } from '../ui/Modal/Modal';
import { FindBookButton } from '../ui/Button';
import { Input, PasswordInput } from '../ui/Input';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (fullName: string, password: string) => void;
  onRegister?: (fullName: string, email: string, password: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Валидация email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация для регистрации
    if (isRegister) {
      if (!fullName || !email || !password || !confirmPassword) {
        setError('Заполните все поля');
        return;
      }

      if (!isValidEmail(email)) {
        setError('Введите корректный email');
        return;
      }

      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }

      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
    } else {
      // Валидация для входа
      if (!fullName || !password) {
        setError('Заполните все поля');
        return;
      }
    }

    setIsLoading(true);
    
    setTimeout(() => {
      console.log(isRegister ? 'Регистрация:' : 'Вход:', { fullName, email, password });
      setIsLoading(false);
      
      if (isRegister) {
        onRegister?.(fullName, email, password);
      } else {
        onLogin?.(fullName, password);
      }
      onClose();
    }, 1000);
  };

  const handleButtonClick = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isRegister ? 'Регистрация' : 'Вход'}>
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

        {isRegister && (
          <>
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

            <div className={styles.field}>
              <label className={styles.label}>Пароль</label>
              <PasswordInput
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Подтверждение пароля</label>
              <PasswordInput
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
              />
            </div>
          </>
        )}

        {!isRegister && (
          <div className={styles.field}>
            <label className={styles.label}>Пароль</label>
            <PasswordInput
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.searchButtonWrapper}>
          <FindBookButton 
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : (isRegister ? 'Зарегистрироваться' : 'Войти')}
          </FindBookButton>
        </div>

        <p className={styles.registerHint}>
          {isRegister ? 'У меня уже есть аккаунт!' : 'Нет аккаунта?'}
          <button 
            type="button"
            className={styles.link}
            onClick={toggleMode}
          >
            {isRegister ? ' Войти' : ' Зарегистрироваться'}
          </button>
        </p>
      </form>
    </Modal>
  );
};