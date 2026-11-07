import { Link, useNavigate } from 'react-router-dom';
import { PageHero } from '../components/Canvas';
import ContentCard from '../components/ContentCard';
import Mascot from '../components/Mascot';
import Sym from '../components/Svg';
import TargetForm from '../components/TargetForm';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { KEBIASAAN } from '../data/home';
import { formatTanggal } from '../utils/format';

// Kebiasaan dari localStorage
const bacaKebiasaan = () => {
  try {
    return KEBIASAAN.find((k) => k.id === localStorage.getItem('healthylife_habit')) || null;
  } catch {
    return null;
  }
};

function Profile() {
  const { user, logout } = useAuth();
  const { items: favorit, loading } = useFavorites();
  const navigate = useNavigate();
  const kebiasaan = bacaKebiasaan();
  const namaDepan = user.name?.split(' ')[0] || user.name;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <PageHero
        className="prof-hero"
        top={<span className="prof-hello">Halo, {namaDepan}</span>}
        title={
          <>
            Langkah kecilmu,
            <br />
            <span>tersimpan di sini.</span>
          </>
        }
        description="Target, kebiasaan, dan bacaan favoritmu."
        art={
          <div className="prof-avatar-wrap" aria-hidden="true">
            <span className="prof-avatar-ring" />
            <div className="prof-avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <span className="prof-chip prof-chip--target">
              <i />
              Target {user.dailyTarget} menit/hari
            </span>
            <span className="prof-chip prof-chip--habit">
              <Sym id={kebiasaan?.simbol || 'cat-leaf'} />
              {kebiasaan ? kebiasaan.label : 'Belum pilih kebiasaan'}
            </span>
            <Mascot varian="kuning" className="prof-maskot prof-maskot--a" />
            <Mascot varian="lavender" className="prof-maskot prof-maskot--b" />
          </div>
        }
      />

      <section className="prof-grid container" aria-label="Akun, target, dan kebiasaan">
        <div className="prof-card prof-card--akun">
          <span className="hl-eyebrow">AKUN</span>
          <h2>Tentang kamu</h2>
          <dl className="prof-data">
            <div>
              <dt>Nama</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            {user.createdAt && (
              <div>
                <dt>Bergabung</dt>
                <dd>{formatTanggal(user.createdAt)}</dd>
              </div>
            )}
          </dl>
          <button type="button" className="prof-logout" onClick={handleLogout}>
            Keluar dari akun
          </button>
        </div>

        <div className="prof-card prof-card--target">
          <span className="hl-eyebrow">TARGET HARIAN</span>
          <h2>Bergerak {user.dailyTarget} menit setiap hari.</h2>
          <TargetForm idPrefix="profil-target" />
          <Link to="/aktivitas" className="hl-link hl-link--ink prof-card-link">
            Lihat aktivitasmu
          </Link>
        </div>

        <div className="prof-card prof-card--habit">
          <Sym id={kebiasaan?.simbol || 'cat-leaf'} className="prof-habit-art" />
          <span className="hl-eyebrow">KEBIASAAN PILIHANMU</span>
          <h2>{kebiasaan ? kebiasaan.label : 'Belum memilih kebiasaan.'}</h2>
          <p>{kebiasaan ? kebiasaan.teks : 'Pilih satu kebiasaan kecil di beranda, lalu mulai pelan-pelan.'}</p>
          <div className="prof-habit-links">
            {kebiasaan?.link ? (
              <Link to={kebiasaan.link.to} className="prof-habit-link">
                {kebiasaan.link.label}
              </Link>
            ) : (
              !kebiasaan && (
                <Link to="/#kebiasaan" className="prof-habit-link">
                  Pilih kebiasaan
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      <section className="prof-fav container" id="favorit" aria-labelledby="judul-favorit">
        <div className="hl-heading">
          <h2 id="judul-favorit">Favoritmu.</h2>
          <Link to="/konten" className="hl-button hl-button--sm">
            Cari konten lain
          </Link>
        </div>

        {loading && (
          <div className="hl-card-grid" role="status" aria-label="Memuat favorit">
            <div className="hl-skeleton" />
            <div className="hl-skeleton" />
            <div className="hl-skeleton" />
          </div>
        )}

        {!loading && favorit.length === 0 && (
          <div className="hl-empty prof-empty">
            <Mascot varian="lavender" className="prof-empty-maskot" />
            <h3>Belum ada konten favorit.</h3>
            <p>Tekan ikon bookmark di kartu atau di halaman konten untuk menyimpannya di sini.</p>
            <Link to="/konten" className="hl-link">
              Lihat semua konten <Sym id="arrow" />
            </Link>
          </div>
        )}

        {!loading && favorit.length > 0 && (
          <div className="hl-card-grid">
            {favorit.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Profile;
