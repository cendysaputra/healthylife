import { useState } from 'react';
import client, { pesanError } from '../api/client';
import { useAuth } from '../context/AuthContext';

// Dipakai di Aktivitas, Profil, dan dialog beranda
function TargetForm({ onSaved, idPrefix = 'target' }) {
  const { user, setUser } = useAuth();
  const [target, setTarget] = useState(user?.dailyTarget ?? 30);
  const [simpan, setSimpan] = useState(false);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPesan('');
    setSimpan(true);
    try {
      const { data } = await client.put('/users/target', { dailyTarget: Number(target) });
      setUser({ ...user, dailyTarget: data.dailyTarget });
      setPesan('Target harian diperbarui.');
      await onSaved?.(data.dailyTarget);
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setSimpan(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="target-form">
        <div className="field">
          <label htmlFor={`${idPrefix}-input`}>Target harian (menit)</label>
          <input
            id={`${idPrefix}-input`}
            type="number"
            inputMode="numeric"
            min="5"
            max="300"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <small>Antara 5 sampai 300 menit. Pilih yang terasa nyaman.</small>
        </div>
        <button type="submit" className="button button-dark" disabled={simpan}>
          {simpan ? 'Menyimpan...' : 'Simpan target'}
        </button>
      </form>
      {error && <p role="alert" className="alert alert--error">{error}</p>}
      {pesan && <p role="status" className="alert alert--success">{pesan}</p>}
    </>
  );
}

export default TargetForm;
