import { useState, useEffect } from 'react';
import { authAPI } from '../api/api';

interface User {
    id: number;
    email: string;
    name: string;
    role: 'client' | 'admin' | 'manager';
    contactPhone?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const login = async (name: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await authAPI.login({ name, password });
            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
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