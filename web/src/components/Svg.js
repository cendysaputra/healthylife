import { SYMBOLS } from '../assets/illustrations';

// Dirender sekali di Layout
export function SvgLibrary() {
  return (
    <svg
      className="svg-library"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: `<defs>${SYMBOLS}</defs>` }}
    />
  );
}

// Pakai satu simbol: <Sym id="sun" className="hero-sun" />
function Sym({ id, className, label }) {
  return (
    <svg className={className} aria-hidden={label ? undefined : 'true'} role={label ? 'img' : undefined} aria-label={label}>
      <use href={`#${id}`} />
    </svg>
  );
}

export default Sym;
