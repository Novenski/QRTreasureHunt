import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const qrAPI = {
  getQRCode: (codeId) => api.get(`/qr/${codeId}`),
  claimQRCode: (codeId) => api.post(`/qr/${codeId}/claim`),
  getAllQRCodes: () => api.get('/qr/all'), // Neue API für alle QR-Codes
};

export const userAPI = {
  getStats: () => api.get('/user/stats'),
  getFoundCodes: () => api.get('/user/found-codes'),
};

export const leaderboardAPI = {
  getLeaderboard: () => api.get('/leaderboard'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getQRCodes: () => api.get('/admin/qr-codes'),
  createQRCode: (qrCodeData) => api.post('/admin/qr-codes', qrCodeData),
  updateQRCode: (id, qrCodeData) => api.put(`/admin/qr-codes/${id}`, qrCodeData),
  deleteQRCode: (id) => api.delete(`/admin/qr-codes/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleQRCodeActive: (id) => api.patch(`/admin/qr-codes/${id}/toggle-active`),
};

export default api;
