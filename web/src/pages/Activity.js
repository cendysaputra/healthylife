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

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="status" role="status">Memuat...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section">
        <div className="container">
          <header className="page-head">
            <h1>Aktivitas</h1>
          </header>

          {/* Progres hari ini */}
          {summary && (
            <div className="today">
              <div>
                <h2 className="today__title">Hari ini</h2>
                <p className="stat">
                  <strong className="stat__value">{summary.today}</strong>
                  <span className="stat__unit">dari {summary.target} menit</span>
                </p>
                <progress value={summary.today} max={summary.target} aria-label="Progres target harian" />
                <div className="today__foot">
                  <p className="today__message">{pesanProgres()}</p>
                  <p className="today__percent">{summary.percent}% dari target</p>
                </div>
              </div>

              {/* Tujuh hari */}
              <div>
                <h3 className="week__title">7 hari terakhir</h3>
                <ul className="week-list">
                  {summary.week.map((h) => (
                    <li key={h.date} className="week-list__item">
                      <span className="week-list__date">{formatTanggal(h.date)}</span>
                      <span className="week-list__minutes">{h.minutes} menit</span>
                      <progress value={h.minutes} max={summary.target} aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Form catat */}
          <div className="form-block">
            <form onSubmit={handleSubmit} className="form">
              <h2 className="form__title">Catat aktivitas</h2>

              <div className="form__grid">
                <div className="field">
                  <label htmlFor="type">Jenis</label>
                  <select id="type" name="type" value={form.type} onChange={handleChange}>
                    {JENIS_AKTIVITAS.map((j) => (
                      <option key={j.value} value={j.value}>{j.label}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="duration">Durasi (menit)</label>
                  <input id="duration" name="duration" type="number" min="1" max="600" required value={form.duration} onChange={handleChange} />
                </div>

                <div className="field">
                  <label htmlFor="date">Tanggal</label>
                  <input id="date" name="date" type="date" max={hariIni()} required value={form.date} onChange={handleChange} />
                </div>

                <div className="field">
                  <label htmlFor="note">Catatan</label>
                  <input id="note" name="note" type="text" maxLength="200" placeholder="Opsional" value={form.note} onChange={handleChange} />
                </div>
              </div>

              <div className="form__actions">
                <button type="submit" className="btn btn--primary" disabled={simpan}>{simpan ? 'Menyimpan...' : 'Simpan Aktivitas'}</button>
              </div>
            </form>

            {error && <p role="alert" className="alert alert--error">{error}</p>}
            {pesan && <p role="status" className="alert alert--success">{pesan}</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Riwayat */}
          <div className="section-head">
            <h2>Riwayat aktivitas</h2>
          </div>
          {riwayat.length === 0 ? (
            <div className="empty">
              <p className="empty__title">Belum ada aktivitas.</p>
              <p className="empty__text">Catat aktivitas pertamamu lewat form di atas. Riwayatnya muncul di sini.</p>
            </div>
          ) : (
            <div className="table-wrap" tabIndex="0" role="region" aria-label="Riwayat aktivitas">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis</th>
                    <th>Durasi</th>
                    <th>Catatan</th>
                    <th className="table-action">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {riwayat.map((a) => (
                    <tr key={a._id}>
                      <td className="table-num">{formatTanggal(a.date)}</td>
                      <td>{labelAktivitas(a.type)}</td>
                      <td className="table-num">{a.duration} menit</td>
                      <td>{a.note || '-'}</td>
                      <td className="table-action">
                        <button type="button" className="btn-text btn-text--danger" onClick={() => handleHapus(a._id)}>Hapus</button>
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
