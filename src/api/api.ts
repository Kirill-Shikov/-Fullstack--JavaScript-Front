import { api } from './axios.config';

// ===== АУТЕНТИФИКАЦИЯ =====
export const authAPI = {
    login: (data: { name: string; password: string }) =>
        api.post('/auth/login', data),
    register: (data: { email: string; password: string; name: string; contactPhone?: string }) =>
        api.post('/client/register', data),
    logout: () => api.post('/auth/logout'),
};

// ===== КНИГИ =====
export const booksAPI = {
    search: (params: { title?: string; author?: string; library?: number; availableOnly?: boolean }) =>
        api.get('/common/books', { params }),
    getById: (id: number) => api.get(`/common/books/${id}`),
};

// ===== БИБЛИОТЕКИ =====
export const librariesAPI = {
    getAll: () => api.get('/common/libraries'),
    getById: (id: number) => api.get(`/common/libraries/${id}`),
};

// ===== АРЕНДА =====
export const rentalsAPI = {
    create: (data: { bookId: number; libraryId: number; dateStart: string; dateEnd: string }) =>
        api.post('/client/rentals', data),
    getUserRentals: () => api.get('/client/rentals'),
    cancel: (id: number) => api.patch(`/client/rentals/${id}/cancel`),
};

// ===== ЧАТ ПОДДЕРЖКИ =====
export const supportAPI = {
    createRequest: (data: { text: string }) => api.post('/client/support-requests', data),
    getRequests: () => api.get('/client/support-requests'),
    getMessages: (id: number) => api.get(`/common/support-requests/${id}/messages`),
    sendMessage: (id: number, data: { text: string }) =>
        api.post(`/common/support-requests/${id}/messages`, data),
};