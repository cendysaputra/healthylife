import { useCallback, useEffect, useState } from 'react';
import { Alert as RNAlert, Linking, StyleSheet, Switch, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { useFavorites } from '../../lib/favorites';
import { aktifkanPengingat, cekPengingat, matikanPengingat } from '../../lib/reminder';
import { formatTanggalPanjang } from '../../lib/format';
import { colors, radius, space, type } from '../../lib/theme';
import Screen, { Alert, Hero, Kosong, LinkAksi, Section } from '../../components/Screen';
import Button from '../../components/Button';
import Field from '../../components/Field';
import ContentCard from '../../components/ContentCard';
import LoginPrompt from '../../components/LoginPrompt';
import Teks, { Eyebrow, Judul } from '../../components/Teks';
import Ikon, { Maskot } from '../../components/Ikon';

const JudulHero = () => (
  <Judul size={type.page} aksen="tersimpan di sini.">
    {'Langkah kecilmu,\n'}
  </Judul>
);

export default function Profil() {
  const { user, setUser, logout } = useAuth();
  const { items: favorit, loading: loadingFav, reload } = useFavorites();
  const [target, setTarget] = useState('');
  const [simpan, setSimpan] = useState(false);
  const [pengingat, setPengingat] = useState(false);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');
  const [pesanPengingat, setPesanPengingat] = useState('');

  useEffect(() => {
    if (user) setTarget(String(user.dailyTarget));
    cekPengingat()
      .then(setPengingat)
      .catch(() => {});
  }, [user]);

  // Segarkan favorit
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  if (!user) {
    return (
      <Screen
        hero={
          <Hero style={styles.hero}>
            <JudulHero />
            <Teks style={styles.heroTeks}>Target, pengingat, dan bacaan favoritmu.</Teks>
          </Hero>
        }
      >
        <View>
          <LoginPrompt pesan="Masuk untuk melihat profil, target harian, dan konten favoritmu." from="/profil" />
        </View>
      </Screen>
    );
  }

  const namaDepan = user.name?.split(' ')[0] || user.name;

  const simpanTarget = async () => {
    setError('');
    setPesan('');
    setSimpan(true);
    try {
      const { data } = await api.put('/users/target', { dailyTarget: Number(target) });
      setUser({ ...user, dailyTarget: data.dailyTarget });
      setPesan('Target harian diperbarui.');
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setSimpan(false);
    }
  };

  const ubahPengingat = async (nyala) => {
    setError('');
    if (nyala) {
      const hasil = await aktifkanPengingat();
      setPengingat(hasil.ok);
      if (hasil.ok) return setPesanPengingat('Pengingat aktif. Kami ingatkan setiap jam 19.00.');
      if (hasil.keSetelan) {
        RNAlert.alert('Izin notifikasi', hasil.pesan, [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Buka Pengaturan', onPress: () => Linking.openSettings() }
        ]);
      } else {
        setError(hasil.pesan);
      }
    } else {
      await matikanPengingat();
      setPengingat(false);
      setPesanPengingat('');
    }
  };

  return (
    <Screen
      hero={
        <Hero style={styles.hero}>
          <Teks w="medium" style={styles.halo}>
            Halo, {namaDepan}
          </Teks>
          <JudulHero />
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Teks w="medium" style={styles.avatarHuruf}>
                {user.name?.charAt(0).toUpperCase()}
              </Teks>
              <Maskot varian="kuning" size={34} style={styles.avatarMaskot} />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={styles.chip}>
                <View style={styles.chipDot} />
                <Teks w="medium" style={styles.chipTeks}>
                  Target {user.dailyTarget} menit/hari
                </Teks>
              </View>
              <View style={styles.chip}>
                <Ikon name="bell" size={16} color={colors.purple} />
                <Teks w="medium" style={styles.chipTeks}>
                  {pengingat ? 'Pengingat 19.00 aktif' : 'Pengingat mati'}
                </Teks>
              </View>
            </View>
          </View>
        </Hero>
      }
    >
      {error ? <Alert>{error}</Alert> : null}

      {/* Data akun */}
      <View style={[styles.card, styles.akun]}>
        <Eyebrow style={{ color: colors.purple }}>Akun</Eyebrow>
        <Teks w="medium" style={styles.cardJudul}>
          Tentang kamu
        </Teks>
        {[
          ['Nama', user.name],
          ['Email', user.email],
          user.createdAt ? ['Bergabung', formatTanggalPanjang(user.createdAt)] : null
        ]
          .filter(Boolean)
          .map(([k, v], i) => (
            <View key={k} style={[styles.dataRow, i > 0 && styles.dataLine]}>
              <Teks style={styles.dataKey}>{k}</Teks>
              <Teks w="medium" style={styles.dataVal} numberOfLines={1}>
                {v}
              </Teks>
            </View>
          ))}
        <Button title="Keluar dari akun" variant="outline" onPress={logout} style={{ marginTop: 10 }} />
      </View>

      {/* Target harian */}
      <View style={[styles.card, styles.target]}>
        <Eyebrow style={{ color: colors.yellowInk }}>Target harian</Eyebrow>
        <Teks w="medium" style={styles.cardJudul}>
          Bergerak {user.dailyTarget} menit setiap hari.
        </Teks>
        <Field
          label="Target (menit)"
          keyboardType="number-pad"
          maxLength={3}
          value={target}
          onChangeText={setTarget}
          hint="Mulai dari angka yang terasa ringan, misalnya 15-30 menit."
        />
        <Button title={simpan ? 'Menyimpan...' : 'Simpan Target'} onPress={simpanTarget} disabled={simpan} />
        {pesan ? <Alert tipe="success">{pesan}</Alert> : null}
        <Button
          title="Lihat aktivitasmu"
          variant="link"
          textColor={colors.ink}
          onPress={() => router.push('/aktivitas')}
        />
      </View>

      {/* Pengingat lokal */}
      <View style={[styles.card, styles.pengingat]}>
        <Eyebrow style={{ color: colors.purpleSoft }}>Pengingat</Eyebrow>
        <View style={styles.switchRow}>
          <Teks w="medium" style={styles.pengingatTeks}>
            Ingatkan catat aktivitas setiap jam 19.00
          </Teks>
          <Switch
            value={pengingat}
            onValueChange={ubahPengingat}
            accessibilityLabel="Pengingat harian"
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: colors.yellow }}
            thumbColor="#fff"
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
        </View>
        {pesanPengingat ? (
          <Teks w="medium" style={styles.pengingatInfo}>
            {pesanPengingat}
          </Teks>
        ) : null}
      </View>

      {/* Favorit */}
      <Section
        title="Favoritmu."
        style={{ marginTop: space.section - space.block, marginBottom: 0 }}
        aksi={
          <LinkAksi
            title="Cari konten lain"
            onPress={() => router.push({ pathname: '/jelajah', params: { kategori: '' } })}
          />
        }
      >
        <View>
          {loadingFav && favorit.length === 0 ? (
            <Teks style={{ color: colors.muted }}>Memuat favorit...</Teks>
          ) : favorit.length === 0 ? (
            <Kosong
              judul="Belum ada konten favorit."
              teks="Tekan ikon bookmark di kartu atau di halaman konten untuk menyimpannya di sini."
            />
          ) : (
            favorit.map((c) => <ContentCard key={c._id} content={c} />)
          )}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.heroTop, paddingBottom: space.heroBottom },
  heroTeks: { color: colors.muted, lineHeight: 23, marginTop: 12 },
  halo: { color: colors.purple, fontSize: 16, lineHeight: 22, marginBottom: 10 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: space.block, marginTop: space.card },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: colors.creamRing
  },
  avatarHuruf: { color: '#fff', fontSize: 36, lineHeight: 44 },
  avatarMaskot: { position: 'absolute', right: -14, bottom: -10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: '#fff'
  },
  chipDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange },
  chipTeks: { fontSize: 12, lineHeight: 16 },
  card: { borderRadius: radius.block, padding: space.card, gap: 10, marginBottom: space.block },
  cardJudul: { fontSize: 20, lineHeight: 26, letterSpacing: -0.3, marginBottom: 6 },
  akun: { borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff' },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 10 },
  dataLine: { borderTopWidth: 1, borderTopColor: colors.line },
  dataKey: { color: colors.muted, fontSize: 14 },
  dataVal: { flexShrink: 1, textAlign: 'right', fontSize: 14 },
  target: { backgroundColor: colors.yellow, gap: space.inner },
  pengingat: { backgroundColor: colors.purple },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  pengingatInfo: { color: colors.yellow, fontSize: 13, lineHeight: 19 },
  pengingatTeks: { color: '#fff', flex: 1, fontSize: 16, lineHeight: 23 }
});
