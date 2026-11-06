import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
          <header className="page-head">
            <h1>Profil</h1>
          </header>

          <div className="profile">
            {/* Data akun */}
            <div>
              <h2 className="profile__title">Akun</h2>
              <dl className="data-list">
                <dt>Nama</dt>
                <dd>{user.name}</dd>
                <dt>Email</dt>
                <dd>{user.email}</dd>
                <dt>Bergabung</dt>
                <dd>{formatTanggal(user.createdAt)}</dd>
              </dl>
            </div>

            {/* Target harian */}
            <div>
              <h2 className="profile__title">Target harian</h2>
              <form onSubmit={handleTarget} className="target-form">
                <div className="field">
                  <label htmlFor="target">Target harian (menit)</label>
                  <input id="target" type="number" min="5" max="300" required value={target} onChange={(e) => setTarget(e.target.value)} />
                </div>
                <button type="submit" className="btn btn--primary">Simpan Target</button>
              </form>

              {error && <p role="alert" className="alert alert--error">{error}</p>}
              {pesan && <p role="status" className="alert alert--success">{pesan}</p>}
            </div>
          </div>

          <div className="profile-actions">
            <button type="button" className="btn btn--secondary" onClick={handleLogout}>Keluar</button>
          </div>
        </div>
      </section>

      <section className="section" id="favorit">
        <div className="container">
          {/* Daftar favorit */}
          <div className="section-head">
            <h2>Favorit</h2>
          </div>
          {loading && <p className="status" role="status">Memuat...</p>}
          {!loading && favorit.length === 0 && (
            <div className="empty">
              <p className="empty__title">Belum ada konten favorit.</p>
              <p className="empty__text">Buka konten lalu pilih Simpan ke Favorit agar tersimpan di sini.</p>
              <Link to="/konten" className="link-plain">Lihat semua konten</Link>
            </div>
          )}
          <div className="grid">
            {favorit.map((item) => (
              <div key={item._id} className="favorite-item">
                <ContentCard content={item} />
                <button type="button" className="btn-text btn-text--danger" onClick={() => hapusFavorit(item._id)}>Hapus dari Favorit</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
