import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client, { pesanError } from '../api/client';
import ContentCard from '../components/ContentCard';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { KATEGORI, urlGambar } from '../utils/format';

function Home() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState({ terbaru: [], video: [], olahraga: [], nutrisi: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ambil beranda
  useEffect(() => {
    const ambil = (params) => client.get('/contents', { params }).then((r) => r.data.items);

    Promise.all([
      ambil({ limit: 6 }),
      ambil({ category: 'video', limit: 3 }),
      ambil({ category: 'olahraga', limit: 3 }),
      ambil({ category: 'nutrisi', limit: 3 })
    ])
      .then(([terbaru, video, olahraga, nutrisi]) => setData({ terbaru, video, olahraga, nutrisi }))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, []);

  // Gambar hero
  const gambarHero = data.terbaru.find((item) => item.thumbnail);

  return (
    <>
      {/* Hero */}
      <section className="section hero">
        <div className="hero__media">
          {gambarHero && (
            <img src={urlGambar(gambarHero.thumbnail)} alt="" className="hero__img" fetchpriority="high" />
          )}
        </div>
        <div className="container hero__inner">
          <h1 className="hero__title">Hidup sehat dimulai dari kebiasaan kecil hari ini</h1>
          <div>
            <p className="hero__lead">Temukan artikel, video edukasi, panduan olahraga, dan informasi nutrisi untuk menemani rutinitas sehatmu.</p>
            <div className="hero__actions">
              <Link to="/konten" className="link-arrow link-arrow--inverse">
                Jelajahi Konten <Icon name="arrow-right" />
              </Link>
              <Link to="/aktivitas" className="link-plain hero__link">Catat Aktivitas</Link>
            </div>
          </div>

          {/* Tagline dan foto */}
          <div className="hero__foot">
            <p>Your Daily Healthy Habit</p>
            {gambarHero && (
              <p>
                Foto: <Link to={`/konten/${gambarHero.slug}`}>{gambarHero.title}</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="section">
        <div className="container topics">
          <h2 className="topics__title">Kategori</h2>
          <ul className="topics__list">
            {KATEGORI.map((k) => (
              <li key={k.value}>
                <Link to={`/konten?kategori=${k.value}`} className="topics__link">{k.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {loading && (
        <section className="section">
          <div className="container">
            <p className="status" role="status">Memuat konten...</p>
          </div>
        </section>
      )}
      {error && (
        <section className="section">
          <div className="container">
            <p className="alert alert--error" role="alert">{error}</p>
          </div>
        </section>
      )}

      {!loading && !error && (
        <>
          {/* Konten terbaru */}
          <BlokKonten judul="Konten terbaru" items={data.terbaru} link="/konten" teksLink="Lihat semua konten" tata="utama" />

          {/* Video edukasi */}
          <BlokKonten judul="Video edukasi" items={data.video} link="/konten?kategori=video" teksLink="Lihat semua video" tata="gelap" />

          {/* Panduan olahraga */}
          <BlokKonten judul="Panduan olahraga" items={data.olahraga} link="/konten?kategori=olahraga" teksLink="Lihat semua panduan olahraga" />

          {/* Tips nutrisi */}
          <BlokKonten judul="Tips nutrisi" items={data.nutrisi} link="/konten?kategori=nutrisi" teksLink="Lihat semua tips nutrisi" tata="ringkas" />
        </>
      )}

      {/* Banner daftar */}
      {!authLoading && !user && (
        <section className="section">
          <div className="container">
            <div className="cta-banner">
              <h2 className="cta-banner__title">Siap mulai kebiasaan sehatmu?</h2>
              <Link to="/register" className="btn btn--ink">Daftar</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// Isi per tata letak
function IsiBlok({ items, tata }) {
  if (tata === 'utama') {
    const [utama, ...lainnya] = items;
    return (
      <div className="latest">
        <ContentCard content={utama} variant="featured" />
        {lainnya.length > 0 && (
          <div className="latest__list">
            {lainnya.map((item) => (
              <ContentCard key={item._id} content={item} variant="compact" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (tata === 'ringkas') {
    return (
      <div className="grid grid--compact">
        {items.map((item) => (
          <ContentCard key={item._id} content={item} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid">
      {items.map((item) => (
        <ContentCard key={item._id} content={item} />
      ))}
    </div>
  );
}

// Satu blok konten
function BlokKonten({ judul, items, link, teksLink, tata }) {
  return (
    <section className={`section ${tata === 'gelap' ? 'band' : ''}`}>
      <div className="container">
        <div className="section-head">
          <h2>{judul}</h2>
          <Link to={link} className="link-plain">{teksLink}</Link>
        </div>
        {items.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Belum ada konten.</p>
          </div>
        ) : (
          <IsiBlok items={items} tata={tata} />
        )}
      </div>
    </section>
  );
}

export default Home;
