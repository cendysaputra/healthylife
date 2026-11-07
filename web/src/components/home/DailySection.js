import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { pesanError } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { formatTanggalPendek, hariIni, labelAktivitas, pesanProgres, tanggalLokal } from '../../utils/format';
import ActivityForm from '../ActivityForm';
import Dialog from '../Dialog';
import TargetForm from '../TargetForm';
import { useHidup } from '../Mascot';

// Sepasang mata di pojok kartu ungu
function MataKartu() {
  const wajahRef = useRef(null);
  const mataRef = useRef(null);
  useHidup(wajahRef, mataRef, { ukuran: 40, menoleh: false });
  return (
    <svg className="hl-daily-eyes" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g ref={wajahRef} fill="#fff">
        <g ref={mataRef}>
          <ellipse data-mata="" cx="13" cy="15" rx="6" ry="8.5" transform="rotate(28 13 15)" />
          <ellipse data-mata="" cx="29" cy="25" rx="6" ry="8.5" transform="rotate(28 29 25)" />
        </g>
      </g>
    </svg>
  );
}

function DailySection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [log, setLog] = useState([]);
  const [error, setError] = useState('');
  const [dialog, setDialog] = useState(null); // 'catat' | 'target' | null

  const muat = useCallback(async () => {
    if (!user) {
      setSummary(null);
      setLog([]);
      return;
    }
    try {
      const [s, r] = await Promise.all([client.get('/activities/summary'), client.get('/activities', { params: { limit: 20 } })]);
      setSummary(s.data);
      setLog(r.data.items.filter((a) => tanggalLokal(a.date) === hariIni()));
      setError('');
    } catch (err) {
      setError(pesanError(err));
    }
  }, [user]);

  useEffect(() => {
    muat();
  }, [muat]);

  const buka = (jenis) => {
    if (!user) {
      navigate('/login', { state: { from: '/#aktivitas' } });
      return;
    }
    setDialog(jenis);
  };

  const hapus = async (id) => {
    try {
      await client.delete(`/activities/${id}`);
      await muat();
    } catch (err) {
      setError(pesanError(err));
    }
  };

  // Tamu melihat angka contoh
  const today = user ? summary?.today ?? 0 : 8;
  const target = summary?.target ?? user?.dailyTarget ?? 30;
  const pesan = summary ? pesanProgres(summary) : 'Satu langkah kecil, bisa jadi awal yang baik.';

  return (
    <section className="hl-daily container" id="aktivitas">
      <div className="hl-daily-target">
        <span className="hl-eyebrow">TARGET HARIANMU</span>
        <h2>Setel target yang nyaman, catat aktivitasmu, dan lihat langkah kecilmu terkumpul.</h2>
        <div className="hl-daily-actions">
          <button type="button" className="hl-button" onClick={() => buka('catat')}>Catat Aktivitas</button>
          <button type="button" className="hl-link hl-link--ink" onClick={() => buka('target')}>Atur Targetmu</button>
        </div>
      </div>

      <div className="hl-daily-card">
        <MataKartu />
        <span className="hl-eyebrow">GERAKMU HARI INI{user ? ` · ${formatTanggalPendek(new Date()).toUpperCase()}` : ''}</span>
        <div className="hl-daily-total">
          <strong>{today}</strong>
          <span>dari {target} menit</span>
        </div>
        <p>{pesan}</p>
        {error && <p role="alert" className="alert alert--error">{error}</p>}
        {log.length > 0 && (
          <ul className="hl-daily-log">
            {log.map((a) => (
              <li key={a._id}>
                <span>
                  {labelAktivitas(a.type)}
                  {a.note && <small> · {a.note}</small>}
                </span>
                <strong>{a.duration} mnt</strong>
                <button type="button" onClick={() => hapus(a._id)} aria-label={`Hapus ${labelAktivitas(a.type)} ${a.duration} menit`}>×</button>
              </li>
            ))}
          </ul>
        )}
        {user && (
          <Link to="/aktivitas" className="hl-daily-link">Lihat riwayat & 7 hari terakhir →</Link>
        )}
      </div>

      <Dialog open={dialog === 'catat'} onClose={() => setDialog(null)} labelledBy="dialog-catat" className="form-dialog">
        <span className="eyebrow">CATAT GERAKMU</span>
        <h2 id="dialog-catat">Apa yang kamu lakukan hari ini?</h2>
        <ActivityForm
          idPrefix="home-act"
          layout="stack"
          onSaved={async () => {
            setDialog(null);
            await muat();
          }}
        />
      </Dialog>

      <Dialog open={dialog === 'target'} onClose={() => setDialog(null)} labelledBy="dialog-target" className="form-dialog">
        <span className="eyebrow">TARGET YANG NYAMAN</span>
        <h2 id="dialog-target">Berapa menit bergerak per hari?</h2>
        <TargetForm
          idPrefix="home-target"
          onSaved={async () => {
            setDialog(null);
            await muat();
          }}
        />
      </Dialog>
    </section>
  );
}

export default DailySection;
