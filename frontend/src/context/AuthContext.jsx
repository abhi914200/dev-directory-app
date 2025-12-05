import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // for initial auth check

  // Load from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('devdir_token');
    const storedUser = localStorage.getItem('devdir_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);
     
  const saveAuthData = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('devdir_token', tokenValue);
    localStorage.setItem('devdir_user', JSON.stringify(userData));
  };

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('devdir_token');
    localStorage.removeItem('devdir_user');
  };

  const signup = async ({ name, email, password }) => {
    const res = await api.post('/api/auth/signup', { name, email, password });
    const { user, token } = res.data;
    saveAuthData(user, token);
    return res.data;
  };

  const login = async ({ email, password }) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { user: userData, token: tokenValue } = res.data;
    saveAuthData(userData, tokenValue);
    return res.data;
  };

  const logout = () => {
    clearAuthData();
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
