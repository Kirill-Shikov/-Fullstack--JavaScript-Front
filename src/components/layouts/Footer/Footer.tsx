import React from 'react';
import { SocialIcon } from '../../ui/SocialIcon/SocialIcon';
import styles from './Footer.module.css';

import AmorphousLeft from '../../../assets/icons/backgrounds/amorphous shape 2.svg';
import AmorphousRight from '../../../assets/icons/backgrounds/amorphous shape 1.svg';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <img 
        src={AmorphousLeft} 
        alt="" 
        className={styles.decorLeft}
        aria-hidden="true"
      />
      <img 
        src={AmorphousRight} 
        alt="" 
        className={styles.decorRight}
        aria-hidden="true"
      />
      <span className={styles.footerLogo}>ЛОГО</span>
      <div className={styles.footerSocials}>
          {/* С кастомными цветами */}
          <SocialIcon 
            type="vk" 
            url="https://vk.com" 
          />
          <SocialIcon 
            type="telegram" 
            url="https://telegram.org" 
          />
          <SocialIcon 
            type="youtube" 
            url="https://youtube.com" 
          />
          <SocialIcon 
            type="odnoklassniki" 
            url="https://ok.ru" 
          />
        </div>
      <p className={styles.footerText}>Политика обработки персональных данных</p>
    </footer>
  );
};