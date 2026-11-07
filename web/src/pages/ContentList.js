import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client, { pesanError } from '../api/client';
import { PageHero } from '../components/Canvas';
import ContentCard from '../components/ContentCard';
import Icon from '../components/Icon';
import Mascot from '../components/Mascot';
import Select from '../components/Select';
import Sym from '../components/Svg';
import { scrollKe } from '../utils/smoothScroll';
import { KATEGORI } from '../utils/format';

const PILIHAN = [{ value: '', label: 'Semua' }, ...KATEGORI];

const INTRO = {
  '': {
    judul: ['Semua bekal baik,', 'di satu tempat.']
  },
  artikel: {
    judul: ['Bacaan ringan,', 'untuk hari ini.']
  },
  video: {
    judul: ['Tonton sebentar,', 'lalu praktikkan.']
  },
  olahraga: {
    judul: ['Gerak kecil,', 'tetap berarti.']
  },
  nutrisi: {
    judul: ['Isi piringmu,', 'isi energimu.']
  }
};

function ContentList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const kategori = searchParams.get('kategori') || '';
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [keyword, setKeyword] = useState(q);
  const [hasil, setHasil] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sinkron ?q
  useEffect(() => {
    setKeyword(q);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    setError('');
    client
      .get('/contents', { params: { category: kategori || undefined, q: q || undefined, page, limit: 9 } })
      .then(({ data }) => setHasil(data))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, [kategori, q, page]);

  const ubahParam = (perubahan) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(perubahan).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handleCari = (e) => {
    e.preventDefault();
    ubahParam({ q: keyword.trim(), page: '' });
    scrollKe('hasil');
  };

  const gantiHalaman = (n) => {
    ubahParam({ page: n === 1 ? '' : String(n) });
    scrollKe('hasil');
  };

  const intro = INTRO[kategori] || INTRO[''];

  return (
    <>
      <PageHero
        className="page-hero--plain"
        title={
          <>
            {intro.judul[0]}
            <br />
            <span>{intro.judul[1]}</span>
          </>
        }
      />

      <section className="container list-toolbar" aria-label="Saring konten">
        <Mascot varian="lavender" className="list-mascot list-mascot--atas" />
        <div className="list-tabs" role="group" aria-label="Kategori konten">
          {PILIHAN.map((k) => (
            <button
              key={k.value || 'semua'}
              type="button"
              className="list-tab"
              aria-pressed={kategori === k.value}
              onClick={() => ubahParam({ kategori: k.value, page: '' })}
            >
              {k.label}
            </button>
          ))}
        </div>
        {/* Dropdown tablet */}
        <div className="list-select">
          <span id="pilih-kategori-label" className="visually-hidden">
            Kategori konten
          </span>
          <Select
            id="pilih-kategori"
            labelId="pilih-kategori-label"
            value={kategori}
            options={PILIHAN}
            onChange={(v) => ubahParam({ kategori: v, page: '' })}
            icon={<Icon name="kategori" />}
          />
        </div>
        <form onSubmit={handleCari} className="search list-search" role="search">
          <label htmlFor="cari" className="visually-hidden">
            Cari konten
          </label>
          <div className="search-input">
            <Icon name="search" />
            <input
              id="cari"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Contoh: sarapan sehat"
            />
          </div>
          <button type="submit" className="button button-blue">
            Cari
          </button>
        </form>
      </section>

      <section className="articles-section container list-results" id="hasil">
        <Mascot varian="kuning" className="list-mascot list-mascot--bawah" />
        {q && (
          <div className="section-heading">
            <h2>Hasil untuk "{q}"</h2>
            <button type="button" className="text-link all-articles" onClick={() => ubahParam({ q: '', page: '' })}>
              Hapus pencarian <Sym id="arrow" />
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-grid" role="status" aria-label="Memuat konten">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
        )}
        {error && (
          <p className="alert alert--error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="article-grid">
            {hasil.items.length === 0 ? (
              <div className="articles-empty">
                <h3>Konten tidak ditemukan.</h3>
                {q || kategori ? (
                  <>
                    <p>Coba kata kunci lain atau pilih kategori Semua.</p>
                    <Link to="/konten" className="text-link">
                      Lihat semua konten <Sym id="arrow" />
                    </Link>
                  </>
                ) : (
                  <p>Konten baru akan segera hadir.</p>
                )}
              </div>
            ) : (
              hasil.items.map((item) => <ContentCard key={item._id} content={item} />)
            )}
          </div>
        )}

        {hasil.totalPages > 1 && (
          <nav aria-label="Halaman" className="pagination">
            {Array.from({ length: hasil.totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === page ? 'page' : undefined}
                aria-label={`Halaman ${n}`}
                onClick={() => gantiHalaman(n)}
              >
                {n}
              </button>
            ))}
          </nav>
        )}
      </section>
    </>
  );
}

export default ContentList;
