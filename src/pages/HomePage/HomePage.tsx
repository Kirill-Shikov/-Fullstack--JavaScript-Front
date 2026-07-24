import React from 'react';
import { FindBookButton } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Главная страница</h1>
      <FindBookButton onClick={() => console.log('Поиск')} />
    </div>
  );
};