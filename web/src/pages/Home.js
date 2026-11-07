import { Link } from 'react-router-dom';
import ArticleSection from '../components/home/ArticleSection';
import DailySection from '../components/home/DailySection';
import HabitSection from '../components/home/HabitSection';
import VideoSection from '../components/home/VideoSection';
import Sym from '../components/Svg';
import CategoryCards from '../components/CategoryCards';
import { InCanvas } from '../components/Canvas';
import Hero from '../components/Hero';
import { useAuth } from '../context/AuthContext';
import { TEKS_BERJALAN } from '../data/home';

// Dirender dua kali supaya geserannya tidak putus
function Marquee() {
  const putaran = (salinan) => (
    <ul className="hl-marquee-track" aria-hidden={salinan || undefined}>
      {TEKS_BERJALAN.map((t, i) => (
        <li key={t} className={i % 2 === 0 ? 'is-loud' : undefined}>
          {i % 2 === 0 ? t.toUpperCase() : t}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="hl-marquee" aria-label="Fokus HealthyLife">
      {putaran(false)}
      {putaran(true)}
    </div>
  );
}

function Home() {
  const { user } = useAuth();

  return (
    <>
      <InCanvas>
        <Hero />
      </InCanvas>

      <Marquee />

      <div className="hl-lavender">
        <section className="hl-start container" aria-label="Mulai perjalanan sehat">
          <Link to={user ? '/aktivitas' : '/konten?kategori=olahraga'} className="hl-start-card hl-start-card--purple" id="olahraga">
            <h2>
              Yang penting mulai.
              <br />
              Bukan seberapa jauh.
            </h2>
            <p>Jalan santai, stretching, atau bersepeda. Setiap gerakan punya tempat di harimu.</p>
            <span className="hl-link">
              {user ? 'Catat Gerakmu' : 'Panduan Olahraga'} <Sym id="arrow" />
            </span>
          </Link>
          <Link to="/konten?kategori=nutrisi" className="hl-start-card hl-start-card--orange" id="nutrisi">
            <h2>
              Makan seimbang,
              <br />
              tetap menyenangkan.
            </h2>
            <p>Temukan ide sederhana untuk menikmati makanan dan mengenal isi piringmu.</p>
            <span className="hl-link hl-link--orange">
              Inspirasi Nutrisi <Sym id="arrow" />
            </span>
          </Link>
        </section>

        <section className="hl-categories container" id="kategori" aria-labelledby="judul-kategori">
          <h2 id="judul-kategori" className="hl-section-title">Sehat itu banyak bentuknya</h2>
          <CategoryCards semua={false} hrefFor={(v) => `/konten?kategori=${v}`} />
        </section>
      </div>

      <HabitSection />

      <div className="hl-warm">
        <DailySection />
        <ArticleSection />
      </div>

      <VideoSection />
    </>
  );
}

export default Home;
