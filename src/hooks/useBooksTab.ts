import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/axios.config';
import bookmarked from '../assets/icons/navigation/bookmarked.svg';
import squarecheck from '../assets/icons/navigation/squarecheck.svg';

type FilterType = 'all' | 'booked' | 'returned';

interface Book {
  id: number;
  title: string;
  author: string;
  library: string;
  issueDate: string;
  returnDate: string;
  status: 'Забронирована' | 'Возвращена';
  coverImage?: string;
}

interface UseBooksTabReturn {
  filter: FilterType;
  userBooks: Book[];
  filteredBooks: Book[];
  loading: boolean;
  error: string | null;
  isChatOpen: boolean;
  setFilter: (filter: FilterType) => void;
  setIsChatOpen: (isOpen: boolean) => void;
  handleToggleChat: () => void;
  getStatusIcon: (status: string) => string;
  getRowStatusClass: (status: string) => string;
  navigateToSearch: () => void;
  reloadPage: () => void;
}

export const useBooksTab = (): UseBooksTabReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState<FilterType>('all');
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'booked') {
      setFilter('booked');
    } else if (filterParam === 'returned') {
      setFilter('returned');
    }
  }, [location.search]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/api/client/rentals');
        
        const formattedBooks = response.data.map((rental: any) => ({
          id: rental.id,
          title: rental.book?.title || 'Название не указано',
          author: rental.book?.author || 'Автор не указан',
          library: rental.library?.name || 'Библиотека не указана',
          issueDate: rental.dateStart ? new Date(rental.dateStart).toLocaleDateString('ru-RU') : '',
          returnDate: rental.dateEnd ? new Date(rental.dateEnd).toLocaleDateString('ru-RU') : '',
          status: rental.status === 'reserved' || rental.status === 'active' 
            ? 'Забронирована' 
            : 'Возвращена',
          coverImage: rental.book?.coverImage || '',
        }));
        
        setUserBooks(formattedBooks);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки книг');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getFilteredBooks = () => {
    switch (filter) {
      case 'booked':
        return userBooks.filter(book => book.status === 'Забронирована');
      case 'returned':
        return userBooks.filter(book => book.status === 'Возвращена');
      default:
        return userBooks;
    }
  };

  const filteredBooks = getFilteredBooks();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Забронирована':
        return bookmarked;
      case 'Возвращена':
        return squarecheck;
      default:
        return '';
    }
  };

  const getRowStatusClass = (status: string) => {
    switch (status) {
      case 'Забронирована':
        return 'rowBooked';
      case 'Возвращена':
        return 'rowReturned';
      default:
        return '';
    }
  };

  const navigateToSearch = () => {
    navigate('/search');
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return {
    filter,
    userBooks,
    filteredBooks,
    loading,
    error,
    isChatOpen,
    setFilter,
    setIsChatOpen,
    handleToggleChat,
    getStatusIcon,
    getRowStatusClass,
    navigateToSearch,
    reloadPage,
  };
};