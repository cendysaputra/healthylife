import { Link } from 'react-router-dom';
import { KATEGORI } from '../utils/format';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Info brand */}
          <div className="footer__brand">
            <Link to="/" className="logo">HealthyLife</Link>
            <p className="footer__tagline">Your Daily Healthy Habit</p>
            <p className="footer__disclaimer">
              Konten di HealthyLife bersifat edukasi dan bukan pengganti saran tenaga medis.
            </p>
          </div>

          {/* Link kategori */}
          <nav aria-labelledby="footer-kategori">
            <p id="footer-kategori" className="label footer__title">Kategori</p>
            <ul className="footer__list">
              {KATEGORI.map((k) => (
                <li key={k.value}>
                  <Link to={`/konten?kategori=${k.value}`}>{k.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Link akun */}
          <nav aria-labelledby="footer-akun">
            <p id="footer-akun" className="label footer__title">Akun</p>
            <ul className="footer__list">
              <li><Link to="/aktivitas">Aktivitas</Link></li>
              <li><Link to="/profil">Profil</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} HealthyLife</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
