import { useEffect, useRef } from 'react';
import { hentikanScroll, lanjutkanScroll } from '../utils/smoothScroll';

function Dialog({ open, onClose, labelledBy, className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      document.body.classList.add('dialog-open');
      hentikanScroll();
    } else if (!open && el.open) {
      el.close();
    }
    if (!open) {
      document.body.classList.remove('dialog-open');
      lanjutkanScroll();
    }
  }, [open]);

  useEffect(
    () => () => {
      document.body.classList.remove('dialog-open');
      lanjutkanScroll();
    },
    []
  );

  // Klik di backdrop menutup dialog
  const handleClick = (e) => {
    if (e.target === ref.current) onClose();
  };

  return (
    <dialog
      ref={ref}
      className={`article-dialog ${className}`.trim()}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={handleClick}
    >
      <button type="button" className="dialog-close" onClick={onClose} aria-label="Tutup">
        ×
      </button>
      {open && <div className="dialog-body">{children}</div>}
    </dialog>
  );
}

export default Dialog;
