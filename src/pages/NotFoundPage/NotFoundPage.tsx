// src/pages/NotFoundPage/NotFoundPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FindBookButton } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon/Icon';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.Iconcontainer}>
        <Icon name="amorphous shape 2" className={styles.IconShape}/>
        <Icon name="amorphous shape 1" className={styles.IconsShape}/>
        <Icon name="book 3" className={styles.book1} />
          <Icon name="book 2" className={styles.book2}  />
          <Icon name="book 4" className={styles.book3}  />
          <Icon name="book 5" className={styles.book4}  />
          <Icon name="book 6" className={styles.paper}  />
          <Icon name="book 7" className={styles.book5}  />
          <Icon name="book1" className={styles.book6}  />
      </div>
      <div className={styles.container}>
        
        
        {/* Правая часть с текстом и кнопкой */}
        <div className={styles.contentSide}>
          <p className={styles.errorLabel}>Ошибка</p>
          <h1 className={styles.errorCode}>404</h1>
          <p className={styles.errorText}>
            Упс, кажется что-то пошло<br />
            не так
          </p>
          <FindBookButton
            className={styles.homeButton}
            onClick={() => navigate('/')}
          >
            На главную
          </FindBookButton>
        </div>

      </div>
    </div>
  );
};