import { useCallback, useEffect, useState } from 'react';
import { Image, Linking, Text, View, useWindowDimensions } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import Markdown from 'react-native-markdown-display';
import YoutubePlayer from 'react-native-youtube-iframe';
import api, { pesanError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatTanggal, idYoutube, labelKategori, urlGambar } from '../../lib/format';
import { space } from '../../lib/theme';
import Screen, { Section } from '../../components/Screen';
import Button from '../../components/Button';
import ContentCard from '../../components/ContentCard';

export default function DetailKonten() {
  const { slug } = useLocalSearchParams();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const [data, setData] = useState(null);
  const [favorit, setFavorit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/contents/${slug}`)
      .then(({ data }) => setData(data))
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  // Status favorit
  const cekFavorit = useCallback(async () => {
    if (!user || !data) return setFavorit(false);
    try {
      const res = await api.get('/favorites');
      setFavorit(res.data.items.some((i) => i._id === data.content._id));
    } catch {
      setFavorit(false);
    }
  }, [user, data]);

  useEffect(() => {
    cekFavorit();
  }, [cekFavorit]);

  const toggleFavorit = async () => {
    // Login dulu
    if (!user) return router.push({ pathname: '/login', params: { from: `/konten/${slug}` } });
    try {
      if (favorit) await api.delete(`/favorites/${data.content._id}`);
      else await api.post(`/favorites/${data.content._id}`);
      setFavorit(!favorit);
    } catch (err) {
      setError(pesanError(err));
    }
  };

  const content = data?.content;
  const videoId = idYoutube(content?.videoUrl);
  const lebarMedia = width - space.screen * 2;

  return (
    <Screen loading={loading} error={error}>
      <Stack.Screen options={{ title: content ? labelKategori(content.category) : 'Detail' }} />

      {content && (
        <>
          <Section>
            <Text style={{ fontSize: 22, fontWeight: '800' }}>{content.title}</Text>
            <Text>
              Terbit {formatTanggal(content.publishedAt)}
              {content.readTime ? ` · ${content.readTime} menit baca` : ''}
              {content.durationMinutes ? ` · Durasi ${content.durationMinutes} menit` : ''}
              {content.level ? ` · Level ${content.level}` : ''}
            </Text>
            <Button
              title={favorit ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
              variant="outline"
              onPress={toggleFavorit}
            />
          </Section>

          {/* Video atau gambar */}
          <Section>
            {videoId ? (
              <YoutubePlayer height={(lebarMedia * 9) / 16} width={lebarMedia} videoId={videoId} />
            ) : content.thumbnail ? (
              <Image source={{ uri: urlGambar(content.thumbnail) }} style={{ width: '100%', aspectRatio: 16 / 9 }} />
            ) : null}
          </Section>

          {/* Isi konten */}
          <Section>
            <Markdown>{content.body}</Markdown>
          </Section>

          {/* Sumber */}
          {content.sources?.length > 0 && (
            <Section title="Sumber acuan">
              {content.sources.map((s, i) => (
                <Text
                  key={i}
                  onPress={s.url ? () => Linking.openURL(s.url) : undefined}
                  style={s.url ? { textDecorationLine: 'underline' } : undefined}
                >
                  {s.title}
                  {s.publisher ? `, ${s.publisher}` : ''}
                </Text>
              ))}
            </Section>
          )}

          {/* Konten terkait */}
          {data.related.length > 0 && (
            <Section title="Konten terkait">
              <View>
                {data.related.map((c) => (
                  <ContentCard key={c._id} content={c} />
                ))}
              </View>
            </Section>
          )}
        </>
      )}
    </Screen>
  );
}
