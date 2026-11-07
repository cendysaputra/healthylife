import { useEffect, useState } from 'react';
import { Alert as RNAlert, Image, Linking, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import YoutubePlayer from 'react-native-youtube-iframe';
import api, { pesanError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useFavorites } from '../../lib/favorites';
import { formatTanggalKartu, formatTanggalPanjang, idYoutube, labelKategori, urlGambar } from '../../lib/format';
import { colors, fonts, radius, space } from '../../lib/theme';
import Screen, { Hero, Section } from '../../components/Screen';
import Button from '../../components/Button';
import ContentCard, { BookmarkButton, Tag } from '../../components/ContentCard';
import Teks, { Judul } from '../../components/Teks';
import { IkonBookmark, Maskot } from '../../components/Ikon';

export default function DetailKonten() {
  const { slug } = useLocalSearchParams();
  const { user } = useAuth();
  const { isSaved, toggle } = useFavorites();
  const { width } = useWindowDimensions();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proses, setProses] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get(`/contents/${slug}`)
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  const content = data?.content;
  const tersimpan = content ? isSaved(content._id) : false;
  const videoId = idYoutube(content?.videoUrl);
  const lebarMedia = width - space.screen * 2;

  const toggleFavorit = async () => {
    // Login dulu
    if (!user) return router.push({ pathname: '/login', params: { from: `/konten/${slug}` } });
    setProses(true);
    try {
      await toggle(content);
    } catch (err) {
      RNAlert.alert('Gagal', err.message);
    } finally {
      setProses(false);
    }
  };

  const meta = content
    ? [
        ['Terbit', formatTanggalPanjang(content.publishedAt)],
        content.readTime ? ['Waktu baca', `${content.readTime} menit`] : null,
        content.durationMinutes ? ['Durasi', `${content.durationMinutes} menit`] : null,
        content.level ? ['Level', content.level] : null
      ].filter(Boolean)
    : [];

  return (
    <Screen
      header={content ? labelKategori(content.category) : 'Detail'}
      tabBar="jelajah"
      loading={loading}
      error={error}
      hero={
        content ? (
          <Hero style={styles.hero}>
            <Judul size={26}>{content.title}</Judul>
            {content.summary ? <Teks style={styles.summary}>{content.summary}</Teks> : null}

            <View style={styles.metaRow}>
              <BookmarkButton content={content} size={34} />
              <Tag category={content.category} style={styles.heroTag} />
              <Teks w="medium" style={styles.metaTeks} numberOfLines={1}>
                {formatTanggalKartu(content.publishedAt)}
                {content.readTime ? ` · ${content.readTime} MNT BACA` : ''}
                {content.durationMinutes ? ` · ${content.durationMinutes} MNT` : ''}
              </Teks>
            </View>

            {/* Video atau gambar */}
            <View style={styles.media}>
              {videoId ? (
                <View style={styles.mediaClip}>
                  <YoutubePlayer height={(lebarMedia * 9) / 16} width={lebarMedia} videoId={videoId} />
                </View>
              ) : content.thumbnail ? (
                <Image source={{ uri: urlGambar(content.thumbnail) }} style={[styles.mediaClip, styles.gambar]} />
              ) : null}
              <Maskot varian="kuning" size={48} style={styles.mediaMaskot} />
            </View>
          </Hero>
        ) : null
      }
    >
      {content && (
        <>
          {/* Isi konten */}
          <Markdown style={md}>
            {content.body}
          </Markdown>

          <View style={styles.divider} />
          <Teks style={styles.disclaimer}>
            Konten HealthyLife bersifat informasi umum, bukan diagnosis atau perawatan medis. Konsultasikan kebutuhan
            kesehatan pribadimu dengan tenaga kesehatan.
          </Teks>

          {/* Ringkasan */}
          <View style={styles.aside}>
            {meta.map(([k, v], i) => (
              <View key={k} style={[styles.asideRow, i > 0 && styles.asideLine]}>
                <Teks style={styles.asideKey}>{k}</Teks>
                <Teks w="semibold" style={styles.asideVal}>
                  {v}
                </Teks>
              </View>
            ))}
            {content.tags?.length > 0 && (
              <View style={[styles.tags, styles.asideLine]}>
                {content.tags.map((t) => (
                  <Teks key={t} w="medium" style={styles.tagText}>
                    #{t}
                  </Teks>
                ))}
              </View>
            )}
            <Button
              title={tersimpan ? 'Tersimpan di favorit' : 'Simpan ke favorit'}
              variant="outline"
              disabled={proses}
              onPress={toggleFavorit}
              icon={<IkonBookmark size={18} terisi={tersimpan} />}
              size="sm"
              style={{ marginTop: 14 }}
            />
          </View>

          {/* Sumber */}
          {content.sources?.length > 0 && (
            <View style={styles.sumber}>
              <Teks w="semibold" style={styles.sumberJudul}>
                Sumber acuan
              </Teks>
              {content.sources.map((s, i) => (
                <Pressable
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  onPress={s.url ? () => Linking.openURL(s.url) : undefined}
                  disabled={!s.url}
                  accessibilityRole={s.url ? 'link' : undefined}
                  style={({ pressed }) => [styles.sumberItem, pressed && { opacity: 0.6 }]}
                >
                  <Teks style={[styles.sumberTeks, s.url && styles.sumberLink]}>{s.title}</Teks>
                  {s.publisher ? <Teks style={styles.publisher}>{s.publisher}</Teks> : null}
                </Pressable>
              ))}
            </View>
          )}

          {/* Konten terkait */}
          {data.related.length > 0 && (
            <Section title="Lanjut baca ini, yuk." style={{ marginTop: space.section, marginBottom: 0 }}>
              <View>
                {data.related.map((c) => (
                  <ContentCard key={c._id} content={c} />
                ))}
                <Button
                  title={`Lihat semua ${labelKategori(content.category).toLowerCase()}`}
                  variant="outline"
                  onPress={() => router.navigate({ pathname: '/jelajah', params: { kategori: content.category } })}
                />
              </View>
            </Section>
          )}
        </>
      )}
    </Screen>
  );
}

// Gaya markdown
const teksIsi = { fontFamily: fonts.regular, fontSize: 16, lineHeight: 27, color: '#3F3F3F' };
const md = StyleSheet.create({
  body: teksIsi,
  paragraph: { marginTop: 0, marginBottom: 16 },
  heading1: { fontFamily: fonts.medium, fontSize: 22, lineHeight: 28, color: colors.ink, marginTop: 20, marginBottom: 12 },
  heading2: { fontFamily: fonts.medium, fontSize: 20, lineHeight: 26, color: colors.ink, marginTop: 24, marginBottom: 10 },
  heading3: { fontFamily: fonts.medium, fontSize: 17, lineHeight: 24, color: colors.ink, marginTop: 16, marginBottom: 10 },
  strong: { fontFamily: fonts.semibold, fontWeight: 'normal', color: colors.ink },
  em: { fontFamily: fonts.regular, fontStyle: 'italic' },
  bullet_list: { marginBottom: 18 },
  ordered_list: { marginBottom: 18 },
  list_item: { marginBottom: 8 },
  bullet_list_icon: { color: colors.orange, fontSize: 20, lineHeight: 27, marginLeft: 0, marginRight: 12 },
  ordered_list_icon: { color: colors.orange, fontFamily: fonts.regular, fontSize: 16, lineHeight: 27, marginLeft: 0, marginRight: 10 },
  link: { color: colors.purple, textDecorationLine: 'underline' },
  blockquote: { backgroundColor: colors.lavender, borderLeftColor: colors.purple, borderLeftWidth: 3, borderRadius: 12, padding: 14, marginBottom: 18 },
  hr: { backgroundColor: colors.line, height: 1, marginVertical: 20 }
});

const styles = StyleSheet.create({
  hero: { paddingTop: space.heroTop, paddingBottom: space.heroBottom },
  summary: { color: colors.muted, lineHeight: 23, marginTop: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 20, height: 34 },
  heroTag: { borderWidth: 0, height: 30 },
  metaTeks: { fontSize: 11, lineHeight: 14, letterSpacing: 0.5, color: colors.muted, flexShrink: 1 },
  media: { marginTop: 20 },
  mediaClip: { borderRadius: radius.card, overflow: 'hidden', backgroundColor: '#EDE4D8' },
  gambar: { width: '100%', aspectRatio: 16 / 10 },
  mediaMaskot: { position: 'absolute', left: -8, bottom: -14 },
  divider: { height: 1, backgroundColor: '#ECE7E2', marginTop: 16, marginBottom: 20 },
  disclaimer: { fontSize: 12, lineHeight: 19, color: colors.muted, marginBottom: space.block },
  aside: { backgroundColor: colors.lavender, borderRadius: radius.card, padding: space.card },
  asideRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 12 },
  asideLine: { borderTopWidth: 1, borderTopColor: colors.line },
  asideKey: { color: colors.muted, fontSize: 14 },
  asideVal: { fontSize: 14, textAlign: 'right', flexShrink: 1 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, paddingTop: 14 },
  tagText: { color: colors.purple, fontSize: 13 },
  sumber: {
    marginTop: space.block,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    padding: space.card,
    gap: 10
  },
  sumberJudul: { fontSize: 16, lineHeight: 22, letterSpacing: -0.2 },
  sumberItem: { gap: 2 },
  sumberTeks: { fontSize: 14, lineHeight: 21 },
  sumberLink: { textDecorationLine: 'underline', color: colors.ink },
  publisher: { fontSize: 12, lineHeight: 17, color: colors.muted }
});
