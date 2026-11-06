import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { pesanError } from '../api/client';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const tujuan = location.state?.from || '/';

  const [form, setForm] = useState({ name: '', email: '', password: '', konfirmasi: '' });
  const [error, setError] = useState('');
  const [proses, setProses] = useState(false);

  // Sudah login
  if (user) return <Navigate to={tujuan} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Cek password
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
    <section className="section">
      <div className="container">
        <div className="auth">
          <div className="auth__intro">
            <h1>Daftar</h1>
            <p>Buat akun untuk mencatat aktivitas harian, memantau target, dan menyimpan konten favorit.</p>
          </div>

          <div className="auth__form">
            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <label htmlFor="name">Nama</label>
                <input id="name" name="name" type="text" autoComplete="name" required value={form.name} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={handleChange} />
              </div>

              <div className="field">
                <label htmlFor="konfirmasi">Konfirmasi password</label>
                <input id="konfirmasi" name="konfirmasi" type="password" autoComplete="new-password" minLength="8" required value={form.konfirmasi} onChange={handleChange} />
              </div>

              {error && <p role="alert" className="alert alert--error">{error}</p>}

              <button type="submit" className="btn btn--primary btn--block" disabled={proses}>{proses ? 'Memproses...' : 'Daftar'}</button>
            </form>

            <p className="auth__switch">
              Sudah punya akun? <Link to="/login" state={location.state}>Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
