// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import { api } from '../api/axios.config';

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  contactPhone?: string;
  role: string;
  avatar?: string | null; // ← добавляем avatar
}

export interface UserBooks {
  id: number;
  title: string;
  author: string;
  library: string;
  dateStart: string;
  dateEnd: string;
  status: 'reserved' | 'active' | 'completed' | 'cancelled';
}

export interface UserStats {
  totalBooks: number;
  activeBookings: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [books, setBooks] = useState<UserBooks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Получаем данные пользователя из localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setProfile({
          id: user.id,
          email: user.email,
          name: user.name,
          contactPhone: user.contactPhone,
          role: user.role,
          avatar: user.avatar || null, // ← добавляем avatar
        });
      }

      // Получаем бронирования пользователя
      const rentalsRes = await api.get('/client/rentals');
      
      const rentals = rentalsRes.data || [];
      const activeBookings = rentals.filter(
        (r: any) => r.status === 'reserved' || r.status === 'active'
      ).length;

      setStats({
        totalBooks: rentals.length,
        activeBookings: activeBookings,
      });

      const formattedBooks = rentals.map((r: any) => ({
        id: r.id,
        title: r.book?.title || 'Название не указано',
        author: r.book?.author || 'Автор не указан',
        library: r.library?.name || 'Библиотека не указана',
        dateStart: r.dateStart,
        dateEnd: r.dateEnd,
        status: r.status,
      }));

      setBooks(formattedBooks);
    } catch (err: any) {
      console.error('Profile loading error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchData();
    } else {
      setLoading(false);
      setError('Не авторизован');
    }
  }, []);

  return {
    profile,
    stats,
    books,
    loading,
    error,
    refetch: fetchData,
  };
};