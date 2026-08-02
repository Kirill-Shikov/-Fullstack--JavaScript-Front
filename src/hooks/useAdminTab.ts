import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { api } from '../api/axios.config';

interface AdminStats {
  totalLibraries: number;
  totalUsers: number;
  activeBookings: number;
  newMessages: number;
  totalBooks: number;
  activeRentals: number;
}

interface UseAdminTabReturn {
  stats: AdminStats | null;
  loading: boolean;
  userName: string;
  isAdmin: boolean;
  navigateToUsers: () => void;
  navigateToAddBook: () => void;
  navigateToBooks: () => void;
  navigateToLibraries: () => void;
}

export const useAdminTab = (): UseAdminTabReturn => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Константин');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ ИСПРАВЛЕНО: добавил /api/
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
        console.log('📊 Статистика с бэкенда:', response.data);
        
        if (user?.name) {
          setUserName(user.name);
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        setStats({
          totalLibraries: 0,
          totalUsers: 0,
          activeBookings: 0,
          newMessages: 0,
          totalBooks: 0,
          activeRentals: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const navigateToUsers = () => {
    navigate('/profile/admin/users');
  };

  const navigateToAddBook = () => {
    navigate('/profile/admin/books');
  };

  const navigateToBooks = () => {
    navigate('/profile/admin/books');
  };

  const navigateToLibraries = () => {
    navigate('/profile/admin/libraries');
  };

  return {
    stats,
    loading,
    userName,
    isAdmin,
    navigateToUsers,
    navigateToAddBook,
    navigateToBooks,
    navigateToLibraries,
  };
};