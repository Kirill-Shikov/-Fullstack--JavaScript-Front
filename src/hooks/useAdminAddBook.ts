import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios.config';

interface LibraryData {
  id: number;
  name: string;
  address: string;
  description: string;
  totalBooks: number;
  availableBooks: number;
}

interface UseAdminAddBookReturn {
  libraries: LibraryData[];
  selectedLibraryId: number | null;
  isDropdownOpen: boolean;
  loading: boolean;
  isAddBookModalOpen: boolean;
  newBook: {
    title: string;
    author: string;
    year: string;
    description: string;
  };
  bookCopies: number;
  coverFile: File | null;
  coverPreview: string | null;
  selectedLibrary: LibraryData | undefined;
  setSelectedLibraryId: (id: number) => void;
  setIsDropdownOpen: (value: boolean) => void;
  setIsAddBookModalOpen: (value: boolean) => void;
  setNewBook: (value: any) => void;
  setBookCopies: (value: number) => void;
  setCoverFile: (value: File | null) => void;
  setCoverPreview: (value: string | null) => void;
  handleSelectLibrary: (id: number) => void;
  handleCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadClick: () => void;
  handleAddBook: () => Promise<void>;
  handleOpenCatalog: () => void;
}

export const useAdminAddBook = (): UseAdminAddBookReturn => {
  const navigate = useNavigate();
  
  const [libraries, setLibraries] = useState<LibraryData[]>([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    year: '',
    description: '',
  });
  const [bookCopies, setBookCopies] = useState(1);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await api.get('/api/admin/libraries');
        // ✅ МАПИМ ДАННЫЕ
        setLibraries(response.data.map((lib: any) => ({
          ...lib,
          totalBooks: lib.totalCopies || 0,
          availableBooks: lib.availableCopies || 0,
        })));
      } catch {
        setLibraries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLibraries();
  }, []);

  const selectedLibrary = libraries.find(lib => lib.id === selectedLibraryId);

  const handleSelectLibrary = (id: number) => {
    setSelectedLibraryId(id);
    setIsDropdownOpen(false);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    document.getElementById('cover-upload')?.click();
  };

  const handleAddBook = async () => {
    if (!selectedLibraryId) {
      return;
    }
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

      await api.post(`/api/admin/libraries/${selectedLibraryId}/books`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setIsAddBookModalOpen(false);
      setNewBook({ title: '', author: '', year: '', description: '' });
      setCoverFile(null);
      setCoverPreview(null);
      setBookCopies(1);
      
    } catch {
      // Ошибка добавления книги
    }
  };

  const handleOpenCatalog = () => {
    if (!selectedLibraryId) {
      return;
    }
    navigate(`/profile/admin/libraries/${selectedLibraryId}`);
  };

  return {
    libraries,
    selectedLibraryId,
    isDropdownOpen,
    loading,
    isAddBookModalOpen,
    newBook,
    bookCopies,
    coverFile,
    coverPreview,
    selectedLibrary,
    setSelectedLibraryId,
    setIsDropdownOpen,
    setIsAddBookModalOpen,
    setNewBook,
    setBookCopies,
    setCoverFile,
    setCoverPreview,
    handleSelectLibrary,
    handleCoverUpload,
    handleUploadClick,
    handleAddBook,
    handleOpenCatalog,
  };
};