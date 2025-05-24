import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Assure-toi que le chemin est bon

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (token, userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  // Nouvelle fonction register dans le contexte
  const register = async (formData) => {
    try {
      const response = await api.post('/register', formData);
      const user = response.data.user;
      const token = response.data.token;
      login(token, user);
      return { user, token };
    } catch (error) {
      throw error; // on laisse l’erreur remonter pour le composant qui appelle
    }
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Erreur de parsing JSON :", error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
