import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { formatTanggalPendek, pesanProgres } from '../../lib/format';
import { colors, radius, space, type } from '../../lib/theme';
import Screen, { Section } from '../../components/Screen';
import ContentCard from '../../components/ContentCard';
import Button from '../../components/Button';
import Teks, { Eyebrow, Judul } from '../../components/Teks';
import { Awan, Gradien, Maskot, MataKartu, Simbol } from '../../components/Ikon';

// Kartu kategori
const KARTU_KATEGORI = [
  { value: 'nutrisi', label: 'Makan lebih baik', sub: 'Nutrisi sehari-hari', simbol: 'cat-bowl', warna: '#FFE4D3' },
  { value: 'olahraga', label: 'Aktif bergerak', sub: 'Mulai dari langkahmu', simbol: 'cat-shoe', warna: '#ECE2FF' },
  { value: 'artikel', label: 'Pikiran tenang', sub: 'Bacaan untuk dirimu', simbol: 'cat-cloud', warna: '#FFE5EE' },
  { value: 'video', label: 'Tonton & coba', sub: 'Video edukasi', simbol: 'cat-rest', warna: '#F1E6FF' }
];

const ambil = (params) => api.get('/contents', { params }).then((r) => r.data.items);

export default function Beranda() {
  const { user } = useAuth();
  const [data, setData] = useState({ terbaru: [], video: [] });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const muat = useCallback(async () => {
    try {
      setError('');
      const [terbaru, video] = await Promise.all([ambil({ limit: 4 }), ambil({ category: 'video', limit: 3 })]);
      setData({ terbaru, video });
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

  // Ringkasan saat fokus
  useFocusEffect(
    useCallback(() => {
      if (!user) return setSummary(null);
      api
        .get('/activities/summary')
        .then(({ data: s }) => setSummary(s))
        .catch(() => setSummary(null));
    }, [user])
  );

  const keJelajah = (kategori) => router.push({ pathname: '/jelajah', params: { kategori: kategori || '' } });

  // Contoh untuk tamu
  const today = user ? (summary?.today ?? 0) : 8;
  const target = summary?.target ?? user?.dailyTarget ?? 30;
  const pesan = summary ? pesanProgres(summary) : 'Satu langkah kecil, bisa jadi awal yang baik.';
  const namaDepan = user?.name?.split(' ')[0];

  return (
    <Screen
      error={error}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        muat();
      }}
      latar={colors.bg}
      hero={
        <View style={styles.heroLuar}>
          <View style={styles.heroKotak}>
            {/* Cincin dekoratif */}
            <View style={styles.heroClip} pointerEvents="none">
              <View style={styles.heroRing} />
            </View>

            {user ? (
              <Teks w="medium" style={styles.halo}>
                Halo, {namaDepan}
              </Teks>
            ) : null}
            <Judul size={30} aksen="hal kecil." warnaAksen={colors.yellow} style={{ color: '#fff' }}>
              {'Hidup sehat, mulai\ndari '}
            </Judul>
            <Teks style={styles.heroTeks}>
              Nggak perlu mengubah semuanya sekaligus. Temukan inspirasi sederhana untuk tubuh yang lebih aktif dan
              pikiran yang lebih tenang.
            </Teks>
            <Button title="Temukan Inspirasimu" variant="orange" block={false} onPress={() => keJelajah()} />

            {/* Maskot sudut */}
            <Maskot varian="kuning" size={56} style={[styles.smile, { top: -18, right: 28 }]} />
            <Maskot varian="lavender" size={44} style={[styles.smile, { left: -12, bottom: -20 }]} />
          </View>
        </View>
      }
    >
      {/* Ajakan mulai */}
      <Section>
        <KartuMulai
          judul={'Yang penting mulai.\nBukan seberapa jauh.'}
          teks="Jalan santai, stretching, atau bersepeda. Setiap gerakan punya tempat di harimu."
          link="Panduan Olahraga"
          warna={colors.orange}
          latar={colors.peach}
          tekan="#FFE3D1"
          onPress={() => keJelajah('olahraga')}
        />
        <KartuMulai
          judul={'Makan seimbang,\ntetap menyenangkan.'}
          teks="Temukan ide sederhana untuk menikmati makanan dan mengenal isi piringmu."
          link="Inspirasi Nutrisi"
          warna={colors.purple}
          latar={colors.lavender}
          tekan="#F1E6FF"
          onPress={() => keJelajah('nutrisi')}
        />
      </Section>

      {/* Kategori */}
      <View style={styles.bleed}>
        <Awan warna={colors.orange} mulai={4} tinggi={36} />
        <View style={styles.lavender}>
          <Gradien
            stops={[
              [0, colors.orange],
              [0.3, colors.orange],
              [0.7, '#FFD2B3'],
              [1, colors.bg]
            ]}
          />
          <Teks w="medium" style={[styles.judulSeksi, { color: '#fff' }]} accessibilityRole="header">
            Sehat itu banyak bentuknya
          </Teks>
          <View style={styles.grid}>
            {KARTU_KATEGORI.map((k) => (
              <Pressable
                key={k.value}
                onPress={() => keJelajah(k.value)}
                accessibilityRole="button"
                accessibilityLabel={`${k.label}, ${k.sub}`}
                style={({ pressed }) => [styles.cat, pressed && { borderColor: colors.focusLine }]}
              >
                <View style={[styles.catIcon, { backgroundColor: k.warna }]}>
                  <Simbol id={k.simbol} size={26} />
                </View>
                <View style={{ flex: 1 }}>
                  <Teks w="medium" style={styles.catLabel}>
                    {k.label}
                  </Teks>
                  <Teks style={styles.catSub}>{k.sub}</Teks>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Target harian */}
      <Section>
        <View style={styles.target}>
          <Eyebrow style={{ color: colors.yellowInk }}>Target harianmu</Eyebrow>
          <Teks w="medium" style={styles.targetJudul}>
            Setel target yang nyaman, catat aktivitasmu, dan lihat langkah kecilmu terkumpul.
          </Teks>
          <View style={styles.targetAksi}>
            <Button title="Catat Aktivitas" size="sm" block={false} onPress={() => router.push('/aktivitas')} />
            <Button title="Atur Targetmu" variant="link" textColor={colors.ink} onPress={() => router.push('/profil')} />
          </View>
        </View>

        <View style={styles.daily}>
          <MataKartu size={30} style={styles.dailyMata} />
          <Eyebrow style={{ color: colors.purpleSoft }}>
            {`Gerakmu hari ini${user ? ` · ${formatTanggalPendek(new Date())}` : ''}`}
          </Eyebrow>
          <View style={styles.dailyTotal}>
            <Teks style={styles.dailyAngka}>{today}</Teks>
            <Teks style={styles.dailyDari}>dari {target} menit</Teks>
          </View>
          <Teks w="medium" style={styles.dailyPesan}>
            {pesan}
          </Teks>
          {user && (
            <Button
              title="Lihat riwayat & 7 hari terakhir"
              variant="linkLight"
              style={{ marginTop: 6 }}
              onPress={() => router.push('/aktivitas')}
            />
          )}
        </View>
      </Section>

      {/* Konten terbaru */}
      <Section title="Bekal baik untuk harimu">
        <View>
          {loading ? (
            <Teks style={styles.muted}>Memuat konten...</Teks>
          ) : data.terbaru.length === 0 ? (
            <Teks style={styles.muted}>Belum ada konten.</Teks>
          ) : (
            data.terbaru.map((c) => <ContentCard key={c._id} content={c} />)
          )}
          <Button title="Lihat Semua Inspirasi" variant="outline" onPress={() => keJelajah()} />
        </View>
      </Section>

      {/* Video */}
      <View style={[styles.bleed, styles.akhir]}>
        <Awan warna={colors.purple} mulai={2} tinggi={40} />
        <View style={styles.video}>
          <MataKartu size={30} style={styles.videoMata} />
          <Teks w="medium" style={[styles.judulSeksi, { color: '#fff' }]} accessibilityRole="header">
            Tonton lalu coba
          </Teks>
          <Teks style={[styles.subJudul, { color: colors.purpleSoft }]}>
            Belajar dari video edukasi yang bisa kamu praktikkan.
          </Teks>
          {!loading && data.video.length === 0 && <Teks style={{ color: colors.purpleSoft }}>Belum ada video.</Teks>}
          {data.video.map((c) => (
            <ContentCard key={c._id} content={c} polos />
          ))}
          <Button
            title="Lihat Semua Video"
            variant="light"
            style={{ marginTop: 4 }}
            onPress={() => keJelajah('video')}
          />
        </View>
      </View>
    </Screen>
  );
}

function KartuMulai({ judul, teks, link, warna, latar, tekan, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${judul.replace('\n', ' ')} ${link}`}
      style={({ pressed }) => [styles.mulai, { backgroundColor: pressed ? tekan : latar }]}
    >
      <Teks w="medium" style={styles.mulaiJudul}>
        {judul}
      </Teks>
      <Teks style={[styles.muted, { fontSize: 14, lineHeight: 21 }]}>{teks}</Teks>
      <View style={styles.mulaiLink}>
        <Teks w="semibold" style={{ color: warna, fontSize: 14 }}>
          {link}
        </Teks>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroLuar: { paddingHorizontal: space.screen, paddingTop: 8, paddingBottom: space.block },
  heroKotak: {
    backgroundColor: colors.purple,
    borderRadius: radius.block,
    padding: 24
  },
  heroClip: { ...StyleSheet.absoluteFillObject, borderRadius: radius.block, overflow: 'hidden' },
  heroRing: {
    position: 'absolute',
    right: -90,
    bottom: -110,
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 34,
    borderColor: 'rgba(255,255,255,0.07)'
  },
  halo: { color: colors.purpleSoft, fontSize: 15, lineHeight: 21, marginBottom: 8 },
  heroTeks: { color: '#EBDDFF', lineHeight: 23, marginTop: 14, marginBottom: 24, paddingRight: 12 },
  smile: { position: 'absolute' },
  muted: { color: colors.muted },
  mulai: { borderRadius: radius.card, padding: space.card, gap: 8 },
  mulaiJudul: { fontSize: 19, lineHeight: 25, letterSpacing: -0.3 },
  mulaiLink: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  bleed: { marginHorizontal: -space.screen },
  lavender: {
    marginBottom: space.section - space.block,
    paddingHorizontal: space.screen,
    paddingTop: space.heroBottom,
    paddingBottom: space.block
  },
  judulSeksi: { fontSize: type.section, lineHeight: 30, letterSpacing: -0.5, marginBottom: space.block },
  subJudul: { fontSize: 14, lineHeight: 21, marginTop: -8, marginBottom: space.block },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.list },
  cat: {
    flexBasis: '46%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 76,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff'
  },
  catIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontSize: 13, lineHeight: 17 },
  catSub: { fontSize: 11, lineHeight: 15, color: colors.muted, marginTop: 2 },
  target: { backgroundColor: colors.yellow, borderRadius: radius.block, padding: space.card, gap: 8 },
  targetJudul: { fontSize: 18, lineHeight: 26 },
  targetAksi: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.block, marginTop: 8 },
  daily: { backgroundColor: colors.purple, borderRadius: radius.block, padding: space.card },
  dailyMata: { position: 'absolute', top: space.card, right: space.card },
  dailyTotal: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 4, marginBottom: 8 },
  dailyAngka: { color: '#fff', fontSize: 56, lineHeight: 64, letterSpacing: -2 },
  dailyDari: { color: colors.purpleSoft, fontSize: 14, marginBottom: 10 },
  dailyPesan: { color: '#fff', fontSize: 15, lineHeight: 22 },
  akhir: { marginBottom: -40 },
  video: { backgroundColor: colors.purple, paddingHorizontal: space.screen, paddingTop: space.heroBottom, paddingBottom: space.section },
  videoMata: { position: 'absolute', top: space.heroBottom, right: space.screen + 4 }
});
