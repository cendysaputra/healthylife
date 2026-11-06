import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="notfound">
          <h1>Halaman tidak ditemukan</h1>
          <p>Alamat ini tidak ada atau sudah dipindahkan.</p>
          <div className="notfound__links">
            <Link to="/" className="link-plain">Kembali ke Beranda</Link>
            <Link to="/konten" className="link-plain">Lihat semua konten</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
