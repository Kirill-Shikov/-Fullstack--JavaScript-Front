import { useState, useEffect, useRef } from 'react';
import { supportAPI } from '../api/api';
import { api } from '../api/axios.config';
import { useAuth } from './useAuth';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
    id: number;
    author: string;
    text: string;
    time: string;
    isMine: boolean;
    avatar?: string;
}

interface UseSupportChatReturn {
    messages: ChatMessage[];
    inputValue: string;
    loading: boolean;
    requestId: number | null;
    setInputValue: (value: string) => void;
    handleSendMessage: () => Promise<void>;
    handleKeyDown: (e: any) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const useSupportChat = (
    isOpen: boolean, 
    userId?: number | string,
    onRead?: () => void  
): UseSupportChatReturn => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState<number | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setMessages([]);
            setRequestId(null);
        }
    }, [isOpen]);

    // WebSocket
    useEffect(() => {
        if (!isOpen || !requestId) return;
        const token = localStorage.getItem('token');
        const socket = io('http://localhost:3000/support', {
            transports: ['websocket'],
            withCredentials: true,
             auth: {
    token: token,
  },
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('🟢 WebSocket connected');
            socket.emit('subscribeToChat', String(requestId));
        });

        socket.on('newMessage', (data) => {
            if (data.supportRequestId !== requestId) return;
            
            setMessages((prev) => {
                if (prev.some(m => m.id === data.id)) return prev;
                
                const authorId = Number(data.author?.id || data.authorId);
                const currentUserId = Number(user?.id);
                const isMine = authorId === currentUserId;
                
                let author = data.author?.name || 'Оператор';
                if (isMine) author = 'Вы';
                
                const newMsg: ChatMessage = {
                    id: data.id,
                    author: author,
                    text: data.text,
                    time: new Date(data.sentAt || data.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                    isMine: isMine,
                    avatar: data.author?.avatar || '👤',
                };
                return [...prev, newMsg];
            });
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [isOpen, requestId, user]);

    // Загрузка чата
    useEffect(() => {
        if (!isOpen) return;

        const loadChat = async () => {
            setLoading(true);
            try {
                let requestsRes;
                const userRole = user?.role;

                if (userId) {
                    requestsRes = await api.get(`/api/manager/support-requests`, {
                        params: { user: userId }
                    });
                } else {
                    if (userRole === 'manager' || userRole === 'admin') {
                        requestsRes = await api.get(`/api/manager/support-requests`);
                    } else {
                        requestsRes = await supportAPI.getRequests();
                    }
                }
                
                if (requestsRes.data && requestsRes.data.length > 0) {
                    const activeRequest = requestsRes.data.find((r: any) => r.isActive === true) || requestsRes.data[0];
                    setRequestId(activeRequest.id);

                    const messagesRes = await supportAPI.getMessages(activeRequest.id);
                    
                    const formattedMessages = messagesRes.data.map((msg: any) => {
                        const authorId = Number(msg.author?.id);
                        const currentUserId = Number(user?.id);
                        const isMine = authorId === currentUserId;
                        
                        let author = msg.author?.name || 'Оператор';
                        if (isMine) author = 'Вы';
                        
                        return {
                            id: msg.id,
                            author: author,
                            text: msg.text,
                            time: new Date(msg.sentAt || msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                            isMine: isMine,
                            avatar: msg.author?.avatar || '👤',
                        };
                    });
                    
                    setMessages(formattedMessages);

                    // ОТМЕТКА ПРОЧТЕНИЯ И ВЫЗОВ КОЛБЭКА
                    const hasUnread = messagesRes.data.some(
                        (msg: any) => !msg.readAt && msg.authorId !== user?.id
                    );
                    
                    if (hasUnread) {
                        try {
                            await api.post(`/api/common/support-requests/${activeRequest.id}/messages/read`, {
                                createdBefore: new Date().toISOString()
                            });
                            console.log('✅ Сообщения отмечены как прочитанные');
                            
                            // ВЫЗЫВАЕМ КОЛБЭК ДЛЯ ОБНОВЛЕНИЯ СТАТИСТИКИ
                            if (onRead) {
                                onRead();
                            }
                        } catch (error) {
                            console.error('❌ Ошибка отметки прочитанных:', error);
                        }
                    }
                } else {
                    setRequestId(null);
                    setMessages([]);
                }
            } catch (error) {
                console.error('Ошибка загрузки чата:', error);
            } finally {
                setLoading(false);
            }
        };

        loadChat();
    }, [isOpen, userId, user, onRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        let currentRequestId = requestId;

        if (!currentRequestId) {
            try {
                setLoading(true);
                const createRes = await supportAPI.createRequest({ text: inputValue.trim() });
                const newRequest = createRes.data;
                currentRequestId = newRequest.id;
                setRequestId(currentRequestId);
                setLoading(false);
            } catch {
                return;
            }
        }

        if (!currentRequestId) return;

        try {
            await supportAPI.sendMessage(currentRequestId, { text: inputValue.trim() });
            setInputValue('');
        } catch (error) {
            console.error('Ошибка отправки:', error);
        }
    };

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return {
        messages,
        inputValue,
        loading,
        requestId,
        setInputValue,
        handleSendMessage,
        handleKeyDown,
        messagesEndRef,
    };
};