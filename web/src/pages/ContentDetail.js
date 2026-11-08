import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import client, { pesanError } from '../api/client';
import { InCanvas } from '../components/Canvas';
import ContentCard from '../components/ContentCard';
import FavoriteButton from '../components/FavoriteButton';
import Mascot from '../components/Mascot';
import Sym from '../components/Svg';
import {
  formatTanggal,
  formatTanggalKartu,
  gayaKategori,
  labelKategori,
  urlEmbedYoutube,
  urlGambar
} from '../utils/format';

// Foto hero
function useFotoHero(content) {
  const [gagal, setGagal] = useState(false);
  useEffect(() => setGagal(false), [content?._id]);
  if (!content) return [null, () => {}];
  const gaya = gayaKategori(content.category);
  const src = content.thumbnail && !gagal ? urlGambar(content.thumbnail) : gaya.foto;
  return [src, () => setGagal(true)];
}

// Gambar markdown lazy
function MarkdownImg({ node, alt = '', ...props }) {
  return <img alt={alt} loading="lazy" decoding="async" {...props} />;
}

function HeroSederhana({ judul, children }) {
  return (
    <InCanvas>
      <section className="single-hero single-hero--status container">
        <div className="single-hero-copy">
          <h1>{judul}</h1>
          {children}
        </div>
        <Mascot varian="lavender" className="single-status-maskot" />
      </section>
    </InCanvas>
  );
}

function ContentDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [foto, onFotoError] = useFotoHero(data?.content);

  useEffect(() => {
    setLoading(true);
    setError('');
    client
      .get(`/contents/${slug}`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <HeroSederhana judul="Sebentar, ya...">
        <p className="single-summary" role="status">
          Memuat konten...
        </p>
      </HeroSederhana>
    );
  }

  if (error) {
    return (
      <HeroSederhana
        judul={
          <>
            Konten belum
            <br />
            <span>bisa dibuka.</span>
          </>
        }
      >
        <p className="single-summary">{error}</p>
        <Link to="/konten" className="hl-button">
          Kembali ke daftar konten <Sym id="arrow" />
        </Link>
      </HeroSederhana>
    );
  }

  const { content, related } = data;
  const embed = urlEmbedYoutube(content.videoUrl);
  const gaya = gayaKategori(content.category);
  const label = labelKategori(content.category);

  const meta = [
    content.publishedAt ? formatTanggalKartu(content.publishedAt) : null,
    content.readTime
      ? `${content.readTime} MENIT BACA`
      : content.durationMinutes
        ? `${content.durationMinutes} MENIT`
        : null
  ].filter(Boolean);

  const info = [
    content.publishedAt ? { k: 'Terbit', v: formatTanggal(content.publishedAt) } : null,
    content.readTime ? { k: 'Waktu baca', v: `${content.readTime} menit` } : null,
    content.durationMinutes ? { k: 'Durasi', v: `${content.durationMinutes} menit` } : null,
    content.level ? { k: 'Level', v: content.level.charAt(0).toUpperCase() + content.level.slice(1) } : null
  ].filter(Boolean);

  return (
    <>
      <InCanvas>
        <section className="single-hero container">
          <div className="single-hero-copy">
            <div>
              <h1>{content.title}</h1>
              {content.summary && <p className="single-summary">{content.summary}</p>}
            </div>
            <div className="single-hero-foot">
              <div className="single-hero-meta">
                <FavoriteButton content={content} ikon />
                <Link
                  to={`/konten?kategori=${content.category}`}
                  className="single-tag"
                  style={{ background: gaya.tag, color: gaya.tagTeks }}
                >
                  {label.toUpperCase()}
                </Link>
                {meta.map((m) => (
                  <span key={m} className="single-meta">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`single-hero-media${embed ? ' is-video' : ''}`}>
            {embed ? (
              <iframe
                src={embed}
                title={content.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : foto ? (
              <img src={foto} alt="" fetchpriority="high" onError={onFotoError} />
            ) : (
              <span className="single-hero-vector">
                <Sym id={gaya.simbol} />
              </span>
            )}
            <Mascot varian="kuning" className="single-hero-maskot" />
          </div>
        </section>
      </InCanvas>

      <article className="single-body container">
        <div className="single-main">
          <div className="single-prose">
            <ReactMarkdown components={{ img: MarkdownImg }}>{content.body}</ReactMarkdown>
          </div>

          <p className="single-note">
            Konten HealthyLife bersifat informasi umum, bukan diagnosis atau perawatan medis. Konsultasikan kebutuhan
            kesehatan pribadimu dengan tenaga kesehatan.
          </p>
        </div>

        <aside className="single-aside" aria-label="Info konten">
          <div className="single-card single-card--info">
            {info.length > 0 && (
              <dl className="single-info">
                {info.map((i) => (
                  <div key={i.k}>
                    <dt>{i.k}</dt>
                    <dd>{i.v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {content.tags?.length > 0 && (
              <div className="single-tags">
                {content.tags.map((t) => (
                  <Link key={t} to={`/konten?q=${encodeURIComponent(t)}`}>
                    #{t}
                  </Link>
                ))}
              </div>
            )}
            <FavoriteButton content={content} />
          </div>

          {content.sources?.length > 0 && (
            <div className="single-card">
              <h2 id="sumber-acuan">Sumber acuan</h2>
              <ul className="single-sources" aria-labelledby="sumber-acuan">
                {content.sources.map((s, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      s.title
                    )}
                    {s.publisher ? <span>{s.publisher}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </article>

      {related.length > 0 && (
        <section className="single-related container" aria-labelledby="terkait">
          <div className="hl-heading">
            <h2 id="terkait">Lanjut baca ini, yuk.</h2>
            <Link to={`/konten?kategori=${content.category}`} className="hl-button hl-button--sm">
              Lihat semua {label.toLowerCase()}
            </Link>
          </div>
          <div className="hl-card-grid">
            {related.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default ContentDetail;
