import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cloud from './Cloud';
import Sym from './Svg';

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="hl-footer">
      <Cloud warna="#7500b4" mulai={5} className="hl-footer-cloud" />
      <div className="hl-footer-body">
        <div className="container hl-footer-main">
          <div className="hl-footer-intro">
            <Link to="/" className="hl-footer-brand" aria-label="HealthyLife beranda">
              <span>Healthy</span>Life.
            </Link>
            <p>
              Ruang untuk hidup lebih baik.
              <br />
              Satu kebiasaan kecil pada satu waktu.
            </p>
            <Link to={user ? '/aktivitas' : '/register'} className="hl-button hl-button--orange">
              {user ? 'Catat aktivitas hari ini' : 'Yuk, mulai dari sini'} <Sym id="arrow" />
            </Link>
          </div>

          <nav className="hl-footer-col" aria-labelledby="footer-jelajahi">
            <h2 id="footer-jelajahi">Jelajahi</h2>
            <Link to="/konten">Semua konten</Link>
            <Link to="/konten?kategori=artikel">Artikel</Link>
            <Link to="/konten?kategori=video">Video</Link>
            <Link to="/konten?kategori=olahraga">Olahraga</Link>
            <Link to="/konten?kategori=nutrisi">Nutrisi</Link>
          </nav>

          <nav className="hl-footer-col" aria-labelledby="footer-akun">
            <h2 id="footer-akun">Akun</h2>
            <Link to="/aktivitas">Aktivitas</Link>
            <Link to="/profil">Profil</Link>
            <Link to="/profil#favorit">Favorit</Link>
            {!user && <Link to="/login">Masuk</Link>}
            {!user && <Link to="/register">Daftar</Link>}
          </nav>

          <div className="hl-footer-col hl-footer-note">
            <h2>Catatan</h2>
            <p>Konten HealthyLife bersifat informasi umum, bukan pengganti saran tenaga medis.</p>
          </div>
        </div>
      </div>

      <div className="hl-footer-base">
        <Cloud warna="#5e0091" mulai={8} className="hl-footer-base-cloud" />
        <div className="hl-footer-base-body">
          <p className="container hl-footer-copy">© {new Date().getFullYear()} HealthyLife. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
