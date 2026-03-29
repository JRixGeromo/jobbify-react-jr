// PostgreSQL Database Client (replaces Supabase)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Types
interface QueryOptions {
  select?: string;
  filter?: Record<string, any>;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
  message: string;
}

interface AuthStateChange {
  session: { user: AuthUser } | null;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const auth = {
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      firstName,
      lastName,
    });
    return response.data;
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  async signOut() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  async forgotPassword(email: string) {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/api/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  async verifyToken() {
    const response = await api.get('/api/auth/verify');
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  onAuthStateChange(callback: (state: AuthStateChange) => void) {
    // Simple implementation for auth state changes
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      callback({
        session: token && user ? { user: JSON.parse(user) } : null,
      });
    };

    // Check immediately
    checkAuth();

    // Listen for storage events (for cross-tab auth state sync)
    window.addEventListener('storage', checkAuth);

    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  },
};

// Database functions
export const db = {
  // Generic query function
  async query(table: string, options: QueryOptions = {}) {
    const { select = '*', filter = {}, orderBy, limit, offset } = options;
    
    let url = `/api/${table}`;
    const params = new URLSearchParams();
    
    if (select && select !== '*') {
      params.append('select', select);
    }
    
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    if (orderBy) {
      params.append('orderBy', orderBy);
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (offset) {
      params.append('offset', offset.toString());
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },

  // Insert function
  async insert(table: string, data: any) {
    const response = await api.post(`/api/${table}`, data);
    return response.data;
  },

  // Update function
  async update(table: string, id: any, data: any) {
    const response = await api.put(`/api/${table}/${id}`, data);
    return response.data;
  },

  // Delete function
  async delete(table: string, id: any) {
    const response = await api.delete(`/api/${table}/${id}`);
    return response.data;
  },

  // Storage functions (replaces Supabase storage)
  storage: {
    async upload(bucket: string, path: string, file: File) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('path', path);

      const response = await api.post('/api/storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },

    async getPublicUrl(bucket: string, path: string) {
      return `${API_BASE_URL}/api/storage/public/${bucket}/${path}`;
    },

    async remove(bucket: string, paths: string | string[]) {
      const response = await api.delete('/api/storage/remove', {
        data: { bucket, paths: Array.isArray(paths) ? paths : [paths] },
      });
      return response.data;
    },
  },
};

export default api;
