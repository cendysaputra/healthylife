import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { pesanError } from '../api/client';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tujuan = location.state?.from || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [proses, setProses] = useState(false);

  // Sudah login
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
    <section className="section">
      <div className="container">
        <div className="auth">
          <div className="auth__intro">
            <h1>Masuk</h1>
            <p>Masuk untuk mencatat aktivitas harian dan menyimpan konten favorit.</p>
            {location.state?.from && <p className="auth__note">Masuk dulu untuk melanjutkan.</p>}
          </div>

          <div className="auth__form">
            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" required value={form.password} onChange={handleChange} />
              </div>

              {error && <p role="alert" className="alert alert--error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--block" disabled={proses}>{proses ? 'Memproses...' : 'Masuk'}</button>
            </form>

            <p className="auth__switch">
              Belum punya akun? <Link to="/register" state={location.state}>Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
