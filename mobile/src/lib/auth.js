import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { ambilToken, hapusToken, simpanToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek sesi saat aplikasi dibuka
  const refreshUser = useCallback(async () => {
    try {
      if (!(await ambilToken())) return setUser(null);
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      await hapusToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    await simpanToken(data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    await simpanToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await hapusToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
