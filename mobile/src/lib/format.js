import { ASSET_URL } from './api';

export const KATEGORI = [
  { value: 'artikel', label: 'Artikel' },
  { value: 'video', label: 'Video' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'nutrisi', label: 'Nutrisi' },
];

export const labelKategori = (v) => KATEGORI.find((k) => k.value === v)?.label || v;

export const JENIS_AKTIVITAS = [
  { value: 'jalan', label: 'Jalan' },
  { value: 'lari', label: 'Lari' },
  { value: 'bersepeda', label: 'Bersepeda' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'peregangan', label: 'Peregangan' },
  { value: 'lainnya', label: 'Lainnya' },
];

export const labelAktivitas = (v) => JENIS_AKTIVITAS.find((j) => j.value === v)?.label || v;

export const formatTanggal = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

export const urlGambar = (path) => (path ? `${ASSET_URL}${path}` : null);

// Ambil ID video dari link YouTube
export const idYoutube = (url) => {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? m[1] : null;
};

// Tanggal hari ini (YYYY-MM-DD, waktu lokal)
export const hariIni = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
