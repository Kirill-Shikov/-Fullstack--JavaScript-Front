import React from 'react';
import { FindBookButton, LoginButton } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useBookingSuccess } from '../../hooks/useBookingSuccess';
import styles from './BookingSuccessPage.module.css';
import books1 from '../../assets/icons/book/books1.svg';
import bookopen from '../../assets/icons/navigation/bookopen.svg';
import mappin from '../../assets/icons/navigation/mappin.svg';

export const BookingSuccessPage: React.FC = () => {
    const {
        bookingData,
        mapUrl,
        goHome,
        goToBookings,
    } = useBookingSuccess();

    if (!bookingData) {
        return null;
    }

    return (
        <div className={styles.page}>
            <section>
                {/* Иконка успеха */}
                <h1 className={styles.title}>Бронирование успешно оформлено!</h1>
                <div className={styles.block}>
                   {/* Блок с картинками для фона */}
                    <div className={styles.aboutImage}>
                        <img
                            src={books1}
                            alt=""
                            className={styles.decorUpg}
                            aria-hidden="true"
                        />
                    </div>
                

                {/* Информация о бронировании */}
                <div className={styles.blockBook}>
                  <p className={styles.subtitle}>
                    Книга будет ожидать вас в выбранной библиотеке.
                </p>
                <div className={styles.bookingInfo}>
                  
                    <div className={styles.infoRow}>
                        <img
                            src={bookopen}
                            alt=""
                            className={styles.bookopen}
                            aria-hidden="true"
                        />
                        <span className={styles.infoValue}>
                            {bookingData.bookTitle} / <p className={styles.infoName}>{bookingData.userFullName || 'гость'}</p>
                        </span>
                    </div>
                    <div className={styles.infoRow}>
                      <img
                            src={mappin}
                            alt=""
                            className={styles.bookopen}
                            aria-hidden="true"
                        />
                        <span className={styles.infoValue}>
                            {bookingData.libraryName} / <p className={styles.infoName}>{bookingData.libraryAddress}</p>
                        </span>
                    </div>
                    <div className={styles.infoRow}>
                      <Icon name="calendar-days" size={24} className={styles.bookopen} />
                        <span className={styles.infoLabel}>Дата получения: 
                        <span className={styles.infoValue}> {bookingData.dateStart}</span>
                        <span className={styles.infoLabel}> / Дата возврата:
                        <span className={styles.infoValue}> {bookingData.dateEnd}</span></span></span>
                    </div>
                </div>

                <p className={styles.note}>
                    Пожалуйста, заберите книгу в указанный срок. Если вы не успеете, бронь автоматически снимется
                </p>

                {/* Кнопки */}
                <div className={styles.buttonWrapper}>
                     <FindBookButton 
                                onClick={goHome}
                                className={styles.findButton}
                            >
                                Найти другую книгу
                            </FindBookButton>
                            <LoginButton
                                onClick={goToBookings}
                                className={styles.bookingsButton}
                            >
                                Мои бронирования
                            </LoginButton>
                </div>
                </div>
                </div>
      </section>
      <section >
                {/* Карта */}
                <div className={styles.mapContainer}>
                    <h3 className={styles.mapTitle}>Библиотека на карте</h3>
                    <div className={styles.mapPlaceholder}>
                        <iframe
                            src={mapUrl}
                            width="100%"
                            height="300"
                            frameBorder="0"
                            allowFullScreen
                            className={styles.mapIframe}
                            title="Карта библиотеки"
                        />
                    </div>
                </div>
      </section>
            
        </div>
    );
};