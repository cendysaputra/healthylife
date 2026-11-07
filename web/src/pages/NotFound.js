import { Link } from 'react-router-dom';
import { HeroArt, PageHero } from '../components/Canvas';
import CategoryCards from '../components/CategoryCards';
import Sym from '../components/Svg';

function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="HALAMAN TIDAK DITEMUKAN"
        title={
          <>
            Ups, jalannya
            <br />
            <span>buntu di sini.</span>
          </>
        }
        description="Alamat ini tidak ada atau sudah dipindahkan. Nggak apa-apa, masih banyak jalan lain."
        art={<HeroArt simbol="cat-cloud" warna="#f8e4ec" />}
      >
        <div className="hero-actions">
          <Link to="/" className="button button-blue">
            Kembali ke beranda <Sym id="arrow" />
          </Link>
          <Link to="/konten" className="text-link">
            Lihat semua konten
          </Link>
        </div>
      </PageHero>

      <section className="category-section container" style={{ paddingBottom: 80 }}>
        <Sym id="buddy" className="section-doodle doodle-b" />
        <div className="section-heading compact">
          <div>
            <span className="eyebrow">ATAU MULAI DARI SINI</span>
            <h2>Sehat itu banyak bentuknya.</h2>
          </div>
          <p>Pilih ruang yang ingin kamu rawat hari ini.</p>
        </div>
        <CategoryCards hrefFor={(v) => (v ? `/konten?kategori=${v}` : '/konten')} />
      </section>
    </>
  );
}

export default NotFound;
