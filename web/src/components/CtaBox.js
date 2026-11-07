import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sym from './Svg';

// Kotak ajakan di akhir halaman selain beranda
function CtaBox({
  eyebrow = 'BUAT DIRIMU YANG HARI INI',
  judul = ['Besok dimulai dari', 'satu hal baik hari ini.'],
  teks = 'Kecil langkahnya. Besar artinya untukmu.',
  to = '/aktivitas',
  label = 'Catat aktivitas hari ini'
}) {
  const { user } = useAuth();
  // Tamu diarahkan ke daftar
  const tujuan = user ? to : '/register';
  const teksTombol = user ? label : 'Yuk, mulai dari sini';

  return (
    <section className="cta-section container">
      <Sym id="bubbles" className="section-doodle doodle-i" />
      <div className="cta-box">
        <Sym id="sun" className="cta-sun" />
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>
            {judul[0]}
            <br />
            {judul[1]}
          </h2>
          <p>{teks}</p>
          <Link to={tujuan} className="button button-blue">
            {teksTombol} <Sym id="arrow" />
          </Link>
        </div>
        <Sym id="heart" className="cta-heart" />
      </div>
    </section>
  );
}

export default CtaBox;
