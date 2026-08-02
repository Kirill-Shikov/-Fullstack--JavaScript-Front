import React from 'react';
import { Icon } from '../../ui/Icon';
import { useSupportChat } from '../../../hooks/useSupportChat';
import styles from './SupportChatWidget.module.css';

interface SupportChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: number | string;
}

export const SupportChatWidget: React.FC<SupportChatWidgetProps> = ({ isOpen, onClose, userId }) => {
    const {
        messages,
        inputValue,
        loading,
        requestId,
        setInputValue,
        handleSendMessage,
        handleKeyDown,
        messagesEndRef,
    } = useSupportChat(isOpen, userId); 

    if (!isOpen) return null;
    return (
        <div className={styles.widgetContainer}>
            <div className={styles.widgetHeader}>
                <div className={styles.headerLeft}>
                    <span className={styles.headerLogo}>LOGO</span>
                </div>
                <span className={styles.headerTitle}>Техподдержка</span>
                <div className={styles.headerRight}>
                    <button className={styles.iconBtn} onClick={onClose}>
                        <Icon name="x" size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.chatBody}>
                {loading ? (
                    <div className={styles.loadingState}>Загрузка чата...</div>
                ) : messages.length === 0 && !requestId ? (
                    <div className={styles.emptyState}>
                        У вас пока нет обращений в техподдержку.<br/>
                        Напишите сообщение, чтобы создать новый запрос.
                    </div>
                ) : messages.length === 0 ? (
                    <div className={styles.emptyState}>Начните диалог с поддержкой...</div>
                ) : (
                    <>
                        <div className={styles.dateDivider}>
                            <span>{new Date().toLocaleDateString('ru-RU')}</span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`${styles.messageRow} ${msg.isMine ? styles.rowRight : styles.rowLeft}`}>
                                {!msg.isMine && (
                                    <div className={styles.messageAvatar}>
                                        <span>{msg.avatar || '👤'}</span>
                                    </div>
                                )}
                                <div className={`${styles.messageBubble} ${msg.isMine ? styles.bubbleYellow : styles.bubbleWhite}`}>
                                    <div className={styles.messageAuthor}>{msg.author}</div>
                                    <div className={styles.messageText}>{msg.text}</div>
                                    <div className={styles.messageFooter}>
                                        <span className={styles.messageTime}>{msg.time}</span>
                                        {msg.isMine && <Icon name="check" size={14} className={styles.statusIcon} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className={styles.chatFooter}>
                <button className={styles.footerBtn}>
                    <Icon name="paperclip" size={20} />
                </button>
                <input
                    type="text"
                    className={styles.chatInput}
                    placeholder="Сообщение..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button className={styles.footerBtn}>
                    <Icon name="smile" size={20} />
                </button>
                <button className={styles.sendBtn} onClick={handleSendMessage} disabled={loading}>
                    <Icon name="send-horizontal" size={20} />
                </button>
            </div>
        </div>
    );
};