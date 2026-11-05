import { ASSET_URL } from '../api/client';

// Nama kategori
export const KATEGORI = [
  { value: 'artikel', label: 'Artikel' },
  { value: 'video', label: 'Video' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'nutrisi', label: 'Nutrisi' }
];

export const labelKategori = (value) =>
  KATEGORI.find((k) => k.value === value)?.label || value;

// Jenis aktivitas
export const JENIS_AKTIVITAS = [
  { value: 'jalan', label: 'Jalan' },
  { value: 'lari', label: 'Lari' },
  { value: 'bersepeda', label: 'Bersepeda' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'peregangan', label: 'Peregangan' },
  { value: 'lainnya', label: 'Lainnya' }
];

export const labelAktivitas = (value) =>
  JENIS_AKTIVITAS.find((j) => j.value === value)?.label || value;

// Format tanggal
export const formatTanggal = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// Alamat gambar
export const urlGambar = (path) => (path ? `${ASSET_URL}${path}` : '');

// Link embed YouTube
export const urlEmbedYoutube = (url) => {
  if (!url) return null;
  const cocok = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return cocok ? `https://www.youtube.com/embed/${cocok[1]}` : null;
};

// Tanggal hari ini
export const hariIni = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
};
