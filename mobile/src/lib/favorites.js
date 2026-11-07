import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { pesanError } from './api';
import { useAuth } from './auth';

const FavoritesContext = createContext(null);

// Favorit bersama (kartu, detail, profil)
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!user) return setItems([]);
    setLoading(true);
    try {
      const { data } = await api.get('/favorites');
      setItems(data.items);
    } catch {
      // Biarkan daftar lama
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  const isSaved = (id) => items.some((i) => i._id === id);

  const toggle = async (content) => {
    const tersimpan = isSaved(content._id);
    try {
      if (tersimpan) {
        await api.delete(`/favorites/${content._id}`);
        setItems((list) => list.filter((i) => i._id !== content._id));
      } else {
        await api.post(`/favorites/${content._id}`);
        setItems((list) => [content, ...list]);
      }
    } catch (err) {
      throw new Error(pesanError(err));
    }
  };

  return (
    <FavoritesContext.Provider value={{ items, loading, isSaved, toggle, reload }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
