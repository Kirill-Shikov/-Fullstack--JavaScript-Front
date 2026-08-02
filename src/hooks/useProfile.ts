import { useState, useEffect } from 'react';
import { getProfile, getUserStats, getUserBooks, updateProfile, uploadAvatar, deleteAvatar } from '../api/profile.api';

export interface UserStats {
  totalBooks: number;
  activeBookings: number;
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

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string;
  registeredAt?: string;
}

interface UseProfileReturn {
  profile: UserProfile | null;
  stats: UserStats | null;
  books: UserBooks[];
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchBooks: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [books, setBooks] = useState<UserBooks[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setProfile(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch {
      // Ошибка загрузки статистики
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await getUserBooks();
      setBooks(data);
    } catch {
      // Ошибка загрузки книг
    }
  };

  const updateProfileHandler = async (data: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(data);
      setProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (err: any) {
      setError(err.message || 'Ошибка обновления профиля');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatarHandler = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      await uploadAvatar(file);
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки аватара');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAvatarHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteAvatar();
      await fetchProfile();
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления аватара');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchBooks();
  }, []);

  return {
    profile,
    stats,
    books,
    loading,
    error,
    fetchProfile,
    fetchStats,
    fetchBooks,
    updateProfile: updateProfileHandler,
    uploadAvatar: uploadAvatarHandler,
    deleteAvatar: deleteAvatarHandler,
  };
};