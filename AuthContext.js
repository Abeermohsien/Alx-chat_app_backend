import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ username: decoded.username, token });
    }
  }, []);

  const login = async (username, password) => {
    const response = await axios.post('http://localhost:3000/auth/login', { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    setUser({ username, token });
  };

  const register = async (username, password) => {
    await axios.post('http://localhost:3000/auth/register', { username, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
