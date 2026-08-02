import { useNavigate, useLocation } from 'react-router-dom';

interface BookingData {
    bookTitle: string;
    bookAuthor: string;
    libraryName: string;
    libraryAddress: string;
    dateStart: string;
    dateEnd: string;
    userFullName?: string;
}

interface UseBookingSuccessReturn {
    bookingData: BookingData | null;
    mapUrl: string;
    goHome: () => void;
    goToBookings: () => void;
}

export const useBookingSuccess = (): UseBookingSuccessReturn => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingData = location.state as BookingData | null;

    const getLibraryCoords = (libraryName: string): [number, number] => {
        // TODO: Заменить на реальный API запрос к бэкенду
        const coords: Record<string, [number, number]> = {
            'Библиотека им. Тургенева': [37.637, 55.766],
            'Библиотека им. Некрасова': [37.680, 55.772],
            'Центральная городская библиотека': [37.680, 55.772],
            'Центральная детская библиотека им. А.С. Пушкина': [37.642, 55.765],
            'Библиотека № 151 имени Е.И. Чарушина': [37.581, 55.763],
        };
        return coords[libraryName] || [37.617, 55.755];
    };

    const [lng, lat] = bookingData 
        ? getLibraryCoords(bookingData.libraryName) 
        : [37.617, 55.755];
    
    const mapUrl = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cflag`;

    const goHome = () => navigate('/');
    const goToBookings = () => navigate('/profile/books?filter=booked');

    return {
        bookingData,
        mapUrl,
        goHome,
        goToBookings,
    };
};