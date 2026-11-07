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

const bulanTahun = (date) => new Date(date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

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
        title={
          <>
            Halo,
            <br />
            <span>{namaDepan}.</span>
          </>
        }
        description="Atur target harian, lihat kebiasaan pilihanmu, dan buka lagi konten yang sudah kamu simpan."
        art={
          <div className="prof-avatar-wrap">
            <div className="prof-avatar" aria-hidden="true">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <Mascot varian="kuning" className="prof-maskot prof-maskot--a" />
            <Mascot varian="ungu" className="prof-maskot prof-maskot--b" />
          </div>
        }
      >
        <dl className="prof-stats">
          <div>
            <dt>Target harian</dt>
            <dd>
              {user.dailyTarget}
              <small>menit</small>
            </dd>
          </div>
          <div>
            <dt>Konten tersimpan</dt>
            <dd>{favorit.length}</dd>
          </div>
          {user.createdAt && (
            <div>
              <dt>Bergabung</dt>
              <dd className="prof-stats-text">{bulanTahun(user.createdAt)}</dd>
            </div>
          )}
        </dl>
      </PageHero>

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
            Lihat aktivitasmu <Sym id="arrow" />
          </Link>
        </div>

        <div className="prof-card prof-card--habit">
          <Sym id={kebiasaan?.simbol || 'cat-leaf'} className="prof-habit-art" />
          <span className="hl-eyebrow">KEBIASAAN PILIHANMU</span>
          <h2>{kebiasaan ? kebiasaan.label : 'Belum memilih kebiasaan.'}</h2>
          <p>{kebiasaan ? kebiasaan.teks : 'Pilih satu kebiasaan kecil di beranda, lalu mulai pelan-pelan.'}</p>
          <div className="prof-habit-links">
            {kebiasaan?.link && (
              <Link to={kebiasaan.link.to} className="hl-button hl-button--orange hl-button--sm">
                {kebiasaan.link.label}
              </Link>
            )}
            <Link to="/#kebiasaan" className="prof-habit-change">
              {kebiasaan ? 'Ganti kebiasaan' : 'Pilih kebiasaan'} <Sym id="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <section className="prof-fav container" id="favorit" aria-labelledby="judul-favorit">
        <div className="hl-heading">
          <div>
            <span className="hl-eyebrow prof-fav-eyebrow">TERSIMPAN UNTUKMU</span>
            <h2 id="judul-favorit">Favoritmu.</h2>
          </div>
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
