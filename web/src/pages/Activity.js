import { useCallback, useEffect, useState } from 'react';
import client, { pesanError } from '../api/client';
import ActivityForm from '../components/ActivityForm';
import { PageHero } from '../components/Canvas';
import Dialog from '../components/Dialog';
import Sym from '../components/Svg';
import TargetForm from '../components/TargetForm';
import { formatTanggal, formatTanggalPendek, labelAktivitas, namaHari, pesanProgres } from '../utils/format';
import { scrollKe } from '../utils/smoothScroll';

// Ilustrasi per jenis aktivitas
const SIMBOL = { jalan: 'cat-shoe', lari: 'move', bersepeda: 'cat-shoe', gym: 'buddy', yoga: 'mind', peregangan: 'cat-leaf', lainnya: 'bubbles' };

function Activity() {
  const [summary, setSummary] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');
  const [dialogTarget, setDialogTarget] = useState(false);

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

  const handleSaved = async () => {
    setError('');
    setPesan('Aktivitas tersimpan.');
    await muatData();
  };

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

  const keForm = () => {
    scrollKe('catat');
    setTimeout(() => document.getElementById('act-duration')?.focus({ preventScroll: true }), 400);
  };

  const today = summary?.today ?? 0;
  const target = summary?.target ?? 30;
  const week = summary?.week ?? [];
  const maks = Math.max(target, ...week.map((h) => h.minutes), 1);
  const totalMinggu = week.reduce((n, h) => n + h.minutes, 0);
  const hariTercapai = week.filter((h) => h.minutes >= target).length;

  return (
    <>
      <PageHero
        eyebrow="TARGET HARIANMU"
        title={
          <>
            Sedikit demi sedikit,
            <br />
            <span>tetap maju.</span>
          </>
        }
        description="Catat setiap gerak, sekecil apa pun. Langkah kecilmu terkumpul di sini."
        art={
          <div className="daily-card hero-daily">
            <div className="daily-top">
              <span>GERAKMU HARI INI</span>
              <span>{formatTanggalPendek(new Date()).toUpperCase()}</span>
            </div>
            <div className="daily-total">
              <strong>{loading ? '–' : today}</strong>
              <span>
                dari <b>{target}</b> menit
              </span>
              <Sym id="move" />
            </div>
            <progress value={Math.min(today, target)} max={target} aria-label="Progres target harian" />
            <div className="daily-foot">
              <p>{summary ? pesanProgres(summary) : 'Memuat progresmu...'}</p>
              {summary && <strong>{summary.percent}%</strong>}
            </div>
          </div>
        }
      >
        <div className="hero-actions">
          <button type="button" className="button button-blue" onClick={keForm}>
            + Catat aktivitas
          </button>
          <button type="button" className="text-link" onClick={() => setDialogTarget(true)}>
            Atur targetmu ↗
          </button>
        </div>
      </PageHero>

      {loading && (
        <section className="page container">
          <p className="status" role="status">Memuat...</p>
        </section>
      )}

      {!loading && (
        <>
          {summary && (
            <section className="activity-section container week-section" aria-labelledby="judul-minggu">
              <Sym id="bubbles" className="section-doodle doodle-d" />
              <div className="activity-copy">
                <span className="eyebrow">7 HARI TERAKHIR</span>
                <h2 id="judul-minggu">
                  Lihat langkahmu
                  <br />
                  terkumpul.
                </h2>
                <div className="week-stats">
                  <div>
                    <strong>{totalMinggu}</strong>
                    <span>menit minggu ini</span>
                  </div>
                  <div>
                    <strong>
                      {hariTercapai}
                      <small>/7</small>
                    </strong>
                    <span>hari target tercapai</span>
                  </div>
                </div>
              </div>
              <div className="week-card">
                <ol className="week-bars">
                  {week.map((h, i) => {
                    const tinggi = Math.round((h.minutes / maks) * 100);
                    const kelas = ['week-bar', h.minutes >= target ? 'is-done' : '', i === week.length - 1 ? 'is-today' : ''].join(' ');
                    return (
                      <li key={h.date} className={kelas} aria-label={`${formatTanggal(h.date)}: ${h.minutes} menit`}>
                        <b aria-hidden="true">{h.minutes}</b>
                        <span className="week-bar-track" aria-hidden="true">
                          <span className="week-bar-fill" style={{ height: `${tinggi}%` }} />
                        </span>
                        <small aria-hidden="true">{namaHari(h.date)}</small>
                      </li>
                    );
                  })}
                </ol>
                <p className="week-legend">
                  <span className="dot dot-done" /> Target tercapai
                  <span className="dot" /> Belum tercapai
                </p>
              </div>
            </section>
          )}

          <section className="container log-section" id="catat">
            <div className="start-panel start-motion log-panel">
              <Sym id="cat-shoe" className="start-vector" />
              <span className="eyebrow">CATAT GERAKMU</span>
              <h2>Apa yang kamu lakukan hari ini?</h2>
              <ActivityForm idPrefix="act" onSaved={handleSaved} />
              {error && <p role="alert" className="alert alert--error">{error}</p>}
              {pesan && <p role="status" className="alert alert--success">{pesan}</p>}
            </div>
          </section>

          <section className="articles-section container history-section" aria-labelledby="judul-riwayat">
            <Sym id="cat-leaf" className="section-doodle doodle-e" />
            <div className="section-heading">
              <div>
                <span className="eyebrow">CATATANMU</span>
                <h2 id="judul-riwayat">Riwayat aktivitas</h2>
              </div>
              <p>{riwayat.length > 0 ? `${riwayat.length} catatan terbaru` : 'Belum ada catatan'}</p>
            </div>
            {riwayat.length === 0 ? (
              <div className="articles-empty">
                <Sym id="cat-shoe" />
                <h3>Belum ada aktivitas.</h3>
                <p>Catat aktivitas pertamamu lewat form di atas. Riwayatnya muncul di sini.</p>
              </div>
            ) : (
              <ul className="history-list">
                {riwayat.map((a) => (
                  <li key={a._id} className="history-item">
                    <span className="history-icon">
                      <Sym id={SIMBOL[a.type] || 'bubbles'} />
                    </span>
                    <div className="history-main">
                      <strong>{labelAktivitas(a.type)}</strong>
                      <span>
                        {formatTanggal(a.date)}
                        {a.note ? ` · ${a.note}` : ''}
                      </span>
                    </div>
                    <span className="history-duration">{a.duration} menit</span>
                    <button type="button" className="link-danger" onClick={() => handleHapus(a._id)} aria-label={`Hapus ${labelAktivitas(a.type)} ${formatTanggal(a.date)}`}>
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <Dialog open={dialogTarget} onClose={() => setDialogTarget(false)} labelledBy="dialog-target-akt" className="form-dialog">
        <span className="eyebrow">TARGET YANG NYAMAN</span>
        <h2 id="dialog-target-akt">Berapa menit bergerak per hari?</h2>
        <TargetForm
          idPrefix="akt-target"
          onSaved={async () => {
            setDialogTarget(false);
            await muatData();
          }}
        />
      </Dialog>
    </>
  );
}

export default Activity;
