// src/api/profile.api.ts
import { api } from './axios.config';

// Типы данных
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string;
  registeredAt?: string;
}

export interface UserBooks {
  id: number;
  title: string;
  author: string;
  library: string;
  issueDate: string;
  returnDate: string;
  status: 'Забронирована' | 'Возвращена';
  coverImage?: string;
}

export interface UserStats {
  totalBooks: number;
  activeBookings: number;
}

// 1. Получить профиль пользователя
export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/users/profile');
  return response.data;
};

// 2. Получить статистику пользователя
export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/users/stats');
  return response.data;
};

// 3. Получить книги пользователя
export const getUserBooks = async (): Promise<UserBooks[]> => {
  const response = await api.get('/users/books');
  return response.data;
};

// 4. Обновить профиль
export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.patch('/users/profile', data);
  return response.data;
};

// 5. Загрузить аватар
export const uploadAvatar = async (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};