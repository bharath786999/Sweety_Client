'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Read localStorage only after mount (it does not exist during server render).
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sweety_user');
      if (saved && localStorage.getItem('sweety_token')) setUser(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  const login = (token, u) => {
    localStorage.setItem('sweety_token', token);
    localStorage.setItem('sweety_user', JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem('sweety_token');
    localStorage.removeItem('sweety_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}
