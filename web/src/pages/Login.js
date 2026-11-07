import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { pesanError } from '../api/client';
import { InCanvas } from '../components/Canvas';
import Mascot from '../components/Mascot';
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
      <InCanvas>
        <section className="masuk container">
          <div className="masuk-copy">
            <h1>
              Masuk, lalu
              <br />
              <span>lanjutkan ritmemu.</span>
            </h1>
            <p>Catat aktivitas harian, pantau target, dan buka lagi konten favoritmu.</p>
            <div className="masuk-maskot" aria-hidden="true">
              <Mascot varian="lavender" className="masuk-maskot-a" />
              <Mascot varian="ungu" className="masuk-maskot-b" />
              <Mascot varian="kuning" className="masuk-maskot-c" />
            </div>
          </div>

          <div className="masuk-card">
            <Mascot varian="krem" className="masuk-card-maskot" />
            <h2>Masuk</h2>
            {location.state?.from && <p className="masuk-note">Masuk dulu untuk melanjutkan.</p>}
            <form onSubmit={handleSubmit} className="masuk-form">
              <div className="masuk-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="masuk-field">
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

              <button type="submit" className="hl-button masuk-submit" disabled={proses}>
                {proses ? 'Memproses...' : 'Masuk'} <Sym id="arrow" />
              </button>
            </form>

            <p className="masuk-switch">
              Belum punya akun?{' '}
              <Link to="/register" state={location.state}>
                Daftar gratis
              </Link>
            </p>
          </div>
        </section>
      </InCanvas>
    </>
  );
}

export default Login;
