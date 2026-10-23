import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details on load if token exists
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const receivedToken = res.data.data.token;
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);

    // Fetch user details
    const meRes = await api.get('/auth/me');
    const userData = meRes.data.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Helper for 1-click quick demo login
  const quickLogin = async (key) => {
    const demoCredentials = {
      superadmin: { email: 'superadmin@localhostdining.com', password: 'Password123!' },
      bistro: { email: 'admin.bistro@localhostdining.com', password: 'Password123!' },
      sakura: { email: 'admin.sakura@localhostdining.com', password: 'Password123!' },
      alice: { email: 'alice.diner@example.com', password: 'Password123!' },
      bob: { email: 'bob.diner@example.com', password: 'Password123!' },
    };

    const creds = demoCredentials[key];
    if (creds) {
      return await login(creds.email, creds.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickLogin,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'super_admin',
        isRestaurantAdmin: user?.role === 'restaurant_admin',
        isDiner: user?.role === 'diner',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
