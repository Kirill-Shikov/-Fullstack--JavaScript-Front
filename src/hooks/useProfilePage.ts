import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from './useProfile';

interface UseProfilePageReturn {
  activeTab: string;
  profile: any;
  stats: any;
  books: any[];
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
}

export const useProfilePage = (): UseProfilePageReturn => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('main');
  const { profile, stats, books, loading, error, fetchProfile } = useProfile();

  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/profile/admin') {
      setActiveTab('admin');
    } else if (path === '/profile') {
      setActiveTab('main');
    } else if (path === '/profile/books') {
      setActiveTab('books');
    } else if (path === '/profile/settings') {
      setActiveTab('settings');
    } else if (path === '/profile/admin/users') {
      setActiveTab('users');
    } else if (path === '/profile/admin/libraries') {
      setActiveTab('libraries');
    } else if (path === '/profile/admin/books') {
      setActiveTab('managerBooks');
    } else if (path.startsWith('/profile/admin/libraries/')) {
      setActiveTab('libraryDetail');
    } else if (path.startsWith('/profile/admin/users/')) {
      setActiveTab('userDetail');
    }
  }, [location.pathname]);

  return {
    activeTab,
    profile,
    stats,
    books,
    loading,
    error,
    fetchProfile,
  };
};