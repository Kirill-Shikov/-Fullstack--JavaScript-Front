import { useState } from 'react';
import { useAuth } from './useAuth';

interface UseLoginModalReturn {
  isRegisterMode: boolean;
  fullName: string;
  email: string;
  password: string;
  error: string;
  isLoadingState: boolean;
  setFullName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  toggleMode: () => void;
  handleButtonClick: () => void;
}

export const useLoginModal = (onLogin?: () => void, onClose?: () => void): UseLoginModalReturn => {
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
      // Регистрация
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
        contactPhone: '',
      });
      setLocalLoading(false);

      if (result.success) {
        onLogin?.();
        onClose?.();
      } else {
        setError(result.error || 'Ошибка регистрации');
      }
    } else {
      // Вход
      if (!fullName || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }

      setLocalLoading(true);
      const result = await login(fullName, password);
      setLocalLoading(false);

      if (result.success) {
        onLogin?.();
        onClose?.();
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

  return {
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
  };
};