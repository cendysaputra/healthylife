import { Link } from 'react-router-dom';
import { KARTU_KATEGORI } from '../data/home';
import Sym from './Svg';

// Pil kategori
function CategoryCards({ active = null, onSelect, hrefFor, semua = true, label = 'Pilih kategori konten' }) {
  return (
    <div className="hl-cats" role="group" aria-label={label}>
      {KARTU_KATEGORI.filter((k) => semua || k.value).map((k) => {
        const aktif = active === k.value;
        const isi = (
          <>
            <span className={`hl-cat-icon ${k.warna}`}>
              <Sym id={k.simbol} />
            </span>
            <span className="hl-cat-label">
              {k.label}
              <small>{k.sub}</small>
            </span>
          </>
        );
        const kelas = ['hl-cat', !k.value && 'hl-cat--semua', aktif && 'is-active'].filter(Boolean).join(' ');
        return hrefFor ? (
          <Link
            key={k.value || 'semua'}
            to={hrefFor(k.value)}
            className={kelas}
            aria-current={aktif ? 'page' : undefined}
          >
            {isi}
          </Link>
        ) : (
          <button
            key={k.value || 'semua'}
            type="button"
            className={kelas}
            aria-pressed={aktif}
            onClick={() => onSelect(k.value)}
          >
            {isi}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryCards;
