import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { formatTanggal, labelKategori, urlGambar } from '../lib/format';
import { colors, space } from '../lib/theme';

export default function ContentCard({ content }) {
  const gambar = urlGambar(content.thumbnail);

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/konten/${content.slug}`)}
      accessibilityRole="link"
    >
      {gambar && <Image source={{ uri: gambar }} style={styles.img} />}
      <View style={styles.body}>
        <Text style={styles.muted}>{labelKategori(content.category)}</Text>
        <Text style={styles.title}>{content.title}</Text>
        {content.summary ? <Text numberOfLines={2}>{content.summary}</Text> : null}
        <Text style={styles.muted}>
          {formatTanggal(content.publishedAt)}
          {content.readTime ? ` · ${content.readTime} menit baca` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: colors.border, marginBottom: space.gap },
  img: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.border },
  body: { padding: space.gap, gap: 4 },
  title: { fontWeight: '600' },
  muted: { color: colors.muted },
});
