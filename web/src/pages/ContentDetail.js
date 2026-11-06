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

  if (loading) return <p className="container">Memuat...</p>;
  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p role="alert">{error}</p>
          <Link to="/konten">Kembali ke daftar konten</Link>
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
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <Link to="/">Beranda</Link> / <Link to={`/konten?kategori=${content.category}`}>{labelKategori(content.category)}</Link>
          </nav>

          <p>{labelKategori(content.category)}</p>
          <h1>{content.title}</h1>
          <p>
            <small>
              Terbit {formatTanggal(content.publishedAt)}
              {content.readTime ? ` · ${content.readTime} menit baca` : ''}
              {content.durationMinutes ? ` · Durasi ${content.durationMinutes} menit` : ''}
              {content.level ? ` · Level ${content.level}` : ''}
            </small>
          </p>

          <FavoriteButton contentId={content._id} />

          {/* Video / gambar */}
          {embed ? (
            <div className="video">
              <iframe
                src={embed}
                title={content.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            content.thumbnail && <img src={urlGambar(content.thumbnail)} alt="" />
          )}

          {/* Isi konten */}
          <div className="prose">
            <ReactMarkdown>{content.body}</ReactMarkdown>
          </div>

          {/* Sumber acuan */}
          {content.sources?.length > 0 && (
            <div>
              <h2>Sumber acuan</h2>
              <ul>
                {content.sources.map((s, i) => (
                  <li key={i}>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                    ) : (
                      s.title
                    )}
                    {s.publisher ? `, ${s.publisher}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      {/* Konten terkait */}
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2>Konten terkait</h2>
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
