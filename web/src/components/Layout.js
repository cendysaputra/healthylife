import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { CanvasSlotContext } from './Canvas';
import { SvgLibrary } from './Svg';
import ScrollTop from './ScrollTop';
import { mulaiSmoothScroll, scrollKe } from '../utils/smoothScroll';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollKe(0, { segera: true });
      return undefined;
    }
    // Tunggu konten tampil
    const timer = setTimeout(() => scrollKe(hash.slice(1)), 80);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

function Layout() {
  // Tiap halaman mengisi slot ini lewat <InCanvas>
  const [slot, setSlot] = useState(null);

  useEffect(() => mulaiSmoothScroll(), []);

  return (
    <CanvasSlotContext.Provider value={slot}>
      <SvgLibrary />
      <ScrollManager />
      <a href="#main" className="skip-link">
        Lewati ke konten
      </a>
      <div className="hero-canvas">
        <Header />
        <div ref={setSlot} className="canvas-slot" />
      </div>
      <main id="main" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollTop />
    </CanvasSlotContext.Provider>
  );
}

export default Layout;
