// Token tema (mengikuti web)
export const colors = {
  bg: '#FFFFFF',
  ink: '#1B1B1B',
  text: '#1B1B1B',
  muted: '#555555',
  purple: '#7500B4',
  purpleInk: '#260052',
  purpleSoft: '#D9B8FF',
  orange: '#FF6600',
  yellow: '#FFC015',
  yellowInk: '#7A4A00',
  cream: '#F5EFE6',
  creamRing: '#FAF6F0',
  lavender: '#F9F3FF',
  // Border abu-abu muda
  lavenderLine: '#E6E6E6',
  line: '#E6E6E6',
  inputLine: '#E6E6E6',
  focusLine: '#BDBDBD',
  barSoft: '#E6D4F8',
  peach: '#FFEFE7',
  danger: '#B4321F',
  dangerBg: '#FDECEA',
  success: '#2F6B46',
  successBg: '#E8F3EC'
};

// Brand lama, tetap diekspor untuk kompatibilitas
colors.brand = colors.purple;
colors.border = colors.line;

export const fonts = {
  regular: 'IBMPlexSans_400Regular',
  medium: 'IBMPlexSans_500Medium',
  semibold: 'IBMPlexSans_600SemiBold',
  bold: 'IBMPlexSans_700Bold'
};

// Skala spasi (pakai ini, jangan angka acak)
export const space = {
  screen: 16, // tepi kiri-kanan layar
  section: 48, // antar section
  block: 16, // antar kartu/blok dalam section, judul section ke isi
  list: 12, // antar item daftar
  card: 20, // padding dalam kartu
  inner: 12, // jarak elemen di dalam kartu
  heroTop: 24,
  heroBottom: 32,
  gap: 12
};

// Skala huruf
export const type = {
  hero: 34,
  page: 30,
  section: 24,
  card: 19,
  body: 15,
  small: 13,
  tiny: 11
};

export const radius = {
  card: 24,
  block: 24,
  input: 24,
  pill: 999
};

// Warna tag kategori
export const GAYA_KATEGORI = {
  artikel: { tag: '#FFC015', teks: '#1B1B1B', simbol: 'cat-cloud' },
  video: { tag: '#D9B8FF', teks: '#1B1B1B', simbol: 'cat-rest' },
  olahraga: { tag: '#FF6600', teks: '#FFFFFF', simbol: 'cat-shoe' },
  nutrisi: { tag: '#7500B4', teks: '#FFFFFF', simbol: 'cat-bowl' }
};

export const gayaKategori = (v) => GAYA_KATEGORI[v] || GAYA_KATEGORI.artikel;
