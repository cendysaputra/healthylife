import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client, { pesanError } from '../api/client';
import ContentCard from '../components/ContentCard';
import { useAuth } from '../context/AuthContext';
import { formatTanggal } from '../utils/format';

function Profile() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [favorit, setFavorit] = useState([]);
  const [target, setTarget] = useState(user.dailyTarget);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');

  // Ambil favorit
  useEffect(() => {
    client
      .get('/favorites')
      .then(({ data }) => setFavorit(data.items))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, []);

  // Simpan target
  const handleTarget = async (e) => {
    e.preventDefault();
    setError('');
    setPesan('');
    try {
      const { data } = await client.put('/users/target', { dailyTarget: Number(target) });
      setUser({ ...user, dailyTarget: data.dailyTarget });
      setPesan('Target harian diperbarui.');
    } catch (err) {
      setError(pesanError(err));
    }
  };

  // Hapus favorit
  const hapusFavorit = async (id) => {
    try {
      await client.delete(`/favorites/${id}`);
      setFavorit((list) => list.filter((f) => f._id !== id));
    } catch (err) {
      setError(pesanError(err));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <h1>Profil</h1>

          {/* Data akun */}
          <dl>
            <dt>Nama</dt>
            <dd>{user.name}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Bergabung</dt>
            <dd>{formatTanggal(user.createdAt)}</dd>
          </dl>

          {/* Target harian */}
          <form onSubmit={handleTarget}>
            <label htmlFor="target">Target harian (menit)</label>
            <input id="target" type="number" min="5" max="300" required value={target} onChange={(e) => setTarget(e.target.value)} />
            <button type="submit">Simpan Target</button>
          </form>

          {error && <p role="alert">{error}</p>}
          {pesan && <p role="status">{pesan}</p>}

          <button type="button" onClick={handleLogout}>Keluar</button>
        </div>
      </section>

      <section className="section" id="favorit">
        <div className="container">
          {/* Daftar favorit */}
          <h2>Favorit</h2>
          {loading && <p>Memuat...</p>}
          {!loading && favorit.length === 0 && <p>Belum ada konten favorit.</p>}
          <div className="grid">
            {favorit.map((item) => (
              <div key={item._id}>
                <ContentCard content={item} />
                <button type="button" onClick={() => hapusFavorit(item._id)}>Hapus dari Favorit</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
