import { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon';

// Dropdown custom
function Select({ id, labelId, value, options, onChange, icon, className = '' }) {
  const autoId = useId().replace(/:/g, '');
  const baseId = id || `select-${autoId}`;
  const listId = `${baseId}-list`;
  const optId = (i) => `${baseId}-opt-${i}`;

  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const ketik = useRef({ teks: '', timer: null });

  const [open, setOpen] = useState(false);
  const [aktif, setAktif] = useState(0);
  const [keAtas, setKeAtas] = useState(false);

  const indexTerpilih = Math.max(
    options.findIndex((o) => o.value === value),
    0
  );
  const terpilih = options[indexTerpilih];

  const buka = () => {
    // Buka ke atas
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const bawah = window.innerHeight - rect.bottom;
      setKeAtas(bawah < 300 && rect.top > bawah);
    }
    setAktif(indexTerpilih);
    setOpen(true);
  };

  const tutup = (fokusTombol = true) => {
    setOpen(false);
    if (fokusTombol) buttonRef.current?.focus();
  };

  const pilih = (i) => {
    const o = options[i];
    if (o && o.value !== value) onChange(o.value);
    tutup();
  };

  useEffect(() => {
    if (!open) return undefined;
    listRef.current?.focus({ preventScroll: true });
    const luar = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', luar);
    return () => document.removeEventListener('pointerdown', luar);
  }, [open]);

  // Opsi aktif terlihat
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${baseId}-opt-${aktif}`)?.scrollIntoView({ block: 'nearest' });
  }, [aktif, open, baseId]);

  useEffect(() => () => clearTimeout(ketik.current.timer), []);

  // Cari huruf
  const cariHuruf = (huruf) => {
    const k = ketik.current;
    clearTimeout(k.timer);
    k.teks += huruf.toLowerCase();
    k.timer = setTimeout(() => {
      k.teks = '';
    }, 500);
    const i = options.findIndex((o) => o.label.toLowerCase().startsWith(k.teks));
    return i;
  };

  const handleTombolKey = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      buka();
      return;
    }
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const i = cariHuruf(e.key);
      if (i >= 0 && options[i].value !== value) onChange(options[i].value);
    }
  };

  const handleListKey = (e) => {
    const akhir = options.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setAktif((i) => Math.min(i + 1, akhir));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setAktif((i) => Math.max(i - 1, 0));
        break;
      case 'Home':
        e.preventDefault();
        setAktif(0);
        break;
      case 'End':
        e.preventDefault();
        setAktif(akhir);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pilih(aktif);
        break;
      case 'Escape':
        // Jangan tutup dialog
        e.preventDefault();
        e.stopPropagation();
        tutup();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const i = cariHuruf(e.key);
          if (i >= 0) setAktif(i);
        }
    }
  };

  const kelas = ['select', open ? 'is-open' : '', keAtas ? 'is-up' : '', className].filter(Boolean).join(' ');

  return (
    <div ref={wrapRef} className={kelas}>
      <button
        ref={buttonRef}
        id={baseId}
        type="button"
        className="select-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={labelId ? `${labelId} ${baseId}` : undefined}
        onClick={() => (open ? tutup() : buka())}
        onKeyDown={handleTombolKey}
      >
        {icon && <span className="select-icon">{icon}</span>}
        <span className="select-value">{terpilih?.label}</span>
        <Icon name="chevron-down" className="select-chevron" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          className="select-list"
          role="listbox"
          tabIndex="-1"
          aria-labelledby={labelId}
          aria-activedescendant={optId(aktif)}
          onKeyDown={handleListKey}
          onBlur={(e) => {
            if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
          }}
          data-lenis-prevent=""
        >
          {options.map((o, i) => (
            <li
              key={o.value || 'kosong'}
              id={optId(i)}
              role="option"
              aria-selected={o.value === value}
              className={i === aktif ? 'is-active' : undefined}
              onPointerEnter={() => setAktif(i)}
              onClick={() => pilih(i)}
            >
              <span>{o.label}</span>
              {o.value === value && (
                <svg className="select-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Select;
