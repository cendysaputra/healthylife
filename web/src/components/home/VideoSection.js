import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import { gayaKategori, urlGambar } from '../../utils/format';
import Cloud from '../Cloud';
import Sym from '../Svg';

function VideoSection() {
  const [items, setItems] = useState([]);
  const [gagal, setGagal] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get('/contents', { params: { category: 'video', limit: 2 } })
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

          <div className="hl-video-grid">
            {items.map((v) => {
              const foto = v.thumbnail && !gagal[v._id];
              return (
                <Link key={v._id} to={`/konten/${v.slug}`} className="hl-video">
                  {foto ? (
                    <img
                      src={urlGambar(v.thumbnail)}
                      alt=""
                      loading="lazy"
                      onError={() => setGagal((g) => ({ ...g, [v._id]: true }))}
                    />
                  ) : (
                    <span className="hl-video-fallback">
                      <Sym id={gayaKategori('video').simbol} />
                    </span>
                  )}
                  <span className="hl-video-copy">
                    <strong>{v.title}</strong>
                    {v.durationMinutes || v.readTime ? <span>{v.durationMinutes || v.readTime} Menit</span> : null}
                  </span>
                  <span className="hl-video-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoSection;
