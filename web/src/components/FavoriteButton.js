import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import client, { pesanError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

// Button favorit
function FavoriteButton({ contentId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tersimpan, setTersimpan] = useState(false);
  const [proses, setProses] = useState(false);
  const [error, setError] = useState('');

  // Cek status
  useEffect(() => {
    if (!user) {
      setTersimpan(false);
      return;
    }
    setTersimpan((user.favorites || []).includes(contentId));
    client
      .get('/favorites')
      .then(({ data }) => setTersimpan(data.items.some((i) => i._id === contentId)))
      .catch(() => {});
  }, [user, contentId]);

  const handleClick = async () => {
    // Belum login
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setProses(true);
    setError('');
    try {
      if (tersimpan) {
        await client.delete(`/favorites/${contentId}`);
        setTersimpan(false);
      } else {
        await client.post(`/favorites/${contentId}`);
        setTersimpan(true);
      }
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setProses(false);
    }
  };

  return (
    <div className="favorite">
      <button
        type="button"
        className={`btn btn--secondary btn--sm favorite__btn ${tersimpan ? 'is-saved' : ''}`}
        onClick={handleClick}
        disabled={proses}
        aria-pressed={tersimpan}
      >
        <Icon name="heart" />
        {tersimpan ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
      </button>
      {error && <p role="alert" className="alert alert--error">{error}</p>}
    </div>
  );
}

export default FavoriteButton;
