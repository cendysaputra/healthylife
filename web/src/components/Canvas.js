import { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import Sym from './Svg';

// Slot hero
export const CanvasSlotContext = createContext(null);

// Portal ke slot hero
export function InCanvas({ children }) {
  const slot = useContext(CanvasSlotContext);
  return slot ? createPortal(children, slot) : null;
}

// Hero halaman
export function PageHero({ eyebrow, top, title, description, children, art, className = '' }) {
  return (
    <InCanvas>
      <section className={`page-hero container ${className}`.trim()}>
        <div className="page-hero-copy">
          {top}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {description && <p className="page-hero-description">{description}</p>}
          {children}
        </div>
        {art && <div className="page-hero-art">{art}</div>}
      </section>
    </InCanvas>
  );
}

export function HeroArt({ simbol, warna = '#efe5d6', foto, fotoAlt = '' }) {
  return (
    <div className="hero-blob-wrap">
      <div className="hero-blob" style={{ background: warna }}>
        {foto ? <img src={foto} alt={fotoAlt} /> : <Sym id={simbol} className="hero-blob-symbol" />}
      </div>
      {foto && <Sym id={simbol} className="hero-blob-badge" />}
      <Sym id="sun" className="hero-blob-sun" />
      <Sym id="bubbles" className="hero-blob-bubbles" />
    </div>
  );
}
