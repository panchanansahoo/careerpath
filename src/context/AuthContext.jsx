import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const refreshToken = localStorage.getItem('refreshToken');
      const isGuest = localStorage.getItem('isGuest');

      if (token && userData) {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else if (isGuest === 'true') {
        setUser({
          id: 'guest',
          fullName: 'Guest User',
          email: 'guest@careerloop.io',
          isGuest: true
        });
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isGuest');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, refreshToken, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);

    return user;
  };

  const signup = async (email, password, fullName) => {
    const response = await axios.post('/api/auth/signup', { email, password, fullName });
    const { token, refreshToken, user } = response.data;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isGuest');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest',
      fullName: 'Guest User',
      email: 'guest@careerloop.io',
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem('isGuest', 'true');
    // Clear any potential leftover real auth data to avoid confusion
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const refreshSession = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      const { token, refreshToken: newRefreshToken } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  // Set up axios interceptor for token refresh on 401/403
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry &&
          localStorage.getItem('refreshToken')
        ) {
          originalRequest._retry = true;
          const refreshed = await refreshSession();
          if (refreshed) {
            originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshSession, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
