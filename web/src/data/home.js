// Dipakai di beranda dan arsip konten
export const KARTU_KATEGORI = [
  { value: '', label: 'Semua inspirasi', sub: 'Temukan hal baru', simbol: 'cat-leaf', warna: 'cream' },
  { value: 'nutrisi', label: 'Makan lebih baik', sub: 'Nutrisi sehari-hari', simbol: 'cat-bowl', warna: 'peach' },
  { value: 'olahraga', label: 'Aktif bergerak', sub: 'Mulai dari langkahmu', simbol: 'cat-shoe', warna: 'light-blue' },
  { value: 'artikel', label: 'Pikiran tenang', sub: 'Bacaan untuk dirimu', simbol: 'cat-cloud', warna: 'pink' },
  { value: 'video', label: 'Tonton & coba', sub: 'Video edukasi', simbol: 'cat-rest', warna: 'lavender' }
];

// Foto dari server/public/images
export const KEBIASAAN = [
  {
    id: 'gerak',
    foto: '/images/jalan-cepat-30-menit-untuk-pemula.jpg',
    label: 'Lebih sering bergerak',
    simbol: 'move',
    judul: ['Jalan sebentar.', 'Rasakan bedanya.'],
    teks: 'Sisihkan 10 menit untuk berjalan santai. Di sekitar rumah, taman, atau ke tempat favoritmu.',
    tip: 'Mulai setelah aktivitas yang sudah rutin, misalnya setelah makan siang.',
    link: { to: '/aktivitas', label: 'Catat gerakmu' }
  },
  {
    id: 'makan',
    foto: '/images/sayur-dan-buah-setiap-hari.jpg',
    label: 'Makan lebih sadar',
    simbol: 'food',
    judul: ['Setengah piring,', 'sayur dan buah.'],
    teks: 'Nggak perlu diet ketat. Mulai dari satu kali makan sehari dengan porsi sayur dan buah yang lebih banyak.',
    tip: 'Taruh buah potong di tempat yang mudah terlihat dan terjangkau.',
    link: { to: '/konten?kategori=nutrisi', label: 'Lihat inspirasi nutrisi' }
  },
  {
    id: 'diri',
    foto: '/images/mengelola-stres-dengan-cara-sederhana.jpg',
    label: 'Punya waktu untuk diri',
    simbol: 'mind',
    judul: ['Lima menit,', 'hanya untukmu.'],
    teks: 'Duduk tenang, tarik napas pelan, atau tulis satu hal yang kamu syukuri hari ini.',
    tip: 'Pasang pengingat lembut di jam yang biasanya paling sibuk.',
    link: { to: '/konten?kategori=artikel', label: 'Baca artikel pilihan' }
  },
  {
    id: 'istirahat',
    foto: '/images/tidur-cukup-dan-pengaruhnya-pada-energi-harian.jpg',
    label: 'Istirahat lebih teratur',
    simbol: 'moon',
    judul: ['Tidur di jam', 'yang sama.'],
    teks: 'Coba tidur dan bangun di waktu yang mirip setiap hari, termasuk saat akhir pekan.',
    tip: 'Jauhkan layar sekitar 30 menit sebelum tidur.',
    link: { to: '/konten?kategori=artikel', label: 'Baca tentang tidur' }
  },
  {
    id: 'video',
    foto: '/images/latihan-ringan-di-rumah-untuk-pemula.jpg',
    label: 'Belajar lewat video',
    simbol: 'cat-leaf',
    judul: ['Satu video,', 'satu gerakan baru.'],
    teks: 'Tonton video edukasi singkat, lalu praktikkan satu hal yang paling mudah untukmu.',
    tip: 'Simpan videonya ke favorit supaya mudah ditonton lagi.',
    link: { to: '/konten?kategori=video', label: 'Pilih video' }
  },
  {
    id: 'pagi',
    foto: '/images/rutinitas-pagi-untuk-memulai-hari-lebih-segar.jpg',
    label: 'Mulai pagi lebih pelan',
    simbol: 'sun',
    judul: ['Pagi tanpa', 'terburu-buru.'],
    teks: 'Bangun 10 menit lebih awal untuk minum segelas air dan peregangan ringan.',
    tip: 'Siapkan segelas air di samping tempat tidur sejak malam.',
    link: { to: '/konten?kategori=olahraga', label: 'Lihat panduan peregangan' }
  }
];

// Item genap tampil tebal oranye
export const TEKS_BERJALAN = [
  'Gerak ringan',
  'Makan seimbang',
  'Tidur cukup',
  'Pikiran tenang',
  'Minum air putih',
  'Satu langkah kecil'
];
