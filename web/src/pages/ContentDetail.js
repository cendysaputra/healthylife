import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import client, { pesanError } from '../api/client';
import { HeroArt, PageHero } from '../components/Canvas';
import ContentCard from '../components/ContentCard';
import CtaBox from '../components/CtaBox';
import FavoriteButton from '../components/FavoriteButton';
import Sym from '../components/Svg';
import { formatTanggal, gayaKategori, labelKategori, urlEmbedYoutube, urlGambar } from '../utils/format';

const WARNA_BLOB = { artikel: '#f8e4ec', video: '#e9e2f5', olahraga: '#dfe8f6', nutrisi: '#fbe3d6' };

function useFotoHero(content) {
  const [gagal, setGagal] = useState(false);
  useEffect(() => setGagal(false), [content?._id]);
  if (!content) return [null, () => {}];
  const gaya = gayaKategori(content.category);
  const src = content.thumbnail && !gagal ? urlGambar(content.thumbnail) : gaya.foto;
  return [src, () => setGagal(true)];
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
      <>
        <PageHero
          eyebrow="MEMUAT"
          title={<span className="hero-skeleton">Sebentar, ya…</span>}
          art={<HeroArt simbol="cat-leaf" />}
        />
        <section className="page container">
          <p className="status" role="status">
            Memuat konten...
          </p>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHero
          eyebrow="OOPS"
          title={
            <>
              Konten belum
              <br />
              <span>bisa dibuka.</span>
            </>
          }
          description={error}
          art={<HeroArt simbol="cat-cloud" warna="#f8e4ec" />}
        >
          <div className="hero-actions">
            <Link to="/konten" className="button button-blue">
              Kembali ke daftar konten <Sym id="arrow" />
            </Link>
          </div>
        </PageHero>
        <div className="page" />
      </>
    );
  }

  const { content, related } = data;
  const embed = urlEmbedYoutube(content.videoUrl);
  const gaya = gayaKategori(content.category);
  const label = labelKategori(content.category);

  const info = [
    { k: 'Terbit', v: formatTanggal(content.publishedAt) },
    content.readTime ? { k: 'Waktu baca', v: `${content.readTime} menit` } : null,
    content.durationMinutes ? { k: 'Durasi', v: `${content.durationMinutes} menit` } : null,
    content.level ? { k: 'Level', v: content.level.charAt(0).toUpperCase() + content.level.slice(1) } : null
  ].filter(Boolean);

  return (
    <>
      <PageHero
        className="page-hero--detail"
        top={
          <div className="detail-hero-top">
            <nav aria-label="Breadcrumb" className="breadcrumb">
              <Link to="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/konten?kategori=${content.category}`}>{label}</Link>
            </nav>
            <div className="article-meta">
              <span className="article-tag" style={{ background: gaya.tag, color: gaya.tagTeks }}>
                {label.toUpperCase()}
              </span>
              {content.readTime ? <span>{content.readTime} menit baca</span> : null}
              {content.durationMinutes ? <span>{content.durationMinutes} menit</span> : null}
            </div>
          </div>
        }
        title={content.title}
        description={content.summary}
        art={
          foto ? (
            <div className="hero-blob-wrap">
              <div className="hero-arch" style={{ background: WARNA_BLOB[content.category] }}>
                <img src={foto} alt="" onError={onFotoError} />
              </div>
              <Sym id={gaya.simbol} className="hero-blob-badge" />
              <Sym id="sun" className="hero-blob-sun" />
            </div>
          ) : (
            <HeroArt simbol={gaya.simbol} warna={WARNA_BLOB[content.category]} />
          )
        }
      >
        <div className="hero-actions">
          <FavoriteButton content={content} />
        </div>
      </PageHero>

      <article className="page container">
        <Sym id="bubbles" className="section-doodle doodle-a" />
        <div className="detail-layout">
          <div className="detail-main">
            {embed && (
              <div className="detail-media video">
                <iframe
                  src={embed}
                  title={content.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <div className="prose">
              <ReactMarkdown>{content.body}</ReactMarkdown>
            </div>

            <p className="dialog-note">
              Konten HealthyLife bersifat informasi umum, bukan diagnosis atau perawatan medis. Konsultasikan kebutuhan
              kesehatan pribadimu dengan tenaga kesehatan.
            </p>
          </div>

          <aside className="detail-aside" aria-label="Info konten">
            <div className="info-card">
              <span className="eyebrow">TENTANG BACAAN INI</span>
              <dl className="info-list">
                {info.map((i) => (
                  <div key={i.k}>
                    <dt>{i.k}</dt>
                    <dd>{i.v}</dd>
                  </div>
                ))}
              </dl>
              {content.tags?.length > 0 && (
                <div className="tag-list">
                  {content.tags.map((t) => (
                    <Link key={t} to={`/konten?q=${encodeURIComponent(t)}`} className="tag-chip">
                      #{t}
                    </Link>
                  ))}
                </div>
              )}
              <FavoriteButton content={content} />
              <Sym id={gaya.simbol} className="info-card-art" />
            </div>

            {content.sources?.length > 0 && (
              <div className="sources" aria-labelledby="sumber-acuan">
                <h2 id="sumber-acuan">SUMBER ACUAN</h2>
                <ul>
                  {content.sources.map((s, i) => (
                    <li key={i}>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noreferrer">
                          {s.title}
                        </a>
                      ) : (
                        s.title
                      )}
                      {s.publisher ? `, ${s.publisher}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="articles-section container related" aria-labelledby="terkait">
          <Sym id="cat-leaf" className="section-doodle doodle-e" />
          <div className="section-heading">
            <div>
              <span className="eyebrow">MASIH SATU TOPIK</span>
              <h2 id="terkait">Lanjut baca ini, yuk.</h2>
            </div>
            <Link to={`/konten?kategori=${content.category}`} className="text-link all-articles">
              Lihat semua {label.toLowerCase()} <Sym id="arrow" />
            </Link>
          </div>
          <div className="article-grid">
            {related.map((item) => (
              <ContentCard key={item._id} content={item} />
            ))}
          </div>
        </section>
      )}

      <CtaBox />
    </>
  );
}

export default ContentDetail;
