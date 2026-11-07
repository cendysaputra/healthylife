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
      </div>

      <div className="hl-footer-base">
        <Cloud warna="#5e0091" mulai={8} className="hl-footer-base-cloud" />
        <div className="hl-footer-base-body">
          <p className="container hl-footer-copy">© {new Date().getFullYear()} HealthyLife. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
