import { Link } from 'react-router-dom';
import { formatTanggal, labelKategori, urlGambar } from '../utils/format';
import Icon from './Icon';

// Card konten
function ContentCard({ content, variant = 'default' }) {
  const kelas = variant === 'default' ? 'card' : `card card--${variant}`;

  return (
    <article className={kelas}>
      {/* Gambar 4:3 */}
      <div className="card__media">
        {content.thumbnail && (
          <img src={urlGambar(content.thumbnail)} alt="" loading="lazy" className="card__img" />
        )}
        {content.category === 'video' && (
          <span className="card__play" aria-hidden="true">
            <Icon name="play" />
          </span>
        )}
      </div>

      <p className="card__category">{labelKategori(content.category)}</p>
      <h3 className="card__title">
        <Link to={`/konten/${content.slug}`} className="card__link">{content.title}</Link>
      </h3>
      {content.summary && <p className="card__summary">{content.summary}</p>}
      <p className="card__meta">
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
