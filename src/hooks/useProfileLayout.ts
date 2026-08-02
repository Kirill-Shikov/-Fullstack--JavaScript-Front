import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface UseProfileLayoutReturn {
  userRole: string | null;
  userName: string;
  avatarUrl: string | null;
  navItems: Array<{
    id: string;
    path: string;
    label: string;
    icon: string;
  }>;
  currentActiveTab: string;
  handleNavClick: (path: string) => void;
  handleLogout: () => void;
}

export const useProfileLayout = (
  userAvatar?: string | null,
  userName?: string
): UseProfileLayoutReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const userRole = user?.role || null;
  const displayName = userName || user?.name || 'Капитолина';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Навигация в зависимости от роли
  const navItems = userRole === 'admin' ? [
    { id: 'main', path: '/profile/admin', label: 'Главная', icon: 'house' },
    { id: 'users', path: '/profile/admin/users', label: 'Пользователи', icon: 'userround' },
    { id: 'libraries', path: '/profile/admin/libraries', label: 'Библиотеки', icon: 'librarybig' },
    { id: 'settings', path: '/profile/settings', label: 'Настройки', icon: 'settings' },
  ] : userRole === 'manager' ? [
    { id: 'main', path: '/profile/admin', label: 'Главная', icon: 'house' },
    { id: 'users', path: '/profile/admin/users', label: 'Пользователи', icon: 'userround' },
    { id: 'books', path: '/profile/admin/books', label: 'Книги', icon: 'bookopen' },
    { id: 'settings', path: '/profile/settings', label: 'Настройки', icon: 'settings' },
  ] : [
    { id: 'main', path: '/profile', label: 'Главная', icon: 'house' },
    { id: 'books', path: '/profile/books', label: 'Мои книги', icon: 'librarybig' },
    { id: 'settings', path: '/profile/settings', label: 'Профиль', icon: 'userround' },
  ];

  // Определяем активный таб по текущему URL
  const currentActiveTab = (() => {
    const matchedItem = navItems.find(item => location.pathname === item.path);
    return matchedItem ? matchedItem.id : (navItems.length > 0 ? navItems[0].id : 'main');
  })();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  // Формируем URL аватара
  const avatarUrl = userAvatar 
    ? `${API_URL}${userAvatar}` 
    : null;

  return {
    userRole,
    userName: displayName,
    avatarUrl,
    navItems,
    currentActiveTab,
    handleNavClick,
    handleLogout,
  };
};