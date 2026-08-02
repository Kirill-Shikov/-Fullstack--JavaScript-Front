import { api } from './axios.config';

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

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/api/users/profile');
  return response.data as UserProfile;
};

export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/api/users/stats');
  return response.data as UserStats;
};

export const getUserBooks = async (): Promise<UserBooks[]> => {
  const response = await api.get('/api/users/books');
  return response.data as UserBooks[];
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.patch('/api/users/profile', data);
  return response.data as UserProfile;
};

export const uploadAvatar = async (file: File): Promise<{ avatar: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/api/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data as { avatar: string };
};

export const deleteAvatar = async (): Promise<{ success: boolean }> => {
  const response = await api.delete('/api/users/avatar');
  return response.data as { success: boolean };
};