import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the auth context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios
  axios.defaults.baseURL = 'http://localhost:5000/api';
  axios.defaults.withCredentials = true;

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await axios.get('/auth/me');
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/auth/register', userData);
      setUser(res.data);
      setError(null);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
      return false;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('/auth/login', { email, password });
      setUser(res.data);
      setError(null);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      setLoading(false);
      return false;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
