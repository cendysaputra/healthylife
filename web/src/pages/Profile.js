import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHero } from '../components/Canvas';
import ContentCard from '../components/ContentCard';
import CtaBox from '../components/CtaBox';
import Sym from '../components/Svg';
import TargetForm from '../components/TargetForm';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { KEBIASAAN } from '../data/home';
import { formatTanggal } from '../utils/format';

// Diisi dari pilihan kebiasaan di beranda (localStorage)
const bacaKebiasaan = () => {
  try {
    return KEBIASAAN.find((k) => k.id === localStorage.getItem('healthylife_habit')) || null;
  } catch {
    return null;
  }
};

function Profile() {
  const { user, logout } = useAuth();
  const { items: favorit, loading, toggle } = useFavorites();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const kebiasaan = bacaKebiasaan();
  const namaDepan = user.name?.split(' ')[0] || user.name;

  const hapusFavorit = async (item) => {
    setError('');
    try {
      await toggle(item);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <PageHero
        eyebrow="RUANG MILIKMU"
        title={
          <>
            Halo,
            <br />
            <span>{namaDepan}.</span>
          </>
        }
        description="Atur target harian, lihat kebiasaan pilihanmu, dan buka lagi konten yang sudah kamu simpan."
        art={
          <div className="hero-blob-wrap">
            <div className="hero-blob profile-blob">
              <span className="profile-initial" aria-hidden="true">{user.name?.charAt(0).toUpperCase()}</span>
            </div>
            <Sym id="buddy" className="hero-blob-badge" />
            <Sym id="sun" className="hero-blob-sun" />
            <Sym id="bubbles" className="hero-blob-bubbles" />
          </div>
        }
      >
        <div className="profile-stats">
          <div>
            <strong>{user.dailyTarget}</strong>
            <span>menit target harian</span>
          </div>
          <div>
            <strong>{favorit.length}</strong>
            <span>konten tersimpan</span>
          </div>
        </div>
      </PageHero>

      <section className="start-section container" aria-label="Akun dan target">
        <Sym id="bubbles" className="section-doodle doodle-a" />

        <div className="start-panel profile-panel">
          <span className="eyebrow">AKUN</span>
          <h2>Tentang kamu.</h2>
          <dl className="data-list">
            <dt>Nama</dt>
            <dd>{user.name}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>Bergabung</dt>
            <dd>{formatTanggal(user.createdAt)}</dd>
            <dt>Kebiasaan</dt>
            <dd>
              {kebiasaan ? kebiasaan.label : <Link to="/#kebiasaan" className="inline-link">Pilih kebiasaan di beranda</Link>}
            </dd>
          </dl>
          <button type="button" className="text-link profile-logout" onClick={handleLogout}>
            Keluar dari akun <Sym id="arrow" />
          </button>
          <Sym id={kebiasaan?.simbol || 'cat-leaf'} className="start-vector" />
        </div>

        <div className="start-panel start-food profile-panel">
          <span className="eyebrow">TARGET HARIAN</span>
          <h2>
            Bergerak {user.dailyTarget} menit
            <br />
            setiap hari.
          </h2>
          <TargetForm idPrefix="profil-target" />
          <Sym id="cat-shoe" className="start-vector" />
        </div>
      </section>

      <section className="articles-section container" id="favorit">
        <Sym id="cat-leaf" className="section-doodle doodle-e" />
        <div className="section-heading">
          <div>
            <span className="eyebrow">TERSIMPAN UNTUKMU</span>
            <h2>Favoritmu.</h2>
          </div>
          <Link to="/konten" className="text-link all-articles">
            Cari konten lain <Sym id="arrow" />
          </Link>
        </div>
        {error && <p role="alert" className="alert alert--error">{error}</p>}
        {loading && <p className="status" role="status">Memuat...</p>}
        {!loading && (
          <div className="article-grid">
            {favorit.length === 0 ? (
              <div className="articles-empty">
                <Sym id="heart" />
                <h3>Belum ada konten favorit.</h3>
                <p>Buka konten lalu pilih Simpan ke favorit, atau tekan ikon bookmark di kartu.</p>
                <Link to="/konten" className="text-link">
                  Lihat semua konten <Sym id="arrow" />
                </Link>
              </div>
            ) : (
              favorit.map((item) => (
                <div key={item._id} className="favorite-item">
                  <ContentCard content={item} />
                  <button type="button" className="link-danger" onClick={() => hapusFavorit(item)}>Hapus dari favorit</button>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <CtaBox />
    </>
  );
}

export default Profile;
