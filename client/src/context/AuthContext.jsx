import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('spoorthi_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('spoorthi_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Refresh current user profile
      api.get('/auth/profile')
        .then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('spoorthi_user', JSON.stringify(res.data));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { token: userToken, ...userData } = res.data;
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('spoorthi_token', userToken);
        localStorage.setItem('spoorthi_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.success && res.data) {
        const { token: userToken, ...userData } = res.data;
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('spoorthi_token', userToken);
        localStorage.setItem('spoorthi_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spoorthi_token');
    localStorage.removeItem('spoorthi_user');
  };

  const updateUserProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('spoorthi_user', JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'ADMIN',
        isCoordinator: user?.role === 'COORDINATOR',
        isStudent: user?.role === 'STUDENT',
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
