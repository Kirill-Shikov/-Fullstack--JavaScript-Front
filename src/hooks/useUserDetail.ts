import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/axios.config';
import { useAuth } from './useAuth';

interface UserDetail {
    id: number;
    name: string;
    email: string;
    contactPhone: string | null;
    role: string;
    createdAt: string;
    hasUnreadMessages?: boolean;
}

interface UserBook {
    id: number;
    title: string;
    author: string;
    library: string;
    issuedAt: string;
    returnedAt: string;
    status: 'active' | 'returned';
}

interface UseUserDetailReturn {
    user: UserDetail | null;
    loading: boolean;
    error: string | null;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isChatOpen: boolean;
    editData: { name: string; email: string; contactPhone: string; role: '' | 'client' | 'admin' | 'manager' };
    books: UserBook[];
    booksLoading: boolean;
    activeFilter: 'all' | 'active' | 'returned';
    filteredBooks: UserBook[];
    isSelectOpen: boolean;
    isAdmin: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    setIsDeleteModalOpen: (open: boolean) => void;
    setIsChatOpen: (open: boolean) => void;
    setEditData: (data: any) => void;
    setActiveFilter: (filter: 'all' | 'active' | 'returned') => void;
    setIsSelectOpen: (open: boolean) => void;
    handleToggleChat: () => void;
    handleEdit: () => Promise<void>;
    handleDelete: () => Promise<void>;
    navigateBack: () => void;
    getRoleLabel: (role: string) => string;
    fetchUser: () => Promise<void>;
}

export const useUserDetail = (): UseUserDetailReturn => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user: authUser } = useAuth();

    const pathParts = location.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        contactPhone: '',
        role: '' as 'client' | 'admin' | 'manager' | '',
    });
    const [books, setBooks] = useState<UserBook[]>([]);
    const [booksLoading, setBooksLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'returned'>('all');

    const isAdmin = authUser?.role === 'admin';

    // ВЫНОСИМ ЗАГРУЗКУ ПОЛЬЗОВАТЕЛЯ В ОТДЕЛЬНУЮ ФУНКЦИЮ
    const fetchUser = async () => {
        if (!userId || userId === 'users') {
            setError('ID пользователя не указан');
            setLoading(false);
            return;
        }

        try {
            const response = await api.get(`/api/admin/users/${userId}`);
            setUser(response.data);
            setEditData({
                name: response.data.name,
                email: response.data.email,
                contactPhone: response.data.contactPhone || '',
                role: response.data.role || '',
            });
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка загрузки пользователя');
        } finally {
            setLoading(false);
        }
    };

    // ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ ПРИ МОНТАЖЕ
    useEffect(() => {
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchUserBooks = async () => {
            if (!userId || userId === 'users') return;
            try {
                setBooksLoading(true);
                const response = await api.get(`/api/admin/rentals/user/${userId}`);
                
                const formattedBooks = response.data.map((rental: any) => ({
                    id: rental.id,
                    title: rental.book?.title || 'Книга',
                    author: rental.book?.author || 'Автор',
                    library: rental.library?.name || 'Библиотека',
                    issuedAt: rental.dateStart ? new Date(rental.dateStart).toLocaleDateString('ru-RU') : '',
                    returnedAt: rental.dateEnd ? new Date(rental.dateEnd).toLocaleDateString('ru-RU') : '',
                    status: rental.status === 'active' || rental.status === 'reserved' ? 'active' : 'returned',
                }));
                
                setBooks(formattedBooks);
            } catch (error) {
                console.error('Ошибка загрузки книг пользователя:', error);
                setBooks([]);
            } finally {
                setBooksLoading(false);
            }
        };
        fetchUserBooks();
    }, [userId]);

    const filteredBooks = useMemo(() => {
        if (activeFilter === 'all') return books;
        return books.filter(book => book.status === activeFilter);
    }, [books, activeFilter]);

    const handleToggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Администратор';
            case 'manager': return 'Библиотекарь';
            case 'client': return 'Клиент';
            default: return role;
        }
    };

    const handleEdit = async () => {
        try {
            await api.patch(`/api/admin/users/${userId}`, editData);
            setUser({ ...user!, ...editData });
            setIsEditModalOpen(false);
        } catch (err: any) {
            // Ошибка обновления
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/api/admin/users/${userId}`);
            setIsDeleteModalOpen(false);
            navigate('/profile/admin/users');
        } catch (err: any) {
            // Ошибка удаления
        }
    };

    const navigateBack = () => {
        navigate('/profile/admin/users');
    };

    return {
        user,
        loading,
        error,
        isEditModalOpen,
        isDeleteModalOpen,
        isChatOpen,
        editData,
        books,
        booksLoading,
        activeFilter,
        filteredBooks,
        isSelectOpen,
        isAdmin,
        setIsEditModalOpen,
        setIsDeleteModalOpen,
        setIsChatOpen,
        setEditData,
        setActiveFilter,
        setIsSelectOpen,
        handleToggleChat,
        handleEdit,
        handleDelete,
        navigateBack,
        getRoleLabel,
        fetchUser,  
    };
};