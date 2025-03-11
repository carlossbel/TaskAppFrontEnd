// src/services/authService.js
import axios from 'axios';
import API_BASE_URL from '../config/api';

// Configura axios con encabezados predeterminados
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/login`, { email, password });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      // Agregar más información de depuración
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/register`, { username, email, password });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      // Agregar más información de depuración
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: () => {
    const user = AuthService.getCurrentUser();
    return !!user && !!user.token;
  },

  // Agregar método isAdmin
  isAdmin: () => {
    const user = AuthService.getCurrentUser();
    return !!user && user.role === 'admin';
  },

  authHeader: () => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }
};

export default AuthService;