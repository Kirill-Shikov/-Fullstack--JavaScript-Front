import { api } from './axios.config';

// ===== АУТЕНТИФИКАЦИЯ =====
export const authAPI = {
    login: (data: { login: string; password: string }) =>
        api.post('/api/auth/login', data),
    register: (data: { email: string; password: string; name: string; contactPhone?: string }) =>
        api.post('/api/client/register', data),
    logout: () => api.post('/api/auth/logout'),
};

// ===== КНИГИ =====
export const booksAPI = {
    search: (params: { title?: string; author?: string; library?: number; availableOnly?: boolean }) =>
        api.get('/api/common/books', { params }),
    getById: (id: number) => api.get(`/api/common/books/${id}`),
};

// ===== БИБЛИОТЕКИ =====
export const librariesAPI = {
    getAll: () => api.get('/api/common/libraries'),
    getById: (id: number) => api.get(`/api/common/libraries/${id}`),
};

// ===== АРЕНДА =====
export const rentalsAPI = {
    create: (data: { bookId: number; libraryId: number; dateStart: string; dateEnd: string }) =>
        api.post('/api/client/rentals', data),
    getUserRentals: () => api.get('/api/client/rentals'),  // ← ИСПРАВЛЕНО!
    cancel: (id: number) => api.patch(`/api/client/rentals/${id}/cancel`),
};

// ===== ЧАТ ПОДДЕРЖКИ =====
export const supportAPI = {
    createRequest: (data: { text: string }) => api.post('/api/client/support-requests', data),
    getRequests: () => api.get('/api/client/support-requests'),
    getMessages: (id: number) => api.get(`/api/common/support-requests/${id}/messages`),
    sendMessage: (id: number, data: { text: string }) =>
        api.post(`/api/common/support-requests/${id}/messages`, data),
};