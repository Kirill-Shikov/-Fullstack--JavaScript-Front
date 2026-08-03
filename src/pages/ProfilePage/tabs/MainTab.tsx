import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FindBookButton } from '../../../components/ui/Button';
import { LoginButton } from '../../../components/ui/Button/LoginButton';
import { UserStats } from '../../../hooks/useProfile';
import { SupportChatWidget } from '../../../components/widgets/SupportChat/SupportChatWidget';
import { SupportChatButton } from '../../../components/ui/Button/SupportChatButton';
import styles from '../tabs/MainTab.module.css';

interface MainTabProps {
  stats: UserStats | null;
}

export const MainTab: React.FC<MainTabProps> = ({ stats }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleGoToBookings = () => {
    navigate('/profile/books?filter=booked');
  };

  const totalBooks = stats?.totalBooks ?? 0;
  const activeBookings = stats?.activeBookings ?? 0;

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.greeting}>Добро пожаловать в личный кабинет!</h1>
      
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>
            Вы забронировали <span className={styles.statNumber}>{totalBooks}</span> книг
          </span>
          
          <span className={styles.statLabel}>
            {activeBookings > 0 ? (
              <>Сейчас у вас <span className={styles.statNumber}>{activeBookings}</span> активных бронирований</>
            ) : (
              'Сейчас у вас нет активных бронирований'
            )}
          </span>
        </div>
        
        <div className={styles.actions}>
          <FindBookButton
            className={styles.primaryButton}
            onClick={handleGoToBookings}
          >
            Перейти к броням
          </FindBookButton>
          <LoginButton
            className={styles.secondaryButton}
            onClick={() => navigate('/search')}
          >
            Найти книгу
          </LoginButton>
        </div>
      </div>

      {/* Виджет поддержки */}
      <div className={styles.chatWidgetWrapper}>
        {isChatOpen && (
          <SupportChatWidget 
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)} 
          />
        )}
        <SupportChatButton onClick={handleToggleChat} />
      </div>
    </div>
  );
};