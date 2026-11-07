import { useState } from 'react';
import client, { pesanError } from '../api/client';
import { JENIS_AKTIVITAS, hariIni } from '../utils/format';
import Select from './Select';

const formAwal = () => ({ type: 'jalan', duration: '', date: hariIni(), note: '' });

// Form catat aktivitas
function ActivityForm({ onSaved, idPrefix = 'act', layout = 'grid', submitLabel = 'Simpan aktivitas' }) {
  const [form, setForm] = useState(formAwal);
  const [simpan, setSimpan] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSimpan(true);
    try {
      await client.post('/activities', { ...form, duration: Number(form.duration) });
      setForm(formAwal());
      await onSaved?.();
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setSimpan(false);
    }
  };

  const id = (name) => `${idPrefix}-${name}`;

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className={layout === 'grid' ? 'form-grid' : 'form-stack'}>
        <div className="field">
          <label id={id('type-label')} htmlFor={id('type')}>
            Jenis
          </label>
          <Select
            id={id('type')}
            labelId={id('type-label')}
            value={form.type}
            options={JENIS_AKTIVITAS}
            onChange={(type) => setForm((f) => ({ ...f, type }))}
          />
        </div>

        <div className="field">
          <label htmlFor={id('duration')}>Durasi (menit)</label>
          <input
            id={id('duration')}
            name="duration"
            type="number"
            inputMode="numeric"
            min="1"
            max="600"
            required
            placeholder="Contoh: 15"
            value={form.duration}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor={id('date')}>Tanggal</label>
          <input
            id={id('date')}
            name="date"
            type="date"
            max={hariIni()}
            required
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor={id('note')}>Catatan</label>
          <input
            id={id('note')}
            name="note"
            type="text"
            maxLength="200"
            placeholder="Opsional"
            value={form.note}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="alert alert--error">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="button button-blue" disabled={simpan}>
          {simpan ? 'Menyimpan...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default ActivityForm;
