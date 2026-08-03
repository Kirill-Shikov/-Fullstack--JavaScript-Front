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
    coverImage?: string;
}

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

                const librariesResponse = await librariesAPI.getAll();
                const allLibraries = librariesResponse.data;

                const librariesWithBook = allLibraries.map((library: Library) => {
                    if (library.id === bookData.libraryId) {
                        return {
                            ...library,
                            bookTotalCopies: bookData.totalCopies || 0,
                            bookAvailableCopies: bookData.availableCopies || 0,
                        };
                    } else {
                        return {
                            ...library,
                            bookTotalCopies: 0,
                            bookAvailableCopies: 0,
                        };
                    }
                });

                setLibraries(librariesWithBook);

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
        // ✅ Проверка выбора библиотеки
        if (!selectedLibrary) {
            alert('Пожалуйста, выберите библиотеку');
            return;
        }
        
        // ✅ Проверка выбора дат
        if (!dateStart || !dateEnd) {
            alert('Пожалуйста, выберите даты');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const startDate = parseDate(dateStart);
        const endDate = parseDate(dateEnd);
        
        if (!startDate || !endDate) {
            alert('Пожалуйста, выберите корректные даты');
            return;
        }
        
        // ✅ Проверка: дата в прошлом
        if (startDate < today) {
            alert('Дата выдачи не может быть в прошлом!');
            return;
        }
        
        if (endDate < today) {
            alert('Дата возврата не может быть в прошлом!');
            return;
        }
        
        // ✅ Проверка: дата возврата раньше выдачи
        if (endDate <= startDate) {
            alert('Дата возврата должна быть позже даты выдачи!');
            return;
        }
        
        // ✅ Проверка: слишком долгий срок
        const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 30) {
            alert('Срок бронирования не может превышать 30 дней!');
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
            // ✅ ОПОВЕЩЕНИЕ ОБ ОШИБКЕ
            if (error.response?.status === 409) {
                alert('Все копии книги уже забронированы на выбранные даты. Попробуйте другие даты.');
            } else {
                alert(error.response?.data?.message || 'Ошибка бронирования. Попробуйте позже.');
            }
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