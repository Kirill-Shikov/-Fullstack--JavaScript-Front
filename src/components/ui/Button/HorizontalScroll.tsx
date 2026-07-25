import React, { useRef, useState, useEffect } from 'react';
import { Icon } from '../Icon';
import styles from './HorizontalScroll.module.css';

interface HorizontalScrollProps {
  children: React.ReactNode;
  title?: string;
  scrollAmount?: number;
}

export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  title,
  scrollAmount = 300,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDots, setTotalDots] = useState(0);

  const checkScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 1);

    const index = Math.round(scrollLeft / (clientWidth || 1));
    setCurrentIndex(index);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollWidth, clientWidth } = container;
    setTotalDots(Math.ceil(scrollWidth / clientWidth));
  }, [children]);

  const scrollLeft = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  const scrollRight = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  const scrollTo = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ left: index * container.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={styles.scrollWrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}
      
      <div className={styles.scrollContainer}>
        <div 
          ref={containerRef} 
          className={styles.scrollContent}
          onScroll={checkScroll}
        >
          {children}
        </div>

        {/* Кнопки справа внизу */}
        <div className={styles.controls}>
          <div className={styles.dots}>
            {Array.from({ length: Math.min(totalDots, 10) }).map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                onClick={() => scrollTo(index)}
              />
            ))}
          </div>

          <button
            className={styles.arrowButton}
            onClick={scrollLeft}
            disabled={!showLeft}
            aria-label="Прокрутить влево"
          >
            <Icon name="arrow-big-left" size={24} />
          </button>

          <button
            className={styles.arrowButton}
            onClick={scrollRight}
            disabled={!showRight}
            aria-label="Прокрутить вправо"
          >
            <Icon name="arrow-big-right" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};