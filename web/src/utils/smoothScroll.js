import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Mati saat reduced motion
let lenis = null;

export function mulaiSmoothScroll() {
  if (lenis || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    // Scroll bawaan
    prevent: (node) => Boolean(node.closest?.('dialog, .dropdown-panel, [data-lenis-prevent]'))
  });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

// Fallback tanpa Lenis
export function scrollKe(target, { offset = -24, segera = false } = {}) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (lenis) {
    lenis.scrollTo(el ?? target, { offset: typeof target === 'number' ? 0 : offset, immediate: segera });
    return;
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: segera ? 'auto' : 'smooth' });
  else el?.scrollIntoView({ behavior: segera ? 'auto' : 'smooth' });
}

export const hentikanScroll = () => lenis?.stop();
export const lanjutkanScroll = () => lenis?.start();
