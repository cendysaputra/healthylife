import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client, { pesanError } from '../api/client';
import ContentCard from '../components/ContentCard';
import { KATEGORI } from '../utils/format';

function Home() {
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

  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container">
          <p>Your Daily Healthy Habit</p>
          <h1>Hidup sehat dimulai dari kebiasaan kecil hari ini</h1>
          <p>Temukan artikel, video edukasi, panduan olahraga, dan informasi nutrisi untuk menemani rutinitas sehatmu.</p>
          <p>
            <Link to="/konten">Jelajahi Konten</Link> <Link to="/aktivitas">Catat Aktivitas</Link>
          </p>
        </div>
      </section>

      {/* Kategori */}
      <section className="section">
        <div className="container">
          <h2>Kategori</h2>
          <ul>
            {KATEGORI.map((k) => (
              <li key={k.value}>
                <Link to={`/konten?kategori=${k.value}`}>{k.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {loading && <p className="container">Memuat konten...</p>}
      {error && <p className="container" role="alert">{error}</p>}

      {!loading && !error && (
        <>
          {/* Konten terbaru */}
          <BlokKonten judul="Konten terbaru" items={data.terbaru} link="/konten" />

          {/* Video edukasi */}
          <BlokKonten judul="Video edukasi" items={data.video} link="/konten?kategori=video" />

          {/* Panduan olahraga */}
          <BlokKonten judul="Panduan olahraga" items={data.olahraga} link="/konten?kategori=olahraga" />

          {/* Tips nutrisi */}
          <BlokKonten judul="Tips nutrisi" items={data.nutrisi} link="/konten?kategori=nutrisi" />
        </>
      )}
    </>
  );
}

// Satu blok konten
function BlokKonten({ judul, items, link }) {
  return (
    <section className="section">
      <div className="container">
        <h2>{judul}</h2>
        <p><Link to={link}>Lihat semua</Link></p>
        {items.length === 0 ? (
          <p>Belum ada konten.</p>
        ) : (
          <div className="grid">
            {items.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
