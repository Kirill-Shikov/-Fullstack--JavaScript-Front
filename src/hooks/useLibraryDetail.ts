import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/axios.config';
import { useAuth } from './useAuth';

interface Library {
    id: number;
    name: string;
    address: string;
    description: string | null;
    totalCopies: number;
    availableCopies: number;
    createdAt: string;
    updatedAt: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    description: string;
    totalCopies: number;
    availableCopies: number;
    coverImage?: string | null;
}

type BookFilter = 'all' | 'author' | 'copies';

interface UseLibraryDetailReturn {
    library: Library | null;
    books: Book[];
    filteredBooks: Book[];
    currentBooks: Book[];
    loading: boolean;
    error: string | null;
    bookFilter: BookFilter;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isAddBookModalOpen: boolean;
    isEditBookModalOpen: boolean;
    isDeleteBookModalOpen: boolean;
    selectedBook: Book | null;
    editData: { name: string; address: string; description: string };
    newBook: { title: string; author: string; year: string; description: string; totalCopies: string };
    editBookData: { title: string; author: string; year: string; description: string; totalCopies: string };
    coverFile: File | null;
    coverPreview: string | null;
    bookCopies: number;
    currentPage: number;
    totalBookPages: number;
    isAdmin: boolean;
    setBookFilter: (filter: BookFilter) => void;
    setIsEditModalOpen: (open: boolean) => void;
    setIsDeleteModalOpen: (open: boolean) => void;
    setIsAddBookModalOpen: (open: boolean) => void;
    setIsEditBookModalOpen: (open: boolean) => void;
    setIsDeleteBookModalOpen: (open: boolean) => void;
    setSelectedBook: (book: Book | null) => void;
    setEditData: (data: any) => void;
    setNewBook: (data: any) => void;
    setEditBookData: (data: any) => void;
    setCoverFile: (file: File | null) => void;
    setCoverPreview: (preview: string | null) => void;
    setBookCopies: (copies: number) => void;
    setCurrentPage: (page: number) => void;
    handleEdit: () => Promise<void>;
    handleDelete: () => Promise<void>;
    handleAddBook: () => Promise<void>;
    handleEditBook: (book: Book) => void;
    handleSaveBookEdit: () => Promise<void>;
    handleDeleteBook: () => Promise<void>;
    handleCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCoverRemove: () => void;
    handleUploadClick: () => void;
    handleCloseEditBookModal: () => void;
    navigateBack: () => void;
}

export const useLibraryDetail = (): UseLibraryDetailReturn => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const pathParts = location.pathname.split('/');
    const libraryId = pathParts[pathParts.length - 1];

    const [library, setLibrary] = useState<Library | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookFilter, setBookFilter] = useState<BookFilter>('all');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
    const [isDeleteBookModalOpen, setIsDeleteBookModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [editData, setEditData] = useState({ name: '', address: '', description: '' });
    const [newBook, setNewBook] = useState({ title: '', author: '', year: '', description: '', totalCopies: '' });
    const [editBookData, setEditBookData] = useState({ title: '', author: '', year: '', description: '', totalCopies: '' });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [bookCopies, setBookCopies] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (!libraryId || libraryId === 'libraries') {
            setError('ID библиотеки не указан');
            setLoading(false);
            return;
        }

        const fetchLibrary = async () => {
            try {
                // ✅ ИСПРАВЛЕНО: добавил /api/
                const response = await api.get(`/api/admin/libraries/${libraryId}`);
                console.log('📚 Данные библиотеки с бэкенда:', response.data);
                setLibrary(response.data);
                setEditData({
                    name: response.data.name,
                    address: response.data.address,
                    description: response.data.description || '',
                });
                
                // ✅ ИСПРАВЛЕНО: добавил /api/
                const booksResponse = await api.get(`/api/admin/libraries/${libraryId}/books`);
                setBooks(booksResponse.data);
                setFilteredBooks(booksResponse.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка загрузки библиотеки');
            } finally {
                setLoading(false);
            }
        };
        fetchLibrary();
    }, [libraryId]);

    useEffect(() => {
        let filtered = [...books];
        switch (bookFilter) {
            case 'author':
                filtered = filtered.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case 'copies':
                filtered = filtered.sort((a, b) => b.totalCopies - a.totalCopies);
                break;
            default:
                filtered = filtered.sort((a, b) => a.id - b.id);
                break;
        }
        setFilteredBooks(filtered);
        setCurrentPage(1);
    }, [bookFilter, books]);

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalBookPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handleEdit = async () => {
        try {
            // ✅ ИСПРАВЛЕНО: добавил /api/
            await api.patch(`/api/admin/libraries/${libraryId}`, editData);
            setLibrary({ ...library!, ...editData });
            setIsEditModalOpen(false);
        } catch (err: any) {
            // Ошибка обновления
        }
    };

    const handleDelete = async () => {
        try {
            // ✅ ИСПРАВЛЕНО: добавил /api/
            await api.delete(`/api/admin/libraries/${libraryId}`);
            setIsDeleteModalOpen(false);
            navigate('/profile/admin/libraries');
        } catch (err: any) {
            // Ошибка удаления
        }
    };

    const handleAddBook = async () => {
        if (!newBook.title.trim() || !newBook.author.trim()) {
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', newBook.title);
            formData.append('author', newBook.author);
            formData.append('year', String(parseInt(newBook.year) || 0));
            formData.append('description', newBook.description || '');
            formData.append('totalCopies', String(bookCopies));
            if (coverFile) {
                formData.append('coverImage', coverFile);
            }

            // ✅ ИСПРАВЛЕНО: добавил /api/
            await api.post(`/api/admin/libraries/${libraryId}/books`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setIsAddBookModalOpen(false);
            setNewBook({ title: '', author: '', year: '', description: '', totalCopies: '' });
            setCoverFile(null);
            setCoverPreview(null);
            setBookCopies(1);
            // ✅ ИСПРАВЛЕНО: добавил /api/
            const booksResponse = await api.get(`/api/admin/libraries/${libraryId}/books`);
            setBooks(booksResponse.data);
            setFilteredBooks(booksResponse.data);
        } catch (err: any) {
            // Ошибка добавления
        }
    };

    const handleEditBook = (book: Book) => {
        setSelectedBook(book);
        setEditBookData({
            title: book.title,
            author: book.author,
            year: String(book.year),
            description: book.description,
            totalCopies: String(book.totalCopies),
        });
        if (book.coverImage) {
            setCoverFile(new File([], book.coverImage.split('/').pop() || 'Обложка'));
            setCoverPreview('exists');
        } else {
            setCoverFile(null);
            setCoverPreview(null);
        }
        setIsEditBookModalOpen(true);
    };

    const handleSaveBookEdit = async () => {
        if (!selectedBook) return;
        try {
            const formData = new FormData();
            formData.append('title', editBookData.title);
            formData.append('author', editBookData.author);
            formData.append('year', String(parseInt(editBookData.year) || 0));
            formData.append('description', editBookData.description || '');
            formData.append('totalCopies', String(parseInt(editBookData.totalCopies) || 1));
            if (coverFile && coverFile instanceof File && coverFile.size > 0) {
                formData.append('coverImage', coverFile);
            }

            // ✅ ИСПРАВЛЕНО: добавил /api/
            await api.patch(`/api/admin/libraries/${libraryId}/books/${selectedBook.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setIsEditBookModalOpen(false);
            setSelectedBook(null);
            setCoverFile(null);
            setCoverPreview(null);
            // ✅ ИСПРАВЛЕНО: добавил /api/
            const booksResponse = await api.get(`/api/admin/libraries/${libraryId}/books`);
            setBooks(booksResponse.data);
            setFilteredBooks(booksResponse.data);
        } catch (err: any) {
            // Ошибка обновления
        }
    };

    const handleDeleteBook = async () => {
        if (!selectedBook) return;
        try {
            // ✅ ИСПРАВЛЕНО: добавил /api/
            await api.delete(`/api/admin/libraries/${libraryId}/books/${selectedBook.id}`);
            setIsDeleteBookModalOpen(false);
            setSelectedBook(null);
            // ✅ ИСПРАВЛЕНО: добавил /api/
            const booksResponse = await api.get(`/api/admin/libraries/${libraryId}/books`);
            setBooks(booksResponse.data);
            setFilteredBooks(booksResponse.data);
        } catch (err: any) {
            // Ошибка удаления
        }
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) return;

        setCoverFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setCoverPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleCoverRemove = () => {
        setCoverFile(null);
        setCoverPreview(null);
    };

    const handleUploadClick = () => {
        document.getElementById('cover-upload')?.click();
    };

    const handleCloseEditBookModal = () => {
        setIsEditBookModalOpen(false);
        setSelectedBook(null);
        setCoverFile(null);
        setCoverPreview(null);
    };

    const navigateBack = () => {
        navigate('/profile/admin/libraries');
    };

    return {
        library,
        books,
        filteredBooks,
        currentBooks,
        loading,
        error,
        bookFilter,
        isEditModalOpen,
        isDeleteModalOpen,
        isAddBookModalOpen,
        isEditBookModalOpen,
        isDeleteBookModalOpen,
        selectedBook,
        editData,
        newBook,
        editBookData,
        coverFile,
        coverPreview,
        bookCopies,
        currentPage,
        totalBookPages,
        isAdmin,
        setBookFilter,
        setIsEditModalOpen,
        setIsDeleteModalOpen,
        setIsAddBookModalOpen,
        setIsEditBookModalOpen,
        setIsDeleteBookModalOpen,
        setSelectedBook,
        setEditData,
        setNewBook,
        setEditBookData,
        setCoverFile,
        setCoverPreview,
        setBookCopies,
        setCurrentPage,
        handleEdit,
        handleDelete,
        handleAddBook,
        handleEditBook,
        handleSaveBookEdit,
        handleDeleteBook,
        handleCoverUpload,
        handleCoverRemove,
        handleUploadClick,
        handleCloseEditBookModal,
        navigateBack,
    };
};