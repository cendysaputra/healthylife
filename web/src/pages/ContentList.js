import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import client, { pesanError } from '../api/client';
import ContentCard from '../components/ContentCard';
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
        <h1>{judul}</h1>

        {/* Tab kategori */}
        <div role="tablist" aria-label="Kategori">
          <button type="button" role="tab" aria-selected={!kategori} onClick={() => ubahParam({ kategori: '', page: '' })}>
            Semua
          </button>
          {KATEGORI.map((k) => (
            <button
              key={k.value}
              type="button"
              role="tab"
              aria-selected={kategori === k.value}
              onClick={() => ubahParam({ kategori: k.value, page: '' })}
            >
              {k.label}
            </button>
          ))}
        </div>

        {/* Pencarian */}
        <form onSubmit={handleCari}>
          <label htmlFor="cari">Cari konten</label>
          <input
            id="cari"
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Contoh: sarapan sehat"
          />
          <button type="submit">Cari</button>
        </form>

        {q && <p>Hasil pencarian "{q}": {hasil.total} konten</p>}

        {loading && <p>Memuat...</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && hasil.items.length === 0 && <p>Konten tidak ditemukan.</p>}

        {/* Daftar konten */}
        {!loading && !error && (
          <div className="grid">
            {hasil.items.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        )}

        {/* Halaman */}
        {hasil.totalPages > 1 && (
          <nav aria-label="Halaman">
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
