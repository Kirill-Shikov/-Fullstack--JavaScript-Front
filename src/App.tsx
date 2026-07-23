import React, { useState } from 'react';
import { 
  BackButton, 
  FindBookButton, 
  LoginButton, 
  DeleteUserButton, 
  ProfileButton,
} from './components/ui/Button';
import { Pagination } from './components/ui/Pagination';
import { Input, PasswordInput } from './components/ui/Input';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // Email
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !value.includes('@')) {
      setEmailError('Введите корректный email');
    } else {
      setEmailError('');
    }
  };

  // Password
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value && value.length < 6) {
      setPasswordError('Пароль должен быть не менее 6 символов');
    } else {
      setPasswordError('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      console.log('Пользователь удален');
    }
  };

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ===== ВСЕ КНОПКИ ===== */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <BackButton onClick={() => console.log('Назад')} />
        <FindBookButton onClick={() => console.log('Поиск книги')} />
        <LoginButton onClick={() => console.log('Вход')} />
        <DeleteUserButton onClick={handleDelete} />
        <ProfileButton onClick={() => console.log('Личный кабинет')} />
      </div>

      <hr />

      {/* ===== ПАГИНАЦИЯ ===== */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <hr />

      {/* ===== ИНПУТЫ ===== */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        
        <Input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          errorText={emailError}
        />

        <PasswordInput
          placeholder="Введите пароль"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          errorText={passwordError}
        />

      </div>

    </div>
  );
}

export default App;