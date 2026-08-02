import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios.config';

interface Library {
    id: number;
    name: string;
    address: string;
    description: string | null;
    totalCopies: number;
    availableCopies: number;
}

interface UseAdminLibrariesReturn {
    libraries: Library[];
    filteredLibraries: Library[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    currentPage: number;
    isModalOpen: boolean;
    newLibrary: {
        name: string;
        address: string;
        description: string;
    };
    isSubmitting: boolean;
    currentLibraries: Library[];
    totalPages: number;
    setSearchQuery: (value: string) => void;
    setCurrentPage: (value: number) => void;
    setIsModalOpen: (value: boolean) => void;
    setNewLibrary: (value: any) => void;
    handleAddLibrary: () => Promise<void>;
    handleRowClick: (libraryId: number) => void;
}

export const useAdminLibraries = (): UseAdminLibrariesReturn => {
    const navigate = useNavigate();
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [filteredLibraries, setFilteredLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLibrary, setNewLibrary] = useState({
        name: '',
        address: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const librariesPerPage = 10;

    useEffect(() => {
        const fetchLibraries = async () => {
            try {
                // ✅ ИСПРАВЛЕНО: добавил /api/
                const response = await api.get('/api/admin/libraries');
                setLibraries(response.data);
                setFilteredLibraries(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Ошибка загрузки библиотек');
            } finally {
                setLoading(false);
            }
        };
        fetchLibraries();
    }, []);

    useEffect(() => {
        let filtered = libraries;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(
                (lib) =>
                    lib.name.toLowerCase().includes(query) ||
                    lib.address.toLowerCase().includes(query)
            );
        }

        setFilteredLibraries(filtered);
        setCurrentPage(1);
    }, [searchQuery, libraries]);

    const handleAddLibrary = async () => {
        if (!newLibrary.name.trim()) {
            return;
        }
        if (!newLibrary.address.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            // ✅ ИСПРАВЛЕНО: добавил /api/
            await api.post('/api/admin/libraries', newLibrary);

            // ✅ ИСПРАВЛЕНО: добавил /api/
            const response = await api.get('/api/admin/libraries');
            setLibraries(response.data);
            setFilteredLibraries(response.data);

            setIsModalOpen(false);
            setNewLibrary({
                name: '',
                address: '',
                description: '',
            });
        } catch {
            // Ошибка добавления
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRowClick = (libraryId: number) => {
        navigate(`/profile/admin/libraries/${libraryId}`);
    };

    const indexOfLastLibrary = currentPage * librariesPerPage;
    const indexOfFirstLibrary = indexOfLastLibrary - librariesPerPage;
    const currentLibraries = filteredLibraries.slice(indexOfFirstLibrary, indexOfLastLibrary);
    const totalPages = Math.ceil(filteredLibraries.length / librariesPerPage);

    return {
        libraries,
        filteredLibraries,
        loading,
        error,
        searchQuery,
        currentPage,
        isModalOpen,
        newLibrary,
        isSubmitting,
        currentLibraries,
        totalPages,
        setSearchQuery,
        setCurrentPage,
        setIsModalOpen,
        setNewLibrary,
        handleAddLibrary,
        handleRowClick,
    };
};