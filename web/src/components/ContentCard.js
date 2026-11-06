import { Link } from 'react-router-dom';
import { formatTanggal, labelKategori, urlGambar } from '../utils/format';

// Card konten
function ContentCard({ content }) {
  return (
    <article className="card">
      <Link to={`/konten/${content.slug}`}>
        {content.thumbnail && (
          <img src={urlGambar(content.thumbnail)} alt="" loading="lazy" className="card__img" />
        )}
        <p>{labelKategori(content.category)}</p>
        <h3>{content.title}</h3>
      </Link>
      {content.summary && <p>{content.summary}</p>}
      <p>
        <small>
          {formatTanggal(content.publishedAt)}
          {content.readTime ? ` · ${content.readTime} menit baca` : ''}
          {content.durationMinutes ? ` · ${content.durationMinutes} menit` : ''}
        </small>
      </p>
    </article>
  );
}

export default ContentCard;
