import React from 'react';
import { Icon } from '../Icon';
import styles from './SupportChatButton.module.css';

interface SupportChatButtonProps {
    onClick?: () => void;
    className?: string;
    hasUnread?: boolean;
    isActive?: boolean;  
}

export const SupportChatButton: React.FC<SupportChatButtonProps> = ({ 
    onClick,
    className = '',
    hasUnread = false,
    isActive = false,  // ← ДОБАВИТЬ
}) => {
    return (
        <button 
            className={`${styles.supportWidget} ${isActive ? styles.active : ''} ${className}`} 
            onClick={onClick}
        >
            <Icon name={isActive ? 'x' : 'message-square'} size={28} /> 
            {hasUnread && <span className={styles.unreadBadge} />}
        </button>
    );
};