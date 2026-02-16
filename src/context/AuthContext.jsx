import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Check for Supabase session
        if (supabase) {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (session) {
            const token = session.access_token;
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', session.refresh_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Try to fetch profile from backend
            try {
              // Determine if we should fetch profile. 
              // For now, let's just stick to the session user metadata if we can, 
              // but existing logic used localStorage 'user' heavily.
              // We'll trust the session for now.
              const userMetadata = session.user.user_metadata || {};
              const fullUser = {
                id: session.user.id,
                email: session.user.email,
                fullName: userMetadata.full_name,
                ...userMetadata
              };
              if (mounted) setUser(fullUser);
            } catch (err) {
              console.error("Profile sync error", err);
            }
          }
        }

        // 2. Restore from localStorage (as fallback or primary if Supabase failed/not used)
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const isGuest = localStorage.getItem('isGuest');

        if (token && userData) {
          if (mounted) {
            setUser(JSON.parse(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } else if (isGuest === 'true') {
          if (mounted) {
            setUser({
              id: 'guest',
              fullName: 'Guest User',
              email: 'guest@careerloop.io',
              isGuest: true
            });
          }
        }

      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isGuest');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Set up listener
    let subscription = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session) {
          // ... logic to update user ...
          const token = session.access_token;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', session.refresh_token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          try {
            const response = await axios.get('/api/user/profile');
            if (mounted) {
              setUser(response.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          } catch (e) {
            console.error('Profile fetch failed', e);
            // Fallback
            const u = {
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata.full_name
            };
            if (mounted) setUser(u);
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
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

  /* Social Logins */
  const loginWithGoogle = async () => {
    if (!supabase) {
      console.warn('Supabase not configured');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });

    if (error) throw error;
  };

  const loginWithGithub = async () => {
    if (!supabase) {
      console.warn('Supabase not configured');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });

    if (error) throw error;
  };

  const loginWithLinkedin = async () => {
     // Note: LinkedIn OIDC is preferred if available.
     // Also double check if 'linkedin_oidc' or 'linkedin' is required based on your Supabase config.
     // Using 'linkedin' as standard default, can be 'linkedin_oidc'
    if (!supabase) {
      console.warn('Supabase not configured');
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc', // Modern LinkedIn Auth
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });

    if (error) throw error;
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

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
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

    // First try Supabase refresh if it's a supabase session
    let data = { session: null };
    let error = null;
    
    if (supabase) {
      const result = await supabase.auth.refreshSession();
      data = result.data;
      error = result.error;
    }

    if (!error && data?.session) {
      const token = data.session.access_token;
      const newRefreshToken = data.session.refresh_token;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return true;
    }

    // Fallback to custom backend refresh
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
    <AuthContext.Provider value={{ user, login, signup, logout, refreshSession, loginAsGuest, loginWithGoogle, loginWithGithub, loginWithLinkedin }}>
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
