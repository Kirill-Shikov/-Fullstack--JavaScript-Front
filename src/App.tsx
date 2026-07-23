import React, { useState } from 'react';
import { 
  BackButton, 
  FindBookButton, 
  LoginButton, 
  DeleteUserButton, 
  ProfileButton 
} from './components/ui/Button';
import { Pagination } from './components/ui/Pagination';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      console.log('Пользователь удален');
    }
  };

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <BackButton onClick={() => console.log('Назад')} />
        <FindBookButton onClick={() => console.log('Поиск книги')} />
        <LoginButton onClick={() => console.log('Вход')} />
        <DeleteUserButton onClick={handleDelete} />
        <ProfileButton onClick={() => console.log('Личный кабинет')} />
      </div>

      <hr />

      <h2>Страница: {currentPage}</h2>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default App;