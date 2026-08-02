import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

interface User {
    id: number;
    email: string;
    name: string;
    role: 'client' | 'admin' | 'manager';
    contactPhone?: string;
    avatar?: string | null;
}

interface UseHeaderReturn {
  isLoginModalOpen: boolean;
  user: User | null;
  setIsLoginModalOpen: (value: boolean) => void;
  handleAboutClick: (e: React.MouseEvent) => void;
  handleLogout: () => void;
  handleProfileClick: () => void;
  handleLoginSuccess: () => void;
}

export const useHeader = (): UseHeaderReturn => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    const userRole = user?.role;
    
    if (userRole === 'admin' || userRole === 'manager') {
      navigate('/profile/admin');
    } else {
      navigate('/profile');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  return {
    isLoginModalOpen,
    user,
    setIsLoginModalOpen,
    handleAboutClick,
    handleLogout,
    handleProfileClick,
    handleLoginSuccess,
  };
};