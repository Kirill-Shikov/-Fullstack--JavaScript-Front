import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios.config';

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    description: string;
    library: string;
    coverImage?: string;
}

interface UseHomePageReturn {
    searchQuery: string;
    authorQuery: string;
    dateStart: string;
    dateEnd: string;
    editorBooks: Book[];
    newBooks: Book[];
    loading: boolean;
    setSearchQuery: (value: string) => void;
    setAuthorQuery: (value: string) => void;
    setDateStart: (value: string) => void;
    setDateEnd: (value: string) => void;
    handleSearch: () => void;
    handleBook: (bookId: number) => void;
}

export const useHomePage = (): UseHomePageReturn => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [authorQuery, setAuthorQuery] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [editorBooks, setEditorBooks] = useState<Book[]>([]);
    const [newBooks, setNewBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    // Форматирование книг из API
    const formatBooks = (data: any[]): Book[] => {
    return data.map((item: any) => {
        console.log('📸 Форматирование:', item.id, item.title, 'coverImage:', item.coverImage);
        return {
            id: item.id,
            title: item.title,
            author: item.author,
            year: item.year,
            description: item.description,
            library: item.library?.name || 'Библиотека',
            coverImage: item.coverImage || '',
        };
    });
    };

    // Загрузка книг
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                
            
                const editorRes = await api.get('/api/common/books', {
                    params: { limit: 6, sort: 'popular' }
                });
                
            
                const newRes = await api.get('/api/common/books', {
                    params: { limit: 6, sort: 'new' }
                });

                setEditorBooks(formatBooks(editorRes.data));
                setNewBooks(formatBooks(newRes.data));
            } catch {
                // Ошибка загрузки
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleSearch = () => {
        const title = searchQuery.trim();
        const author = authorQuery.trim();
        
        if (title || author) {
            const params = new URLSearchParams();
            if (title) params.set('title', title);
            if (author) params.set('author', author);
            navigate(`/search?${params.toString()}`);
        } else {
            navigate('/search');
        }
    };

    const handleBook = (bookId: number) => {
        navigate(`/booking/${bookId}`);
    };

    return {
        searchQuery,
        authorQuery,
        dateStart,
        dateEnd,
        editorBooks,
        newBooks,
        loading,
        setSearchQuery,
        setAuthorQuery,
        setDateStart,
        setDateEnd,
        handleSearch,
        handleBook,
    };
};