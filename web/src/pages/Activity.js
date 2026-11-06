import { useCallback, useEffect, useState } from 'react';
import client, { pesanError } from '../api/client';
import { JENIS_AKTIVITAS, formatTanggal, hariIni, labelAktivitas } from '../utils/format';

const FORM_AWAL = { type: 'jalan', duration: '', date: hariIni(), note: '' };

function Activity() {
  const [summary, setSummary] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [form, setForm] = useState(FORM_AWAL);
  const [loading, setLoading] = useState(true);
  const [simpan, setSimpan] = useState(false);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');

  // Ambil data
  const muatData = useCallback(async () => {
    try {
      const [s, r] = await Promise.all([client.get('/activities/summary'), client.get('/activities')]);
      setSummary(s.data);
      setRiwayat(r.data.items);
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Simpan aktivitas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPesan('');
    setSimpan(true);
    try {
      await client.post('/activities', { ...form, duration: Number(form.duration) });
      setForm({ ...FORM_AWAL, date: hariIni() });
      setPesan('Aktivitas tersimpan.');
      await muatData();
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setSimpan(false);
    }
  };

  // Hapus aktivitas
  const handleHapus = async (id) => {
    setError('');
    setPesan('');
    try {
      await client.delete(`/activities/${id}`);
      setPesan('Aktivitas dihapus.');
      await muatData();
    } catch (err) {
      setError(pesanError(err));
    }
  };

  // Pesan progres
  const pesanProgres = () => {
    if (!summary) return '';
    if (summary.today === 0) return 'Yuk mulai bergerak, 10 menit jalan santai sudah dihitung.';
    if (summary.remaining === 0) return 'Target hari ini tercapai. Pertahankan besok!';
    return `Sedikit lagi! Tinggal ${summary.remaining} menit untuk capai targetmu.`;
  };

  if (loading) return <p className="container">Memuat...</p>;

  return (
    <>
      <section className="section">
        <div className="container">
          <h1>Aktivitas</h1>

          {/* Progres hari ini */}
          {summary && (
            <div>
              <h2>Hari ini</h2>
              <p>
                <strong>{summary.today}</strong> dari {summary.target} menit ({summary.percent}%)
              </p>
              <progress value={summary.today} max={summary.target} aria-label="Progres target harian" />
              <p>{pesanProgres()}</p>

              {/* Tujuh hari */}
              <h3>7 hari terakhir</h3>
              <ul>
                {summary.week.map((h) => (
                  <li key={h.date}>
                    {formatTanggal(h.date)}: {h.minutes} menit
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Form catat */}
          <form onSubmit={handleSubmit}>
            <h2>Catat aktivitas</h2>

            <label htmlFor="type">Jenis</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
              {JENIS_AKTIVITAS.map((j) => (
                <option key={j.value} value={j.value}>{j.label}</option>
              ))}
            </select>

            <label htmlFor="duration">Durasi (menit)</label>
            <input id="duration" name="duration" type="number" min="1" max="600" required value={form.duration} onChange={handleChange} />

            <label htmlFor="date">Tanggal</label>
            <input id="date" name="date" type="date" max={hariIni()} required value={form.date} onChange={handleChange} />

            <label htmlFor="note">Catatan</label>
            <input id="note" name="note" type="text" maxLength="200" placeholder="Opsional" value={form.note} onChange={handleChange} />

            <button type="submit" disabled={simpan}>{simpan ? 'Menyimpan...' : 'Simpan Aktivitas'}</button>
          </form>

          {error && <p role="alert">{error}</p>}
          {pesan && <p role="status">{pesan}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Riwayat */}
          <h2>Riwayat aktivitas</h2>
          {riwayat.length === 0 ? (
            <p>Belum ada aktivitas. Catat aktivitas pertamamu di atas.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis</th>
                    <th>Durasi</th>
                    <th>Catatan</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((a) => (
                    <tr key={a._id}>
                      <td>{formatTanggal(a.date)}</td>
                      <td>{labelAktivitas(a.type)}</td>
                      <td>{a.duration} menit</td>
                      <td>{a.note || '-'}</td>
                      <td>
                        <button type="button" onClick={() => handleHapus(a._id)}>Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Activity;
