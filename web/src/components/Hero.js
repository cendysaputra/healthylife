import fotoHero from '../assets/images/hero-peregangan.webp';
import Mascot from './Mascot';
import { scrollKe } from '../utils/smoothScroll';

function Hero() {
  const keArtikel = (e) => {
    e.preventDefault();
    scrollKe('artikel');
  };

  return (
    <section className="hl-hero container" id="beranda">
      <div className="hl-hero-copy">
        <h1>
          Hidup sehat,
          <br />
          mulai dari
          <br />
          <span>hal kecil.</span>
        </h1>
        <p>
          Nggak perlu mengubah semuanya sekaligus. Temukan inspirasi sederhana untuk tubuh yang lebih aktif dan pikiran yang lebih
          tenang.
        </p>
        <a href="#artikel" className="hl-button" onClick={keArtikel}>
          Temukan Inspirasimu
        </a>
      </div>
      <div className="hl-hero-art">
        <span className="hl-hero-ring" aria-hidden="true" />
        <img
          className="hl-hero-photo"
          src={fotoHero}
          alt="Perempuan muda berkacamata dengan kaus ungu sedang meregangkan lengan"
          width="1300"
          height="1210"
          fetchpriority="high"
        />
        <Mascot varian="ungu" className="hl-hero-smile hl-hero-smile--a" />
        <Mascot varian="lavender" className="hl-hero-smile hl-hero-smile--b" />
        <Mascot varian="kuning" className="hl-hero-smile hl-hero-smile--c" />
      </div>
    </section>
  );
}

export default Hero;
