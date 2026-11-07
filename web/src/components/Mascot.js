import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { MASKOT } from '../data/maskot';

const acak = (min, max) => min + Math.random() * (max - min);
const kurangGerak = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Animasi menoleh & kedip
export function useHidup(
  wajahRef,
  mataRef,
  { geser = 0.1, naik = 0.07, ukuran = 100, menoleh: bisaMenoleh = true } = {}
) {
  useEffect(() => {
    const wajah = wajahRef.current;
    const mata = mataRef.current ? Array.from(mataRef.current.querySelectorAll('[data-mata]')) : [];
    if (!wajah || kurangGerak()) return undefined;

    const ctx = gsap.context(() => {
      const maksX = ukuran * geser;
      const maksY = ukuran * naik;

      const menoleh = () => {
        // Kadang ke tengah
        const x = Math.random() < 0.25 ? 0 : acak(-maksX, maksX);
        const y = Math.random() < 0.25 ? 0 : acak(-maksY, maksY);
        gsap.to(wajah, {
          x,
          y,
          rotation: (x / maksX) * 4,
          transformOrigin: '50% 50%',
          duration: acak(0.7, 1.1),
          ease: 'power2.inOut',
          onComplete: () => gsap.delayedCall(acak(1.2, 3.2), menoleh)
        });
      };

      const kedip = () => {
        gsap.to(mata, {
          scaleY: 0.1,
          transformOrigin: '50% 50%',
          duration: 0.07,
          ease: 'power1.in',
          yoyo: true,
          repeat: Math.random() < 0.25 ? 3 : 1,
          onComplete: () => gsap.delayedCall(acak(2.2, 5), kedip)
        });
      };

      if (bisaMenoleh) {
        gsap.delayedCall(acak(0.4, 1.6), menoleh);
      }
      gsap.delayedCall(acak(1, 3), kedip);
    });

    return () => {
      ctx.revert();
    };
  }, [wajahRef, mataRef, geser, naik, ukuran, bisaMenoleh]);
}

// Mata kartu ungu
export function MataKartu({ className = 'hl-daily-eyes' }) {
  const wajahRef = useRef(null);
  const mataRef = useRef(null);
  useHidup(wajahRef, mataRef, { ukuran: 40, menoleh: false });
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g ref={wajahRef} fill="#fff">
        <g ref={mataRef}>
          <ellipse data-mata="" cx="13" cy="15" rx="6" ry="8.5" transform="rotate(28 13 15)" />
          <ellipse data-mata="" cx="29" cy="25" rx="6" ry="8.5" transform="rotate(28 29 25)" />
        </g>
      </g>
    </svg>
  );
}

function Mascot({ varian = 'putih', className = '' }) {
  const m = MASKOT[varian];
  const id = useId().replace(/:/g, '');
  const wajahRef = useRef(null);
  const mataRef = useRef(null);
  useHidup(wajahRef, mataRef, { ukuran: m.s });

  const r = m.s / 2;
  return (
    <svg className={`mascot ${className}`.trim()} viewBox={`0 0 ${m.s} ${m.s}`} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`m-${id}`}>
          <circle cx={r} cy={r} r={r} />
        </clipPath>
      </defs>
      <circle cx={r} cy={r} r={r} fill={m.bg} />
      <g clipPath={`url(#m-${id})`}>
        <g ref={wajahRef} fill={m.ink}>
          <g ref={mataRef}>
            {m.eyes.map((d) => (
              <path key={d} d={d} data-mata="" />
            ))}
          </g>
          <path d={m.smile} />
        </g>
      </g>
    </svg>
  );
}

export default Mascot;
