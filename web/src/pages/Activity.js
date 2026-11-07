import { useCallback, useEffect, useState } from 'react';
import client, { pesanError } from '../api/client';
import ActivityForm from '../components/ActivityForm';
import { PageHero } from '../components/Canvas';
import Dialog from '../components/Dialog';
import Icon from '../components/Icon';
import Mascot, { MataKartu } from '../components/Mascot';
import Sym from '../components/Svg';
import TargetForm from '../components/TargetForm';
import {
  formatTanggal,
  formatTanggalPendek,
  hariIni,
  labelAktivitas,
  namaHari,
  pesanProgres,
  tanggalLokal
} from '../utils/format';
import { scrollKe } from '../utils/smoothScroll';

// Ikon per jenis
const JENIS = {
  jalan: { simbol: 'cat-shoe', warna: '#fff1c7' },
  lari: { simbol: 'move', warna: '#ffe3d1' },
  bersepeda: { simbol: 'cat-shoe', warna: '#f1e6ff' },
  gym: { simbol: 'buddy', warna: '#ffe3d1' },
  yoga: { simbol: 'mind', warna: '#f1e6ff' },
  peregangan: { simbol: 'cat-leaf', warna: '#fff1c7' },
  lainnya: { simbol: 'bubbles', warna: '#f3eee9' }
};

const kemarin = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return tanggalLokal(d);
};

// Kelompok per tanggal
const kelompokkan = (items) => {
  const grup = [];
  items.forEach((a) => {
    const key = tanggalLokal(a.date);
    let g = grup.find((x) => x.key === key);
    if (!g) {
      g = { key, items: [], total: 0 };
      grup.push(g);
    }
    g.items.push(a);
    g.total += a.duration;
  });
  return grup;
};

const labelTanggal = (key) => {
  if (key === hariIni()) return 'Hari ini';
  if (key === kemarin()) return 'Kemarin';
  return formatTanggal(key);
};

function Activity() {
  const [summary, setSummary] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');
  const [hapusId, setHapusId] = useState(null);
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
    setHapusId(id);
    try {
      await client.delete(`/activities/${id}`);
      setPesan('Aktivitas dihapus.');
      await muatData();
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setHapusId(null);
    }
  };

  const keForm = () => {
    scrollKe('catat');
    setTimeout(() => document.getElementById('act-duration')?.focus({ preventScroll: true }), 400);
  };

  const today = summary?.today ?? 0;
  const target = summary?.target ?? 30;
  const percent = summary?.percent ?? 0;
  const week = summary?.week ?? [];
  const maks = Math.max(target, ...week.map((h) => h.minutes), 1);
  const totalMinggu = week.reduce((n, h) => n + h.minutes, 0);
  const hariTercapai = week.filter((h) => h.minutes >= target).length;
  const rataRata = week.length ? Math.round(totalMinggu / week.length) : 0;
  const grup = kelompokkan(riwayat);

  return (
    <>
      <PageHero
        className="akt-hero"
        title={
          <>
            Sedikit demi sedikit,
            <br />
            <span>tetap maju.</span>
          </>
        }
        description="Catat setiap gerak, sekecil apa pun. Langkah kecilmu terkumpul di sini."
        art={
          <div className="akt-today">
            <MataKartu className="akt-today-eyes" />
            <span className="hl-eyebrow">GERAKMU HARI INI · {formatTanggalPendek(new Date()).toUpperCase()}</span>
            <div className="akt-today-total">
              <strong>{loading ? '-' : today}</strong>
              <span>dari {target} menit</span>
            </div>
            <div
              className="akt-progress"
              role="progressbar"
              aria-label="Progres target harian"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <span style={{ width: `${percent}%` }} />
            </div>
            <div className="akt-today-foot">
              <p>{summary ? pesanProgres(summary) : 'Memuat progresmu...'}</p>
              <strong>{percent}%</strong>
            </div>
            <Mascot varian="kuning" className="akt-today-maskot" />
          </div>
        }
      >
        <div className="akt-hero-actions">
          <button type="button" className="hl-button" onClick={keForm}>
            Catat aktivitas
          </button>
          <button type="button" className="hl-link hl-link--ink" onClick={() => setDialogTarget(true)}>
            Atur targetmu <Sym id="arrow" />
          </button>
        </div>
      </PageHero>

      <section className="akt-week container" aria-labelledby="judul-minggu">
        <div className="akt-stats">
          <span className="hl-eyebrow">7 HARI TERAKHIR</span>
          <h2 id="judul-minggu">Lihat langkahmu terkumpul.</h2>
          <dl className="akt-stat-list">
            <div>
              <dt>Total minggu ini</dt>
              <dd>
                {loading ? '-' : totalMinggu}
                <small>menit</small>
              </dd>
            </div>
            <div>
              <dt>Target tercapai</dt>
              <dd>
                {loading ? '-' : hariTercapai}
                <small>/7 hari</small>
              </dd>
            </div>
            <div>
              <dt>Rata-rata</dt>
              <dd>
                {loading ? '-' : rataRata}
                <small>menit/hari</small>
              </dd>
            </div>
          </dl>
        </div>

        <div className="akt-chart">
          <div className="akt-chart-head">
            <h3>Menit bergerak per hari</h3>
            <p className="akt-legend">
              <span className="akt-dot akt-dot--done" /> Tercapai
              <span className="akt-dot" /> Belum
            </p>
          </div>
          {loading ? (
            <div className="akt-chart-skeleton" role="status" aria-label="Memuat grafik" />
          ) : (
            <>
              <div className="akt-plot">
                <div className="akt-target" style={{ bottom: `${(target / maks) * 100}%` }} aria-hidden="true">
                  <span>Target {target}</span>
                </div>
                <ol className="akt-bars">
                  {week.map((h, i) => {
                    const kelas = [
                      'akt-bar',
                      h.minutes >= target ? 'is-done' : '',
                      i === week.length - 1 ? 'is-today' : ''
                    ]
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <li key={h.date} className={kelas} aria-label={`${formatTanggal(h.date)}: ${h.minutes} menit`}>
                        <span className="akt-bar-fill" style={{ height: `${(h.minutes / maks) * 100}%` }}>
                          <b aria-hidden="true">{h.minutes}</b>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <ol className="akt-days" aria-hidden="true">
                {week.map((h, i) => (
                  <li key={h.date} className={i === week.length - 1 ? 'is-today' : undefined}>
                    {i === week.length - 1 ? 'Hari ini' : namaHari(h.date)}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </section>

      <section className="akt-log container" aria-label="Catat dan riwayat aktivitas">
        <div className="akt-form-card" id="catat">
          <Mascot varian="lavender" className="akt-form-maskot" />
          <span className="hl-eyebrow">CATAT GERAKMU</span>
          <h2>Apa yang kamu lakukan hari ini?</h2>
          <ActivityForm idPrefix="act" layout="stack" onSaved={handleSaved} />
          {pesan && (
            <p role="status" className="alert alert--success">
              {pesan}
            </p>
          )}
        </div>

        <div className="akt-history">
          <div className="akt-history-head">
            <div>
              <span className="hl-eyebrow">CATATANMU</span>
              <h2 id="judul-riwayat">Riwayat aktivitas</h2>
            </div>
            {riwayat.length > 0 && <p>{riwayat.length} catatan terbaru</p>}
          </div>

          {error && (
            <p role="alert" className="alert alert--error">
              {error}
            </p>
          )}

          {loading && (
            <p className="status" role="status">
              Memuat riwayat...
            </p>
          )}

          {!loading && riwayat.length === 0 && (
            <div className="hl-empty akt-empty">
              <Mascot varian="ungu" className="akt-empty-maskot" />
              <h3>Belum ada aktivitas.</h3>
              <p>Catat aktivitas pertamamu lewat form di samping. Riwayatnya muncul di sini.</p>
            </div>
          )}

          {!loading &&
            grup.map((g) => (
              <section key={g.key} className="akt-day" aria-label={labelTanggal(g.key)}>
                <h3>
                  <span>{labelTanggal(g.key)}</span>
                  <small>{g.total} menit</small>
                </h3>
                <ul className="akt-items">
                  {g.items.map((a) => {
                    const jenis = JENIS[a.type] || JENIS.lainnya;
                    return (
                      <li key={a._id} className="akt-item">
                        <span className="akt-item-icon" style={{ background: jenis.warna }}>
                          <Sym id={jenis.simbol} />
                        </span>
                        <div className="akt-item-main">
                          <strong>{labelAktivitas(a.type)}</strong>
                          {a.note && <span>{a.note}</span>}
                        </div>
                        <span className="akt-item-duration">{a.duration} mnt</span>
                        <button
                          type="button"
                          className="akt-item-delete"
                          onClick={() => handleHapus(a._id)}
                          disabled={hapusId === a._id}
                          aria-label={`Hapus ${labelAktivitas(a.type)} ${a.duration} menit, ${formatTanggal(a.date)}`}
                        >
                          <Icon name="close" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
        </div>
      </section>

      <Dialog
        open={dialogTarget}
        onClose={() => setDialogTarget(false)}
        labelledBy="dialog-target-akt"
        className="form-dialog"
      >
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
