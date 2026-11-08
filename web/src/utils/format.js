import { ASSET_URL } from '../api/client';
import fotoNutrisi from '../assets/images/nutrisi.jpg';
import fotoGerak from '../assets/images/gerak.jpg';
import fotoPikiran from '../assets/images/pikiran.jpg';

export const KATEGORI = [
  { value: 'artikel', label: 'Artikel' },
  { value: 'video', label: 'Video' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'nutrisi', label: 'Nutrisi' }
];

export const labelKategori = (value) => KATEGORI.find((k) => k.value === value)?.label || value;

const GAYA_KATEGORI = {
  artikel: { tag: '#ffc015', tagTeks: '#1b1b1b', simbol: 'cat-cloud', foto: fotoPikiran },
  video: { tag: '#d9b8ff', tagTeks: '#1b1b1b', simbol: 'cat-rest', foto: null },
  olahraga: { tag: '#ff6600', tagTeks: '#fff', simbol: 'cat-shoe', foto: fotoGerak },
  nutrisi: { tag: '#7500b4', tagTeks: '#fff', simbol: 'cat-bowl', foto: fotoNutrisi }
};

export const gayaKategori = (value) => GAYA_KATEGORI[value] || GAYA_KATEGORI.artikel;

export const JENIS_AKTIVITAS = [
  { value: 'jalan', label: 'Jalan' },
  { value: 'lari', label: 'Lari' },
  { value: 'bersepeda', label: 'Bersepeda' },
  { value: 'gym', label: 'Gym' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'peregangan', label: 'Peregangan' },
  { value: 'lainnya', label: 'Lainnya' }
];

export const labelAktivitas = (value) => JENIS_AKTIVITAS.find((j) => j.value === value)?.label || value;

export const formatTanggal = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// "6 NOV 2026"
export const formatTanggalKartu = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();

export const formatTanggalPendek = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

export const namaHari = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'short' });

export const urlGambar = (path) => (path ? `${ASSET_URL}${path}` : '');

export const urlEmbedYoutube = (url) => {
  if (!url) return null;
  const cocok = url.match(/(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return cocok ? `https://www.youtube.com/embed/${cocok[1]}` : null;
};

// YYYY-MM-DD lokal
export const hariIni = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
};

// Tanggal lokal
export const tanggalLokal = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
};

export const pesanProgres = (summary) => {
  if (!summary) return '';
  if (summary.today === 0) return 'Yuk mulai bergerak, 10 menit jalan santai sudah dihitung.';
  if (summary.remaining === 0) return 'Target hari ini tercapai. Pertahankan besok!';
  return `Sedikit lagi! Tinggal ${summary.remaining} menit untuk capai targetmu.`;
};
