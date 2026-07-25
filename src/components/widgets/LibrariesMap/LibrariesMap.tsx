import React from 'react';
import styles from './LibrariesMap.module.css';

interface LibrariesMapProps {
  className?: string;
}

export const LibrariesMap: React.FC<LibrariesMapProps> = ({ className = '' }) => {
  return (
    <section className={`${styles.librariesSection} ${className}`}>
      <div className={styles.librariesContainer}>
        <h2 className={styles.sectionTitle}>Библиотеки Москвы</h2>

        <div className={styles.mapWrapper}>
          {/* ВСТРОЕННАЯ КАРТА */}
          <div className={styles.mapContainer}>
            <div 
              style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}
            >
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.597700%2C55.721150&mode=search&sll=44.006520%2C56.326799&sspn=0.961304%2C0.301769&text=%D0%B1%D0%B8%D0%B1%D0%BB%D0%B8%D0%BE%D1%82%D0%B5%D0%BA%D0%B8%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D1%8B&z=11.49"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                style={{ position: 'relative' }}
                title="Карта библиотек Москвы"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};