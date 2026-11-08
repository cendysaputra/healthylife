import { useCallback, useState } from 'react';
import { Alert as RNAlert, Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import {
  JENIS_AKTIVITAS,
  formatTanggal,
  formatTanggalPendek,
  hariIni,
  labelAktivitas,
  namaHari,
  pesanProgres,
  tanggalLokal
} from '../../lib/format';
import { colors, radius, space, type } from '../../lib/theme';
import Screen, { Alert, Hero, Kosong } from '../../components/Screen';
import Button from '../../components/Button';
import Field from '../../components/Field';
import LoginPrompt from '../../components/LoginPrompt';
import Select from '../../components/Select';
import Teks, { Eyebrow, Judul } from '../../components/Teks';
import Ikon, { Maskot, MataKartu, Simbol } from '../../components/Ikon';

// Ikon per jenis
const JENIS = {
  jalan: { simbol: 'cat-shoe', warna: '#FFF1C7' },
  lari: { simbol: 'move', warna: '#FFE3D1' },
  bersepeda: { simbol: 'cat-shoe', warna: '#F1E6FF' },
  gym: { simbol: 'buddy', warna: '#FFE3D1' },
  yoga: { simbol: 'mind', warna: '#F1E6FF' },
  peregangan: { simbol: 'cat-leaf', warna: '#FFF1C7' },
  lainnya: { simbol: 'bubbles', warna: '#F3EEE9' }
};

const OPSI_JENIS = JENIS_AKTIVITAS.map((j) => ({ ...j, simbol: JENIS[j.value].simbol, warna: JENIS[j.value].warna }));

const FORM_AWAL = { type: 'jalan', duration: '', date: hariIni(), note: '' };
const TINGGI_PLOT = 150;

const kemarin = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return tanggalLokal(d);
};

// Kelompok per tanggal
const kelompokkan = (items) => {
  const grup = [];
  items.forEach((a) => {
    const key = tanggalLokal(a.date);
    let g = grup.find((x) => x.key === key);
    if (!g) {
      g = { key, items: [], total: 0 };
      grup.push(g);
    }
    g.items.push(a);
    g.total += a.duration;
  });
  return grup;
};

const labelTanggal = (key) => {
  if (key === hariIni()) return 'Hari ini';
  if (key === kemarin()) return 'Kemarin';
  return formatTanggal(key);
};

const JudulHero = () => (
  <Judul size={type.page} aksen="tetap maju.">
    {'Sedikit demi sedikit,\n'}
  </Judul>
);

export default function Aktivitas() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [form, setForm] = useState(FORM_AWAL);
  const [loading, setLoading] = useState(true);
  const [simpan, setSimpan] = useState(false);
  const [hapusId, setHapusId] = useState(null);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');

  const muat = useCallback(async () => {
    if (!user) return setLoading(false);
    try {
      const [s, r] = await Promise.all([api.get('/activities/summary'), api.get('/activities')]);
      setSummary(s.data);
      setRiwayat(r.data.items);
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Muat saat fokus
  useFocusEffect(
    useCallback(() => {
      muat();
    }, [muat])
  );

  if (!user) {
    return (
      <Screen
        hero={
          <Hero style={styles.hero}>
            <JudulHero />
            <Teks style={styles.heroTeks}>Catat gerakmu setiap hari dan lihat langkah kecilmu terkumpul.</Teks>
          </Hero>
        }
      >
        <View>
          <LoginPrompt pesan="Masuk dulu untuk mencatat aktivitas dan melihat progres harianmu." from="/aktivitas" />
        </View>
      </Screen>
    );
  }

  const ubah = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSimpan = async () => {
    setError('');
    setPesan('');
    setSimpan(true);
    try {
      await api.post('/activities', { ...form, duration: Number(form.duration) });
      setForm({ ...FORM_AWAL, date: hariIni() });
      setPesan('Aktivitas tersimpan.');
      await muat();
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setSimpan(false);
    }
  };

  const hapus = async (id) => {
    setError('');
    setPesan('');
    setHapusId(id);
    try {
      await api.delete(`/activities/${id}`);
      setPesan('Aktivitas dihapus.');
      await muat();
    } catch (err) {
      setError(pesanError(err));
    } finally {
      setHapusId(null);
    }
  };

  const konfirmasiHapus = (a) =>
    RNAlert.alert('Hapus aktivitas?', `${labelAktivitas(a.type)} ${a.duration} menit, ${formatTanggal(a.date)}`, [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => hapus(a._id) }
    ]);

  const today = summary?.today ?? 0;
  const target = summary?.target ?? user.dailyTarget ?? 30;
  const percent = summary?.percent ?? 0;
  const week = summary?.week ?? [];
  const maks = Math.max(target, ...week.map((h) => h.minutes), 1);
  const totalMinggu = week.reduce((n, h) => n + h.minutes, 0);
  const hariTercapai = week.filter((h) => h.minutes >= target).length;
  const rataRata = week.length ? Math.round(totalMinggu / week.length) : 0;
  const grup = kelompokkan(riwayat);

  return (
    <Screen
      hero={
        <Hero style={styles.hero}>
          <JudulHero />
          <View style={styles.today}>
            <MataKartu size={30} style={styles.todayMata} />
            <Eyebrow style={{ color: colors.purpleSoft }}>
              {`Gerakmu hari ini · ${formatTanggalPendek(new Date())}`}
            </Eyebrow>
            <View style={styles.todayTotal}>
              <Teks style={styles.todayAngka}>{loading ? '-' : today}</Teks>
              <Teks style={styles.todayDari}>dari {target} menit</Teks>
            </View>
            <View
              style={styles.progress}
              accessibilityRole="progressbar"
              accessibilityLabel="Progres target harian"
              accessibilityValue={{ min: 0, max: 100, now: percent }}
            >
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
            <View style={styles.todayFoot}>
              <Teks w="medium" style={styles.todayPesan}>
                {summary ? pesanProgres(summary) : 'Memuat progresmu...'}
              </Teks>
              <Teks w="semibold" style={styles.todayPersen}>
                {percent}%
              </Teks>
            </View>
          </View>
        </Hero>
      }
    >
      {error ? <Alert>{error}</Alert> : null}

      {/* 7 hari terakhir */}
      <View style={styles.stats}>
        <Maskot varian="putih" size={42} style={styles.statsMaskot} />
        <Eyebrow style={{ color: colors.yellowInk }}>7 hari terakhir</Eyebrow>
        <Teks w="medium" style={styles.kartuJudul}>
          Lihat langkahmu terkumpul.
        </Teks>
        <View style={styles.statList}>
          {[
            ['Total minggu ini', totalMinggu, 'menit'],
            ['Target tercapai', hariTercapai, '/7 hari'],
            ['Rata-rata', rataRata, 'mnt/hari']
          ].map(([label, nilai, unit]) => (
            <View key={label} style={styles.stat}>
              <Teks style={styles.statLabel}>{label}</Teks>
              <Teks w="medium" style={styles.statNilai}>
                {loading ? '-' : nilai}
                <Teks style={styles.statUnit}> {unit}</Teks>
              </Teks>
            </View>
          ))}
        </View>
        <Button
          title={`Atur targetmu (${target} menit/hari)`}
          variant="link"
          textColor={colors.ink}
          onPress={() => router.push('/profil')}
        />
      </View>

      {/* Grafik */}
      <View style={styles.chart}>
        <Teks w="semibold" style={styles.chartJudul}>
          Menit bergerak per hari
        </Teks>
        <View style={styles.legend}>
          <View style={[styles.dot, { backgroundColor: colors.purple }]} />
          <Teks style={styles.legendTeks}>Tercapai</Teks>
          <View style={[styles.dot, { backgroundColor: colors.barSoft, marginLeft: 12 }]} />
          <Teks style={styles.legendTeks}>Belum</Teks>
        </View>

        <View style={styles.plot}>
          <View style={[styles.targetLine, { bottom: (target / maks) * TINGGI_PLOT }]} pointerEvents="none">
            <Teks w="medium" style={styles.targetLabel}>
              Target {target}
            </Teks>
          </View>
          {week.map((h) => {
            const tercapai = h.minutes >= target;
            return (
              <View
                key={h.date}
                style={styles.barCol}
                accessible
                accessibilityLabel={`${formatTanggal(h.date)}: ${h.minutes} menit`}
              >
                <Teks w="semibold" style={styles.barAngka}>
                  {h.minutes}
                </Teks>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max((h.minutes / maks) * TINGGI_PLOT, 6),
                      backgroundColor: tercapai ? colors.purple : colors.barSoft
                    }
                  ]}
                />
              </View>
            );
          })}
        </View>
        <View style={styles.days}>
          {week.map((h, i) => {
            const isToday = i === week.length - 1;
            return (
              <Teks
                key={h.date}
                w={isToday ? 'semibold' : 'regular'}
                style={[styles.day, isToday && { color: colors.purple }]}
                numberOfLines={1}
              >
                {isToday ? 'Hari ini' : namaHari(h.date)}
              </Teks>
            );
          })}
        </View>
      </View>

      {/* Form catat */}
      <View style={styles.form}>
        <Maskot varian="lavender" size={44} style={styles.formMaskot} />
        <Eyebrow style={{ color: colors.purple }}>Catat gerakmu</Eyebrow>
        <Teks w="medium" style={[styles.kartuJudul, { paddingRight: 40 }]}>
          Apa yang kamu lakukan hari ini?
        </Teks>

        <View style={{ gap: 8 }}>
          <Teks w="medium" style={styles.label}>
            Jenis aktivitas
          </Teks>
          <Select
            value={form.type}
            options={OPSI_JENIS}
            onChange={ubah('type')}
            label="Jenis aktivitas"
            ikonTombol="opsi"
          />
        </View>
        <Field
          label="Durasi (menit)"
          keyboardType="number-pad"
          placeholder="Contoh: 15"
          maxLength={3}
          value={form.duration}
          onChangeText={ubah('duration')}
        />
        <View style={{ gap: 8 }}>
          <Field label="Tanggal (YYYY-MM-DD)" value={form.date} onChangeText={ubah('date')} maxLength={10} />
          <View style={styles.tglCepat}>
            {[
              ['Hari ini', hariIni()],
              ['Kemarin', kemarin()]
            ].map(([label, nilai]) => (
              <Pressable
                key={label}
                onPress={() => ubah('date')(nilai)}
                accessibilityRole="button"
                accessibilityState={{ selected: form.date === nilai }}
                style={[styles.tglChip, form.date === nilai && styles.tglChipOn]}
              >
                <Teks w="medium" style={[styles.tglTeks, form.date === nilai && { color: colors.purple }]}>
                  {label}
                </Teks>
              </Pressable>
            ))}
          </View>
        </View>
        <Field label="Catatan" placeholder="Opsional" maxLength={200} value={form.note} onChangeText={ubah('note')} />
        <Button
          title={simpan ? 'Menyimpan...' : 'Simpan Aktivitas'}
          onPress={handleSimpan}
          disabled={simpan || !form.duration}
          style={{ marginTop: 4 }}
        />
        {pesan ? <Alert tipe="success">{pesan}</Alert> : null}
      </View>

      {/* Riwayat */}
      <View style={styles.riwayatHead}>
        <Eyebrow style={{ color: colors.purple }}>Catatanmu</Eyebrow>
        <Teks w="medium" style={styles.riwayatJudul} accessibilityRole="header">
          Riwayat aktivitas
        </Teks>
        {riwayat.length > 0 && <Teks style={styles.muted}>{riwayat.length} catatan terbaru</Teks>}
      </View>

      {!loading && riwayat.length === 0 && (
        <Kosong
          varian="ungu"
          judul="Belum ada aktivitas."
          teks="Catat aktivitas pertamamu lewat form di atas. Riwayatnya muncul di sini."
        />
      )}

      {grup.map((g) => (
        <View key={g.key} style={styles.hari}>
          <View style={styles.hariHead}>
            <Teks w="semibold">{labelTanggal(g.key)}</Teks>
            <Teks style={styles.muted}>{g.total} menit</Teks>
          </View>
          {g.items.map((a) => {
            const jenis = JENIS[a.type] || JENIS.lainnya;
            return (
              <View key={a._id} style={styles.item}>
                <View style={[styles.itemIkon, { backgroundColor: jenis.warna }]}>
                  <Simbol id={jenis.simbol} size={26} />
                </View>
                <View style={styles.itemMain}>
                  <Teks w="semibold">{labelAktivitas(a.type)}</Teks>
                  {a.note ? (
                    <Teks style={styles.itemNote} numberOfLines={2}>
                      {a.note}
                    </Teks>
                  ) : null}
                </View>
                <Teks w="medium" style={styles.itemDurasi}>
                  {a.duration} mnt
                </Teks>
                <Pressable
                  onPress={() => konfirmasiHapus(a)}
                  disabled={hapusId === a._id}
                  accessibilityRole="button"
                  accessibilityLabel={`Hapus ${labelAktivitas(a.type)} ${a.duration} menit, ${formatTanggal(a.date)}`}
                  hitSlop={6}
                  style={({ pressed }) => [styles.itemHapus, pressed && { backgroundColor: colors.lavender }]}
                >
                  <Ikon name="close" size={18} color={colors.muted} />
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.heroTop, paddingBottom: space.heroBottom },
  heroTeks: { color: colors.muted, lineHeight: 23, marginTop: 12 },
  muted: { color: colors.muted },
  today: { marginTop: space.card, backgroundColor: colors.purple, borderRadius: radius.block, padding: space.card },
  todayMata: { position: 'absolute', top: 20, right: 22 },
  todayTotal: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 4 },
  todayAngka: { color: '#fff', fontSize: 52, lineHeight: 60, letterSpacing: -2 },
  todayDari: { color: colors.purpleSoft, fontSize: 14, marginBottom: 10 },
  progress: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    marginTop: 12
  },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: colors.yellow },
  todayFoot: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 14 },
  todayPesan: { color: '#fff', flex: 1, fontSize: 14, lineHeight: 21 },
  todayPersen: { color: colors.yellow, fontSize: 16 },
  stats: { backgroundColor: colors.yellow, borderRadius: radius.block, padding: space.card, gap: 8 },
  statsMaskot: { position: 'absolute', top: -14, right: 22 },
  kartuJudul: { fontSize: 20, lineHeight: 26, letterSpacing: -0.3, marginBottom: 10 },
  statList: { flexDirection: 'row', gap: 10, marginBottom: 6 },
  stat: { flex: 1, gap: 2 },
  statLabel: { fontSize: 11, lineHeight: 15, color: colors.yellowInk },
  statNilai: { fontSize: 24, lineHeight: 30 },
  statUnit: { fontSize: 11, color: colors.yellowInk },
  chart: {
    marginTop: space.block,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.block,
    padding: space.card,
    backgroundColor: '#fff'
  },
  chartJudul: { fontSize: 15, lineHeight: 21 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, marginBottom: 20 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendTeks: { fontSize: 12, lineHeight: 16, color: colors.muted },
  plot: {
    height: TINGGI_PLOT + 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: colors.orange,
    opacity: 0.6
  },
  targetLabel: {
    position: 'absolute',
    right: 0,
    bottom: 3,
    fontSize: 11,
    lineHeight: 14,
    color: colors.orange
  },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  barAngka: { fontSize: 11, lineHeight: 14, color: colors.muted },
  bar: { width: '100%', maxWidth: 34, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderRadius: 6 },
  days: { flexDirection: 'row', gap: 6, marginTop: 8 },
  day: { flex: 1, textAlign: 'center', fontSize: 11, lineHeight: 14, color: colors.muted },
  form: { marginTop: space.block, backgroundColor: colors.lavender, borderRadius: radius.block, padding: space.card, gap: space.block },
  formMaskot: { position: 'absolute', top: -16, right: 22 },
  label: { fontSize: 13, lineHeight: 18 },
  tglCepat: { flexDirection: 'row', gap: 8 },
  tglChip: {
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.inputLine,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  tglChipOn: { borderColor: colors.focusLine, backgroundColor: colors.lavender },
  tglTeks: { fontSize: 13, lineHeight: 18 },
  riwayatHead: { marginTop: space.section, marginBottom: space.block, gap: 4 },
  riwayatJudul: { fontSize: 24, lineHeight: 30, letterSpacing: -0.5 },
  hari: { marginBottom: space.card, gap: space.list },
  hariHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    backgroundColor: '#fff'
  },
  itemIkon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  itemMain: { flex: 1, gap: 2 },
  itemNote: { fontSize: 13, lineHeight: 19, color: colors.muted },
  itemDurasi: { fontSize: 13, color: colors.purple },
  itemHapus: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }
});
