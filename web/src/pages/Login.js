import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { pesanError } from '../api/client';
import AuthBenefits from '../components/AuthBenefits';
import { PageHero } from '../components/Canvas';
import Sym from '../components/Svg';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tujuan = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [proses, setProses] = useState(false);

  if (user) return <Navigate to={tujuan} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setProses(true);
    try {
      await login(form.email, form.password);
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
        eyebrow="SENANG BERTEMU LAGI"
        title={
          <>
            Masuk, lalu
            <br />
            <span>lanjutkan ritmemu.</span>
          </>
        }
        description="Catat aktivitas harian, pantau target, dan buka lagi konten favoritmu."
        art={
          <div className="auth-card">
            <Sym id="sun" className="auth-card-sun" />
            <h2>Masuk</h2>
            {location.state?.from && <p className="auth-note">Masuk dulu untuk melanjutkan.</p>}
            <form onSubmit={handleSubmit} className="form-stack">
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

              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <p role="alert" className="alert alert--error">
                  {error}
                </p>
              )}

              <button type="submit" className="button button-blue button-block" disabled={proses}>
                {proses ? 'Memproses...' : 'Masuk'} <Sym id="arrow" />
              </button>
            </form>

            <p className="auth-switch">
              Belum punya akun?{' '}
              <Link to="/register" state={location.state}>
                Daftar gratis
              </Link>
            </p>
          </div>
        }
      >
        <div className="about-values">
          <span>
            <Sym id="cat-leaf" />
            Mulai dari yang kecil
          </span>
          <span>
            <Sym id="heart" />
            Dengan ritmemu sendiri
          </span>
        </div>
      </PageHero>

      <AuthBenefits />
    </>
  );
}

export default Login;
