import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { booksAPI, librariesAPI, rentalsAPI } from '../api/api';

interface Book {
    id: number;
    title: string;
    author: string;
    year: number;
    description: string;
    library: string;
    libraryId?: number;
    totalCopies?: number;
    availableCopies?: number;
}

// Расширяем интерфейс Library - добавляем информацию о книге в библиотеке
interface Library {
    id: number;
    name: string;
    address: string;
    totalCopies: number;
    availableCopies: number;
    description?: string;
    bookTotalCopies?: number;
    bookAvailableCopies?: number;
}

interface UseBookingReturn {
    book: Book | null;
    libraries: Library[];
    selectedLibrary: number | null;
    dateStart: string;
    dateEnd: string;
    isLoading: boolean;
    setSelectedLibrary: (id: number) => void;
    setDateStart: (date: string) => void;
    setDateEnd: (date: string) => void;
    handleBooking: () => Promise<void>;
}

export const useBooking = (bookId: string | undefined): UseBookingReturn => {
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [libraries, setLibraries] = useState<Library[]>([]);
    const [selectedLibrary, setSelectedLibrary] = useState<number | null>(null);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookResponse = await booksAPI.getById(Number(bookId));
                const bookData = bookResponse.data;
                setBook(bookData);

                // Получаем все библиотеки
                const librariesResponse = await librariesAPI.getAll();
                const allLibraries = librariesResponse.data;

                // ✅ ДЛЯ КАЖДОЙ БИБЛИОТЕКИ ДОБАВЛЯЕМ ИНФОРМАЦИЮ О КНИГЕ
                const librariesWithBook = allLibraries.map((library: Library) => {
                    // Если книга в этой библиотеке - берем количество копий
                    if (library.id === bookData.libraryId) {
                        return {
                            ...library,
                            bookTotalCopies: bookData.totalCopies || 0,
                            bookAvailableCopies: bookData.availableCopies || 0,
                        };
                    } else {
                        // Если книги нет - 0 копий
                        return {
                            ...library,
                            bookTotalCopies: 0,
                            bookAvailableCopies: 0,
                        };
                    }
                });

                setLibraries(librariesWithBook);

                // Автоматически выбираем библиотеку, если книга есть только в одной
                const availableLibraries = librariesWithBook.filter(
    (lib: Library) => lib.bookAvailableCopies && lib.bookAvailableCopies > 0
);
                if (availableLibraries.length === 1) {
                    setSelectedLibrary(availableLibraries[0].id);
                }
            } catch (error) {
                // Ошибка загрузки
            }
        };

        if (bookId) {
            fetchData();
        }
    }, [bookId]);

    const parseDate = (dateStr: string): Date | null => {
        const parts = dateStr.split('.');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        return new Date(year, month, day);
    };

    const formatDateForApi = (dateStr: string): string => {
        if (!dateStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        
        const parts = dateStr.split('.');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            return `${year}-${month}-${day}`;
        }
        return dateStr;
    };

    const handleBooking = async () => {
        if (!selectedLibrary) {
            return;
        }
        if (!dateStart || !dateEnd) {
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const startDate = parseDate(dateStart);
        const endDate = parseDate(dateEnd);
        
        if (!startDate || !endDate) {
            return;
        }
        
        if (startDate < today) {
            return;
        }
        
        if (endDate < today) {
            return;
        }
        
        if (endDate <= startDate) {
            return;
        }
        
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) {
            return;
        }

        setIsLoading(true);
        try {
            await rentalsAPI.create({
                bookId: Number(bookId),
                libraryId: selectedLibrary,
                dateStart: formatDateForApi(dateStart),
                dateEnd: formatDateForApi(dateEnd),
            });

            const selectedLib = libraries.find((l) => l.id === selectedLibrary);

            navigate('/booking-success', {
                state: {
                    bookTitle: book?.title || '',
                    bookAuthor: book?.author || '',
                    libraryName: selectedLib?.name || '',
                    libraryAddress: selectedLib?.address || '',
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                },
            });
        } catch (error: any) {
            // Ошибка бронирования
        } finally {
            setIsLoading(false);
        }
    };

    return {
        book,
        libraries,
        selectedLibrary,
        dateStart,
        dateEnd,
        isLoading,
        setSelectedLibrary,
        setDateStart,
        setDateEnd,
        handleBooking,
    };
};