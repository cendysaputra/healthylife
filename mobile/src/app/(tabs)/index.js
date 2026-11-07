import { useCallback, useEffect, useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { KATEGORI } from '../../lib/format';
import Screen, { Section } from '../../components/Screen';
import ContentCard from '../../components/ContentCard';
import Button from '../../components/Button';

const ambil = (params) => api.get('/contents', { params }).then((r) => r.data.items);

export default function Beranda() {
  const [data, setData] = useState({ terbaru: [], video: [], olahraga: [], nutrisi: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const muat = useCallback(async () => {
    try {
      setError('');
      const [terbaru, video, olahraga, nutrisi] = await Promise.all([
        ambil({ limit: 4 }),
        ambil({ category: 'video', limit: 3 }),
        ambil({ category: 'olahraga', limit: 3 }),
        ambil({ category: 'nutrisi', limit: 3 })
      ]);
      setData({ terbaru, video, olahraga, nutrisi });
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const keJelajah = (kategori) => router.push({ pathname: '/jelajah', params: kategori ? { kategori } : {} });

  return (
    <Screen
      loading={loading}
      error={error}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        muat();
      }}
    >
      {/* Hero */}
      <Section>
        <Text>Your Daily Healthy Habit</Text>
        <Text style={{ fontSize: 24, fontWeight: '800' }}>Hidup sehat dimulai dari kebiasaan kecil hari ini</Text>
        <Text>
          Temukan artikel, video edukasi, panduan olahraga, dan informasi nutrisi untuk menemani rutinitas sehatmu.
        </Text>
        <Button title="Jelajahi Konten" onPress={() => keJelajah()} />
        <Button title="Catat Aktivitas" variant="outline" onPress={() => router.push('/aktivitas')} />
      </Section>

      {/* Kategori */}
      <Section title="Kategori">
        {KATEGORI.map((k) => (
          <Button key={k.value} title={k.label} variant="outline" onPress={() => keJelajah(k.value)} />
        ))}
      </Section>

      <Blok judul="Konten terbaru" items={data.terbaru} />
      <Blok judul="Video edukasi" items={data.video} />
      <Blok judul="Panduan olahraga" items={data.olahraga} />
      <Blok judul="Tips nutrisi" items={data.nutrisi} />
    </Screen>
  );
}

function Blok({ judul, items }) {
  return (
    <Section title={judul}>
      {items.length === 0 ? <Text>Belum ada konten.</Text> : items.map((c) => <ContentCard key={c._id} content={c} />)}
    </Section>
  );
}
