import { ASSET_URL } from './api';

export const KATEGORI = [
  { value: 'artikel', label: 'Artikel' },
  { value: 'video', label: 'Video' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'nutrisi', label: 'Nutrisi' }
];

export const labelKategori = (v) => KATEGORI.find((k) => k.value === v)?.label || v;

export const JENIS_AKTIVITAS = [
  { value: 'jalan', label: 'Jalan' },
  { value: 'lari', label: 'Lari' },
  { value: 'bersepeda', label: 'Bersepeda' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'peregangan', label: 'Peregangan' },
  { value: 'lainnya', label: 'Lainnya' }
];

export const labelAktivitas = (v) => JENIS_AKTIVITAS.find((j) => j.value === v)?.label || v;

export const formatTanggal = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatTanggalPanjang = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// "6 NOV 2026"
export const formatTanggalKartu = (date) => formatTanggal(date).toUpperCase();

export const formatTanggalPendek = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

export const namaHari = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'short' });

// YYYY-MM-DD lokal
export const tanggalLokal = (date) => {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const pesanProgres = (summary) => {
  if (!summary) return '';
  if (summary.today === 0) return 'Yuk mulai bergerak, 10 menit jalan santai sudah dihitung.';
  if (summary.remaining === 0) return 'Target hari ini tercapai. Pertahankan besok!';
  return `Sedikit lagi! Tinggal ${summary.remaining} menit untuk capai targetmu.`;
};

export const urlGambar =(path) => (path ? `${ASSET_URL}${path}` : null);

// ID YouTube
export const idYoutube = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
};

// Hari ini (lokal)
export const hariIni = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
