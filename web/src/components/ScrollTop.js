import { useEffect, useState } from 'react';
import { scrollKe } from '../utils/smoothScroll';
import Sym from './Svg';

function ScrollTop() {
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const cek = () => setTampil(window.scrollY > 600);
    cek();
    window.addEventListener('scroll', cek, { passive: true });
    return () => window.removeEventListener('scroll', cek);
  }, []);

  return (
    <button
      type="button"
      className={`hl-scrolltop ${tampil ? 'is-visible' : ''}`.trim()}
      onClick={() => scrollKe(0)}
      aria-label="Kembali ke atas"
      tabIndex={tampil ? 0 : -1}
    >
      <Sym id="arrow" />
    </button>
  );
}

export default ScrollTop;
