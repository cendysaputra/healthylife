import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { BookmarkIcon } from './Icon';

function FavoriteButton({ content }) {
  const { user } = useAuth();
  const { isSaved, toggle } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const [proses, setProses] = useState(false);
  const [error, setError] = useState('');
  const tersimpan = isSaved(content._id);

  const handleClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setProses(true);
    setError('');
    try {
      await toggle(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setProses(false);
    }
  };

  return (
    <div className="favorite">
      <button
        type="button"
        className="favorite-button"
        onClick={handleClick}
        disabled={proses}
        aria-pressed={tersimpan}
      >
        <BookmarkIcon />
        {tersimpan ? 'Tersimpan di favorit' : 'Simpan ke favorit'}
      </button>
      {error && (
        <p role="alert" className="alert alert--error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FavoriteButton;
