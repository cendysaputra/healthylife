import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { KATEGORI } from '../../lib/format';
import { colors, fonts, radius, space, type } from '../../lib/theme';
import Screen, { Hero, Kosong } from '../../components/Screen';
import ContentCard from '../../components/ContentCard';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Teks, { Judul } from '../../components/Teks';
import Ikon, { Maskot } from '../../components/Ikon';

const LIMIT = 9;
const IKON_KATEGORI = {
  artikel: { simbol: 'cat-cloud', warna: '#FFE5EE' },
  video: { simbol: 'cat-rest', warna: '#F1E6FF' },
  olahraga: { simbol: 'cat-shoe', warna: '#ECE2FF' },
  nutrisi: { simbol: 'cat-bowl', warna: '#FFE4D3' }
};
const PILIHAN = [
  { value: '', label: 'Semua kategori', simbol: 'cat-leaf', warna: '#FFF1C7' },
  ...KATEGORI.map((k) => ({ ...k, ...IKON_KATEGORI[k.value] }))
];

export default function Jelajah() {
  const params = useLocalSearchParams();
  const [kategori, setKategori] = useState(params.kategori || '');
  const [keyword, setKeyword] = useState('');
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [lagi, setLagi] = useState(false);
  const [error, setError] = useState('');

  // Kategori dari beranda
  useEffect(() => {
    setKategori(params.kategori || '');
  }, [params.kategori]);

  const muat = useCallback(
    async (halaman = 1) => {
      try {
        setError('');
        if (halaman === 1) setLoading(true);
        else setLagi(true);
        const { data } = await api.get('/contents', {
          params: { category: kategori || undefined, q: q || undefined, page: halaman, limit: LIMIT }
        });
        setItems((lama) => (halaman === 1 ? data.items : [...lama, ...data.items]));
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(pesanError(err));
      } finally {
        setLoading(false);
        setLagi(false);
      }
    },
    [kategori, q]
  );

  useEffect(() => {
    muat(1);
  }, [muat]);

  const cari = () => setQ(keyword.trim());

  return (
    <Screen
      error={error}
      hero={
        <Hero style={styles.hero}>
          <Judul size={type.page} aksen="di satu tempat.">
            {'Semua bekal baik,\n'}
          </Judul>
          <Maskot varian="lavender" size={40} style={styles.maskot} />
        </Hero>
      }
    >
      {/* Pencarian */}
      <View style={styles.searchRow}>
        <View style={styles.search}>
          <Ikon name="search" size={18} color={colors.muted} />
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Contoh: sarapan sehat"
            placeholderTextColor="#8A8494"
            returnKeyType="search"
            onSubmitEditing={cari}
            accessibilityLabel="Cari konten"
            style={styles.searchInput}
          />
          {keyword ? (
            <Pressable
              onPress={() => {
                setKeyword('');
                setQ('');
              }}
              accessibilityRole="button"
              accessibilityLabel="Hapus pencarian"
              hitSlop={10}
            >
              <Ikon name="close" size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
        <Button title="Cari" size="sm" block={false} onPress={cari} style={styles.cariBtn} />
      </View>

      {/* Pilih kategori */}
      <View style={styles.select}>
        <Select value={kategori} options={PILIHAN} onChange={setKategori} />
      </View>

      {q ? (
        <Teks style={styles.hasil}>
          Hasil pencarian <Teks w="semibold">"{q}"</Teks>
        </Teks>
      ) : null}

      {loading ? (
        <Teks style={styles.hasil}>Memuat...</Teks>
      ) : items.length === 0 ? (
        <Kosong judul="Konten tidak ditemukan." teks="Coba kata kunci lain atau pilih kategori yang berbeda." />
      ) : (
        <View>
          {items.map((c) => (
            <ContentCard key={c._id} content={c} />
          ))}
          {page < totalPages && (
            <Button
              title={lagi ? 'Memuat...' : 'Muat lebih banyak'}
              variant="outline"
              disabled={lagi}
              onPress={() => muat(page + 1)}
            />
          )}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.heroTop, paddingBottom: 40 },
  maskot: { position: 'absolute', right: 36, bottom: -16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lavenderLine,
    backgroundColor: '#fff'
  },
  searchInput: { flex: 1, minHeight: 44, fontFamily: fonts.regular, fontSize: 14, color: colors.ink },
  cariBtn: { minHeight: 46, paddingHorizontal: 20 },
  select: { marginTop: space.list, marginBottom: space.heroBottom },
  hasil: { color: colors.muted, fontSize: 14, marginBottom: space.block }
});
