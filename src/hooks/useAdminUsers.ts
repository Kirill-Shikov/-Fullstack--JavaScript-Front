import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios.config';
import { useAuth } from './useAuth';

interface User {
  id: number;
  name: string;
  email: string;
  contactPhone?: string;
  role: string;
  avatar?: string | null;
  lastActivity?: string;
  activeBookings?: number;
  hasUnreadMessages?: boolean;
}

export const useAdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    contactPhone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 10;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        const role = user?.role;
        
        if (role === 'admin') {
          response = await api.get('/api/admin/users');
        } else if (role === 'manager') {
          response = await api.get('/api/manager/users');
        } else {
          throw new Error('Нет прав для просмотра пользователей');
        }
        
        // ✅ ДОБАВЛЯЕМ hasUnreadMessages ДЛЯ НУЖНЫХ ПОЛЬЗОВАТЕЛЕЙ
        setUsers(response.data.map((user: any) => ({
          ...user,
          // ВКЛЮЧАЕМ КРУЖКИ ДЛЯ КОНКРЕТНЫХ ID (31, 30, 29)
          hasUnreadMessages: [31, 30, 29].includes(user.id), // ← МЕНЯЙ ID НУЖНЫХ ЛЮДЕЙ!
          lastActivity: user.updatedAt || user.createdAt || new Date().toISOString(),
          activeBookings: 0,
        })));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки пользователей');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Фильтрация
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(u.id).includes(searchQuery);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Пагинация
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Добавление пользователя
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/admin/users', newUser);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'client', contactPhone: '' });
      
      // Обновляем список
      const response = await api.get('/api/admin/users');
      setUsers(response.data.map((user: any) => ({
        ...user,
        hasUnreadMessages: [31, 30, 29].includes(user.id),
        lastActivity: user.updatedAt || user.createdAt || new Date().toISOString(),
        activeBookings: 0,
      })));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка создания пользователя');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/profile/admin/users/${id}`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'manager': return '📚';
      default: return '👤';
    }
  };

  const getRoleClass = (role: string) => {
    switch (role) {
      case 'admin': return 'roleAdmin';
      case 'manager': return 'roleManager';
      default: return 'roleClient';
    }
  };

  return {
    loading,
    error,
    searchQuery,
    roleFilter,
    currentPage,
    isModalOpen,
    newUser,
    isSubmitting,
    isAdmin,
    currentUsers,
    totalPages,
    setSearchQuery,
    setRoleFilter,
    setCurrentPage,
    setIsModalOpen,
    setNewUser,
    handleAddUser,
    handleRowClick,
    getRoleIcon,
    getRoleClass,
  };
};