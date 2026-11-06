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
        <h1>Daftar</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nama</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" minLength="8" required value={form.password} onChange={handleChange} />

          <label htmlFor="konfirmasi">Konfirmasi password</label>
          <input id="konfirmasi" name="konfirmasi" type="password" minLength="8" required value={form.konfirmasi} onChange={handleChange} />

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={proses}>{proses ? 'Memproses...' : 'Daftar'}</button>
        </form>

        <p>
          Sudah punya akun? <Link to="/login" state={location.state}>Masuk</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
