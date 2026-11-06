import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import client, { pesanError } from '../api/client';
import ContentCard from '../components/ContentCard';
import Icon from '../components/Icon';
import { KATEGORI, labelKategori } from '../utils/format';

function ContentList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const kategori = searchParams.get('kategori') || '';
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [keyword, setKeyword] = useState(q);
  const [hasil, setHasil] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sinkron kolom cari
  useEffect(() => {
    setKeyword(q);
  }, [q]);

  // Ambil daftar
  useEffect(() => {
    setLoading(true);
    setError('');
    client
      .get('/contents', { params: { category: kategori || undefined, q: q || undefined, page, limit: 9 } })
      .then(({ data }) => setHasil(data))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, [kategori, q, page]);

  // Ubah filter
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
  };

  const judul = kategori ? labelKategori(kategori) : 'Semua Konten';

  return (
    <section className="section">
      <div className="container">
        <header className="page-head">
          <h1>{judul}</h1>
        </header>

        <div className="toolbar">
          {/* Tab kategori */}
          <div role="tablist" aria-label="Kategori" className="tabs">
            <button type="button" role="tab" className="tab" aria-selected={!kategori} onClick={() => ubahParam({ kategori: '', page: '' })}>
              Semua
            </button>
            {KATEGORI.map((k) => (
              <button
                key={k.value}
                type="button"
                role="tab"
                className="tab"
                aria-selected={kategori === k.value}
                onClick={() => ubahParam({ kategori: k.value, page: '' })}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Pencarian */}
          <form onSubmit={handleCari} className="search" role="search">
            <div className="search__field">
              <label htmlFor="cari">Cari konten</label>
              <div className="search__input">
                <Icon name="search" />
                <input
                  id="cari"
                  type="search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Contoh: sarapan sehat"
                />
              </div>
            </div>
            <button type="submit" className="btn btn--secondary">Cari</button>
          </form>
        </div>

        {q && <p className="result-info">Hasil pencarian "{q}": {hasil.total} konten</p>}

        {loading && <p className="status" role="status">Memuat...</p>}
        {error && <p className="alert alert--error" role="alert">{error}</p>}

        {!loading && !error && hasil.items.length === 0 && (
          <div className="empty">
            <p className="empty__title">Konten tidak ditemukan.</p>
            {(q || kategori) && (
              <>
                <p className="empty__text">Coba kata kunci lain atau pilih kategori Semua.</p>
                <Link to="/konten" className="link-plain">Lihat semua konten</Link>
              </>
            )}
          </div>
        )}

        {/* Daftar konten */}
        <h2 className="visually-hidden">Daftar konten</h2>
        {!loading && !error && (
          <div className="grid">
            {hasil.items.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        )}

        {/* Halaman */}
        {hasil.totalPages > 1 && (
          <nav aria-label="Halaman" className="pagination">
            {Array.from({ length: hasil.totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === page ? 'page' : undefined}
                onClick={() => ubahParam({ page: n === 1 ? '' : String(n) })}
              >
                {n}
              </button>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}

export default ContentList;
