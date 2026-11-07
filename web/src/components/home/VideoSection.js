import { useEffect, useState } from 'react';
import client from '../../api/client';
import Cloud from '../Cloud';
import ContentCard from '../ContentCard';

function VideoSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/contents', { params: { category: 'video', limit: 3 } })
      .then(({ data }) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="hl-videos" id="video">
      <Cloud warna="#ffeee6" mulai={3} className="hl-videos-cloud" />
      <div className="hl-videos-body">
        <div className="container">
          <div className="hl-heading hl-heading--split">
            <h2>Tonton lalu coba</h2>
            <p>Belajar dari video edukasi yang bisa kamu praktikkan.</p>
          </div>

          {loading ? (
            <div className="hl-card-grid" role="status" aria-label="Memuat video">
              <div className="hl-skeleton" />
              <div className="hl-skeleton" />
              <div className="hl-skeleton" />
            </div>
          ) : (
            <div className="hl-card-grid">
              {items.map((item) => (
                <ContentCard key={item._id} content={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
