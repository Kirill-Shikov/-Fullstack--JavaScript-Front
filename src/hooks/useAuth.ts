import { useState, useEffect } from 'react';
import { authAPI } from '../api/api';

interface User {
    id: number;
    email: string;
    name: string;
    role: 'client' | 'admin' | 'manager';
    contactPhone?: string;
    avatar?: string | null;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser({
                    ...parsedUser,
                    avatar: parsedUser.avatar || null,
                });
            } catch (e) {
                // Ошибка парсинга - просто игнорируем
            }
        }
    }, []);

    const login = async (login: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authAPI.login({ login, password });
            const { access_token, user } = response.data;
            
            const userWithAvatar = {
                ...user,
                avatar: user.avatar || null,
            };
            
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userWithAvatar));
            setUser(userWithAvatar);
            
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.message || 'Ошибка входа' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: { email: string; password: string; name: string; contactPhone?: string }) => {
        setIsLoading(true);
        try {
            const response = await authAPI.register(data);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.response?.data?.message || 'Ошибка регистрации' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, login, register, logout, isLoading };
};