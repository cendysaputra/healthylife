import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client, { pesanError } from '../../api/client';
import ContentCard from '../ContentCard';
import Sym from '../Svg';

function ArticleSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let batal = false;
    client
      .get('/contents', { params: { limit: 6 } })
      .then(({ data }) => !batal && setItems(data.items))
      .catch((err) => !batal && setError(pesanError(err)))
      .finally(() => !batal && setLoading(false));
    return () => {
      batal = true;
    };
  }, []);

  return (
    <section className="hl-articles container" id="artikel">
      <div className="hl-heading">
        <h2>Bekal baik untuk harimu</h2>
        <Link to="/konten" className="hl-button">
          Lihat Semua Inspirasi
        </Link>
      </div>

      {loading ? (
        <div className="hl-card-grid" role="status" aria-label="Memuat konten">
          <div className="hl-skeleton" />
          <div className="hl-skeleton" />
          <div className="hl-skeleton" />
        </div>
      ) : error ? (
        <p className="alert alert--error" role="alert">
          {error}
        </p>
      ) : items.length === 0 ? (
        <div className="hl-empty">
          <Sym id="cat-cloud" />
          <h3>Belum ada konten di sini.</h3>
          <p>Konten baru segera hadir.</p>
        </div>
      ) : (
        <div className="hl-card-grid">
          {items.map((item) => (
            <ContentCard key={item._id} content={item} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ArticleSection;
