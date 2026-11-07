import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../lib/auth';
import { useFavorites } from '../lib/favorites';
import { formatTanggalKartu, labelKategori, urlGambar } from '../lib/format';
import { colors, gayaKategori, radius, space } from '../lib/theme';
import Teks from './Teks';
import { IkonBookmark, Simbol } from './Ikon';

// Tombol bookmark bulat
export function BookmarkButton({ content, style, size = 38 }) {
  const { user } = useAuth();
  const { isSaved, toggle } = useFavorites();
  const [proses, setProses] = useState(false);
  const tersimpan = isSaved(content._id);

  const handlePress = async () => {
    if (!user) return router.push({ pathname: '/login', params: { from: `/konten/${content.slug}` } });
    setProses(true);
    try {
      await toggle(content);
    } catch (err) {
      Alert.alert('Gagal', err.message);
    } finally {
      setProses(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={proses}
      accessibilityRole="button"
      accessibilityState={{ selected: tersimpan, busy: proses }}
      accessibilityLabel={tersimpan ? `Hapus "${content.title}" dari favorit` : `Simpan "${content.title}" ke favorit`}
      hitSlop={6}
      style={({ pressed }) => [
        styles.bookmark,
        { width: size, height: size, borderRadius: size / 2 },
        style,
        tersimpan && styles.bookmarkOn,
        pressed && { opacity: 0.8 }
      ]}
    >
      <IkonBookmark terisi={tersimpan} size={size * 0.45} />
    </Pressable>
  );
}

export function Tag({ category, style }) {
  const gaya = gayaKategori(category);
  return (
    <View style={[styles.tag, { backgroundColor: gaya.tag }, style]}>
      <Teks w="semibold" style={[styles.tagText, { color: gaya.teks }]}>
        {labelKategori(category).toUpperCase()}
      </Teks>
    </View>
  );
}

// Kartu ringkas: thumbnail kiri, teks kanan
export default function ContentCard({ content, polos = false }) {
  const [gagal, setGagal] = useState(false);
  const gambar = !gagal ? urlGambar(content.thumbnail) : null;
  const gaya = gayaKategori(content.category);
  const isVideo = content.category === 'video';
  const buka = () => router.push(`/konten/${content.slug}`);

  const tanggal = content.publishedAt ? formatTanggalKartu(content.publishedAt) : null;
  const durasi = content.readTime
    ? `${content.readTime} MNT BACA`
    : content.durationMinutes
      ? `${content.durationMinutes} MNT`
      : null;

  return (
    <Pressable
      onPress={buka}
      accessibilityRole="link"
      accessibilityLabel={`${isVideo ? 'Tonton' : 'Baca'}: ${content.title}`}
      style={({ pressed }) => [styles.card, polos && styles.polos, pressed && styles.cardPressed]}
    >
      <View style={styles.thumb}>
        {gambar ? (
          <Image source={{ uri: gambar }} style={styles.img} onError={() => setGagal(true)} />
        ) : (
          <View style={styles.vector}>
            <Simbol id={gaya.simbol} size={56} />
          </View>
        )}
        {isVideo && (
          <View style={styles.play}>
            <Teks style={styles.playText}>▶</Teks>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Tag category={content.category} style={styles.tagKecil} />
        <Teks w="medium" style={styles.title} numberOfLines={2}>
          {content.title}
        </Teks>
        <View style={styles.foot}>
          <Teks w="medium" style={styles.meta} numberOfLines={1}>
            {tanggal ? <Teks w="medium" style={[styles.meta, { color: colors.purple }]}>{tanggal}</Teks> : null}
            {tanggal && durasi ? ' · ' : ''}
            {durasi}
          </Teks>
          <BookmarkButton content={content} size={32} style={styles.bookmarkKecil} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: space.inner,
    padding: 10,
    marginBottom: space.list,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff'
  },
  polos: { borderWidth: 0 },
  cardPressed: { backgroundColor: '#FCFAFE', borderColor: colors.inputLine },
  thumb: {
    width: 104,
    height: 104,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3ECF9'
  },
  img: { width: '100%', height: '100%' },
  vector: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  play: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 34,
    height: 34,
    marginTop: -17,
    marginLeft: -17,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playText: { fontSize: 11, lineHeight: 14, marginLeft: 2 },
  body: { flex: 1, paddingVertical: 2, justifyContent: 'space-between' },
  bookmark: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  bookmarkOn: { backgroundColor: '#FFC96B' },
  bookmarkKecil: { backgroundColor: colors.lavender },
  tag: {
    alignSelf: 'flex-start',
    height: 30,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: '#fff'
  },
  tagKecil: { height: 22, paddingHorizontal: 10, borderWidth: 0 },
  tagText: { fontSize: 10, lineHeight: 13, letterSpacing: 0.8 },
  title: { fontSize: 15, lineHeight: 20, letterSpacing: -0.1, marginTop: 6 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 6 },
  meta: { fontSize: 10, lineHeight: 13, letterSpacing: 0.4, color: colors.muted, flexShrink: 1 }
});
