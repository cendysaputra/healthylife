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
        <h1>Masuk</h1>
        {location.state?.from && <p>Masuk dulu untuk melanjutkan.</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required value={form.password} onChange={handleChange} />

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={proses}>{proses ? 'Memproses...' : 'Masuk'}</button>
        </form>

        <p>
          Belum punya akun? <Link to="/register" state={location.state}>Daftar sekarang</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
