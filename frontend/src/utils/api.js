import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API örneği oluştur
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token interceptor
apiClient.interceptors.request.use(
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

// Auth API'leri
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me')
};

// Field (Tarla) API'leri
export const fieldAPI = {
  getAll: () => apiClient.get('/fields'),
  getById: (id) => apiClient.get(`/fields/${id}`),
  create: (fieldData) => apiClient.post('/fields', fieldData),
  update: (id, fieldData) => apiClient.put(`/fields/${id}`, fieldData),
  delete: (id) => apiClient.delete(`/fields/${id}`)
};

// Activity API'leri
export const activityAPI = {
  getAll: (params) => apiClient.get('/activities', { params }),
  getById: (id) => apiClient.get(`/activities/${id}`),
  create: (activityData) => apiClient.post('/activities', activityData),
  update: (id, activityData) => apiClient.put(`/activities/${id}`, activityData),
  delete: (id) => apiClient.delete(`/activities/${id}`)
};

export default apiClient;
