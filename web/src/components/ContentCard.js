import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { formatTanggalKartu, gayaKategori, labelKategori, urlGambar } from '../utils/format';
import { BookmarkIcon } from './Icon';
import Sym from './Svg';

// Urutan sampul: thumbnail API, foto kategori, lalu ilustrasi
export function Sampul({ content }) {
  const gaya = gayaKategori(content.category);
  const [gagal, setGagal] = useState(false);
  const src = content.thumbnail && !gagal ? urlGambar(content.thumbnail) : gaya.foto;
  if (src) return <img src={src} alt="" loading="lazy" width="900" height="630" onError={() => setGagal(true)} />;
  return (
    <span className="vector-cover">
      <Sym id={gaya.simbol} />
    </span>
  );
}

function Bookmark({ content }) {
  const { user } = useAuth();
  const { isSaved, toggle } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [proses, setProses] = useState(false);
  const tersimpan = isSaved(content._id);

  const handleClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search + location.hash } });
      return;
    }
    setProses(true);
    try {
      await toggle(content);
    } catch (err) {
      window.alert(err.message);
    } finally {
      setProses(false);
    }
  };

  return (
    <button
      type="button"
      className="hl-bookmark"
      aria-pressed={tersimpan}
      aria-label={tersimpan ? `Hapus "${content.title}" dari favorit` : `Simpan "${content.title}" ke favorit`}
      onClick={handleClick}
      disabled={proses}
    >
      <BookmarkIcon />
    </button>
  );
}

function ContentCard({ content, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const gaya = gayaKategori(content.category);
  const isVideo = content.category === 'video';
  const href = `/konten/${content.slug}`;

  const meta = [
    content.publishedAt ? formatTanggalKartu(content.publishedAt) : null,
    content.readTime ? `${content.readTime} MENIT BACA` : null,
    content.durationMinutes ? `${content.durationMinutes} MENIT` : null
  ].filter(Boolean);

  return (
    <article className="hl-card">
      <div className="hl-card-media">
        <Link to={href} className="hl-card-image" tabIndex="-1" aria-hidden="true">
          <Sampul content={content} />
          {isVideo && <span className="hl-card-play">▶</span>}
        </Link>
        <Bookmark content={content} />
        <span className="hl-tag" style={{ background: gaya.tag, color: gaya.tagTeks }}>
          {labelKategori(content.category).toUpperCase()}
        </span>
      </div>
      <Heading className="hl-card-title">
        <Link to={href}>{content.title}</Link>
      </Heading>
      {content.summary && <p className="hl-card-summary">{content.summary}</p>}
      <div className="hl-card-foot">
        <span>{meta.join(' · ')}</span>
        <Link to={href} className="hl-card-arrow" aria-label={`${isVideo ? 'Tonton' : 'Baca'}: ${content.title}`}>
          <Sym id="arrow" />
        </Link>
      </div>
    </article>
  );
}

export default ContentCard;
