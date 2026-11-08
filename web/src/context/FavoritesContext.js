import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import client, { pesanError } from '../api/client';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

// State favorit
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.get('/favorites');
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ids = useMemo(() => new Set(items.map((i) => i._id)), [items]);

  // Optimistis dengan rollback
  const toggle = useCallback(
    async (content) => {
      const tersimpan = ids.has(content._id);
      setItems((list) => (tersimpan ? list.filter((i) => i._id !== content._id) : [content, ...list]));
      try {
        if (tersimpan) await client.delete(`/favorites/${content._id}`);
        else await client.post(`/favorites/${content._id}`);
      } catch (err) {
        setItems((list) => (tersimpan ? [content, ...list] : list.filter((i) => i._id !== content._id)));
        throw new Error(pesanError(err));
      }
    },
    [ids]
  );

  const value = { items, ids, loading, refresh, toggle, isSaved: (id) => ids.has(id) };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
