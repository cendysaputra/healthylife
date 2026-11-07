// [diameter, tinggi] px
const POLA = [
  [300, 86],
  [256, 128],
  [172, 64],
  [196, 56],
  [110, 50],
  [176, 42],
  [164, 46],
  [236, 84],
  [300, 100]
];
const ULANG = 6;

function Cloud({ warna, mulai = 0, className = '' }) {
  const geser = mulai % POLA.length;
  const pola = [...POLA.slice(geser), ...POLA.slice(0, geser)];
  const deret = Array.from({ length: ULANG }, () => pola).flat();
  return (
    <div className={`cloud ${className}`.trim()} style={{ '--warna': warna }} aria-hidden="true">
      <div className="cloud-row">
        {deret.map(([d, l], i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={i} style={{ '--d': `${d}px`, '--l': `${l}px` }} />
        ))}
      </div>
    </div>
  );
}

export default Cloud;
