import React from 'react';
import { Icon } from '../Icon';
import styles from './SocialIcon.module.css';

type SocialType = 'vk' | 'telegram' | 'youtube' | 'odnoklassniki';

interface SocialIconProps {
  type: SocialType;
  url: string;
  size?: number;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  type, 
  url, 
  
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.socialLink}
      aria-label={type}
    >
      <Icon name={type} size={45} />
    </a>
  );
};