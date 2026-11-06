import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { KATEGORI } from '../../lib/format';
import { space } from '../../lib/theme';
import Screen, { Section } from '../../components/Screen';
import ContentCard from '../../components/ContentCard';
import Button from '../../components/Button';
import Field from '../../components/Field';

const LIMIT = 9;

export default function Jelajah() {
  const params = useLocalSearchParams();
  const [kategori, setKategori] = useState(params.kategori || '');
  const [keyword, setKeyword] = useState('');
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
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
        const { data } = await api.get('/contents', {
          params: { category: kategori || undefined, q: q || undefined, page: halaman, limit: LIMIT },
        });
        setItems((lama) => (halaman === 1 ? data.items : [...lama, ...data.items]));
        setPage(data.page);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(pesanError(err));
      } finally {
        setLoading(false);
      }
    },
    [kategori, q]
  );

  useEffect(() => {
    muat(1);
  }, [muat]);

  return (
    <Screen error={error}>
      {/* Pilih kategori */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: space.gap, marginBottom: space.gap }}>
        <Button title="Semua" variant={kategori ? 'outline' : 'primary'} onPress={() => setKategori('')} />
        {KATEGORI.map((k) => (
          <Button
            key={k.value}
            title={k.label}
            variant={kategori === k.value ? 'primary' : 'outline'}
            onPress={() => setKategori(k.value)}
          />
        ))}
      </ScrollView>

      {/* Pencarian */}
      <Section>
        <Field
          label="Cari konten"
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Contoh: sarapan sehat"
          returnKeyType="search"
          onSubmitEditing={() => setQ(keyword.trim())}
        />
        <Button title="Cari" onPress={() => setQ(keyword.trim())} />
        {q ? <Text>Hasil pencarian "{q}"</Text> : null}
      </Section>

      {loading ? (
        <Text>Memuat...</Text>
      ) : (
        <View>
          {items.length === 0 && <Text>Konten tidak ditemukan.</Text>}
          {items.map((c) => (
            <ContentCard key={c._id} content={c} />
          ))}
          {page < totalPages && <Button title="Muat lebih banyak" variant="outline" onPress={() => muat(page + 1)} />}
        </View>
      )}
    </Screen>
  );
}
