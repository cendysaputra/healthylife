import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import client, { pesanError } from '../api/client';
import ContentCard from '../components/ContentCard';
import FavoriteButton from '../components/FavoriteButton';
import { formatTanggal, labelKategori, urlEmbedYoutube, urlGambar } from '../utils/format';

function ContentDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Ambil detail
  useEffect(() => {
    setLoading(true);
    setError('');
    client
      .get(`/contents/${slug}`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="status" role="status">Memuat...</p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="alert alert--error" role="alert">{error}</p>
          <p>
            <Link to="/konten" className="link-plain">Kembali ke daftar konten</Link>
          </p>
        </div>
      </section>
    );
  }

  const { content, related } = data;
  const embed = urlEmbedYoutube(content.videoUrl);

  return (
    <>
      <article className="section">
        <div className="container">
          <header className="article__head">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="breadcrumb">
              <Link to="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <Link to={`/konten?kategori=${content.category}`}>{labelKategori(content.category)}</Link>
            </nav>

            <h1 className="article__title">{content.title}</h1>

            <div className="article__bar">
              <p className="article__meta">
                <small>
                  Terbit {formatTanggal(content.publishedAt)}
                  {content.readTime ? ` · ${content.readTime} menit baca` : ''}
                  {content.durationMinutes ? ` · Durasi ${content.durationMinutes} menit` : ''}
                  {content.level ? ` · Level ${content.level}` : ''}
                </small>
              </p>

              <FavoriteButton contentId={content._id} />
            </div>
          </header>

          {/* Video / gambar */}
          {embed ? (
            <div className="article__media video">
              <iframe
                src={embed}
                title={content.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            content.thumbnail && (
              <div className="article__media">
                <img src={urlGambar(content.thumbnail)} alt="" className="article__img" fetchpriority="high" />
              </div>
            )
          )}

          {/* Isi konten */}
          <div className="prose article__body">
            <ReactMarkdown>{content.body}</ReactMarkdown>
          </div>

          {/* Sumber acuan */}
          {content.sources?.length > 0 && (
            <aside className="sources" aria-labelledby="sumber-acuan">
              <h2 id="sumber-acuan" className="sources__title">Sumber acuan</h2>
              <ul className="sources__list">
                {content.sources.map((s, i) => (
                  <li key={i}>
                    <span>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                      ) : (
                        s.title
                      )}
                      {s.publisher ? `, ${s.publisher}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>

      {/* Konten terkait */}
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Konten terkait</h2>
            </div>
            <div className="grid">
              {related.map((item) => (
                <ContentCard key={item._id} content={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ContentDetail;
