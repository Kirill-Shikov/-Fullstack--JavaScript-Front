import React, { useState } from 'react';
import { Modal } from '../ui/Modal/Modal';
import { FindBookButton } from '../ui/Button';
import { Input, PasswordInput } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';
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
  const { login, register, isLoading } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
      console.log('=== РЕГИСТРАЦИЯ ===');
      console.log('ФИО:', fullName);
      console.log('Почта:', email);
      console.log('Пароль:', password);
      
      if (!fullName || !email || !password) {
        setError('Пожалуйста, заполните все поля');
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

      setLocalLoading(true);
      const result = await register({ 
        email, 
        password, 
        name: fullName,
        contactPhone: '' 
      });
      setLocalLoading(false);

      if (result.success) {
        onLogin?.();
        onClose();
      } else {
        setError(result.error || 'Ошибка регистрации');
      }
    } else {
      // ===== ВХОД =====
      if (!fullName || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }

      setLocalLoading(true);
      const result = await login(fullName, password);
      console.log('Результат входа:', result);
      setLocalLoading(false);

      if (result.success) {
        window.location.reload();  // ← ПЕРЕЗАГРУЗКА!
        onLogin?.();
        onClose();
      } else {
        setError('Неверный логин или пароль. Проверьте введённые данные и попробуйте снова.');
      }
    }
  };

  const handleButtonClick = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setFullName('');
    setEmail('');
    setPassword('');
  };

  const isLoadingState = isLoading || localLoading;
  
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