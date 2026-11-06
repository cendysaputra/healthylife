import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <h1>Halaman tidak ditemukan</h1>
        <Link to="/">Kembali ke Beranda</Link>
      </div>
    </section>
  );
}

export default NotFound;
