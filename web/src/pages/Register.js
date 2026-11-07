import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { pesanError } from '../api/client';
import AuthBenefits from '../components/AuthBenefits';
import { PageHero } from '../components/Canvas';
import Sym from '../components/Svg';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tujuan = location.state?.from || '/';

  const [form, setForm] = useState({ name: '', email: '', password: '', konfirmasi: '' });
  const [error, setError] = useState('');
  const [proses, setProses] = useState(false);

  if (user) return <Navigate to={tujuan} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (form.password !== form.konfirmasi) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setProses(true);
    try {
      await register(form.name, form.email, form.password);
      navigate(tujuan, { replace: true });
    } catch (err) {
      setError(pesanError(err));
      setProses(false);
    }
  };

  return (
    <>
      <PageHero
        className="page-hero--auth"
        eyebrow="MULAI DARI HAL KECIL"
        title={
          <>
            Satu akun,
            <br />
            <span>banyak langkah baik.</span>
          </>
        }
        description="Buat akun gratis untuk mencatat aktivitas, memantau target, dan menyimpan konten favorit."
        art={
          <div className="auth-card">
            <Sym id="buddy" className="auth-card-sun" />
            <h2>Daftar gratis</h2>
            <form onSubmit={handleSubmit} className="form-stack">
              <div className="field">
                <label htmlFor="name">Nama</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength="8"
                    required
                    value={form.password}
                    onChange={handleChange}
                    aria-describedby="password-hint"
                  />
                </div>
                <div className="field">
                  <label htmlFor="konfirmasi">Konfirmasi</label>
                  <input
                    id="konfirmasi"
                    name="konfirmasi"
                    type="password"
                    autoComplete="new-password"
                    minLength="8"
                    required
                    value={form.konfirmasi}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <small id="password-hint" className="field-hint">
                Password minimal 8 karakter.
              </small>

              {error && (
                <p role="alert" className="alert alert--error">
                  {error}
                </p>
              )}

              <button type="submit" className="button button-blue button-block" disabled={proses}>
                {proses ? 'Memproses...' : 'Daftar'} <Sym id="arrow" />
              </button>
            </form>

            <p className="auth-switch">
              Sudah punya akun?{' '}
              <Link to="/login" state={location.state}>
                Masuk
              </Link>
            </p>
          </div>
        }
      >
        <div className="about-values">
          <span>
            <Sym id="cat-leaf" />
            Gratis dipakai
          </span>
          <span>
            <Sym id="heart" />
            Tanpa target yang menekan
          </span>
        </div>
      </PageHero>

      <AuthBenefits />
    </>
  );
}

export default Register;
