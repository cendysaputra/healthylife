import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';
import api, { pesanError } from '../lib/api';
import { colors, space, type } from '../lib/theme';
import Screen, { Hero, Kosong } from '../components/Screen';
import ContentCard from '../components/ContentCard';
import Button from '../components/Button';
import Teks, { Judul } from '../components/Teks';

export default function Notifikasi() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ambil, tandai dilihat
    api
      .get('/notifications')
      .then(({ data }) => {
        setItems(data.items);
        return api.put('/notifications/seen');
      })
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Screen
      header="Notifikasi"
      tabBar="none"
      loading={loading}
      error={error}
      hero={
        <Hero style={styles.hero}>
          <Judul size={type.page} aksen="untukmu.">
            {'Konten baru,\n'}
          </Judul>
          <Teks style={styles.teks}>Bacaan dan video yang terbit sejak terakhir kamu cek.</Teks>
        </Hero>
      }
    >
      {items.length === 0 ? (
        <Kosong judul="Belum ada konten baru." teks="Kamu sudah melihat semuanya. Cek lagi nanti, ya.">
          <Button
            title="Jelajahi konten"
            size="sm"
            block={false}
            style={{ alignSelf: 'center' }}
            onPress={() => router.navigate('/jelajah')}
          />
        </Kosong>
      ) : (
        items.map((c) => <ContentCard key={c._id} content={c} />)
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.heroTop, paddingBottom: space.heroBottom },
  teks: { color: colors.muted, lineHeight: 23, marginTop: 12 }
});
