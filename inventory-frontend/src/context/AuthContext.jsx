import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set API URL once on mount
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    axios.defaults.baseURL = API_URL;
    console.log('🔗 API URL:', API_URL);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log(
        '🔐 Attempting login to:',
        axios.defaults.baseURL + '/api/auth/login',
      );
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      await new Promise((resolve) => setTimeout(resolve, 100));

      setUser(userData);

      // ✅ Dispatch event to reset app state on login
      window.dispatchEvent(new CustomEvent('userLoggedIn'));

      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (name, email, password) => {
    try {
      console.log(
        '📝 Attempting signup to:',
        axios.defaults.baseURL + '/api/auth/signup',
      );
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      const { token, user: userData } = response.data;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      await new Promise((resolve) => setTimeout(resolve, 100));

      setUser(userData);

      // ✅ Dispatch event to reset app state on signup
      window.dispatchEvent(new CustomEvent('userLoggedIn'));

      return { success: true };
    } catch (error) {
      console.error('❌ Signup error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);

    // ✅ Dispatch event to reset app state on logout
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
