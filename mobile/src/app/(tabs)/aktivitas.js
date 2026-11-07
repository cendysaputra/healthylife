import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { JENIS_AKTIVITAS, formatTanggal, hariIni, labelAktivitas } from '../../lib/format';
import { colors, space } from '../../lib/theme';
import Screen, { Section } from '../../components/Screen';
import Button from '../../components/Button';
import Field from '../../components/Field';
import LoginPrompt from '../../components/LoginPrompt';

const FORM_AWAL = { type: 'jalan', duration: '', date: hariIni(), note: '' };

export default function Aktivitas() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [form, setForm] = useState(FORM_AWAL);
  const [loading, setLoading] = useState(true);
  const [simpan, setSimpan] = useState(false);
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
      <Screen>
        <LoginPrompt pesan="Masuk dulu untuk mencatat aktivitas dan melihat progres harianmu." from="/aktivitas" />
      </Screen>
    );
  }

  const ubah = (key) => (value) => setForm({ ...form, [key]: value });

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

  const handleHapus = async (id) => {
    try {
      await api.delete(`/activities/${id}`);
      await muat();
    } catch (err) {
      setError(pesanError(err));
    }
  };

  const pesanProgres = () => {
    if (!summary) return '';
    if (summary.today === 0) return 'Yuk mulai bergerak, 10 menit jalan santai sudah dihitung.';
    if (summary.remaining === 0) return 'Target hari ini tercapai. Pertahankan besok!';
    return `Sedikit lagi! Tinggal ${summary.remaining} menit untuk capai targetmu.`;
  };

  return (
    <Screen loading={loading} error={error}>
      {/* Progres hari ini */}
      {summary && (
        <Section title="Hari ini">
          <Text style={{ fontSize: 28, fontWeight: '800' }}>
            {summary.today} / {summary.target} menit
          </Text>
          <View style={{ height: 8, backgroundColor: colors.border }}>
            <View style={{ height: 8, width: `${summary.percent}%`, backgroundColor: colors.text }} />
          </View>
          <Text>{pesanProgres()}</Text>
          {summary.week.map((h) => (
            <Text key={h.date}>
              {formatTanggal(h.date)}: {h.minutes} menit
            </Text>
          ))}
        </Section>
      )}

      {/* Form catat */}
      <Section title="Catat aktivitas">
        <Text>Jenis</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.gap }}>
          {JENIS_AKTIVITAS.map((j) => (
            <Button
              key={j.value}
              title={j.label}
              variant={form.type === j.value ? 'primary' : 'outline'}
              onPress={() => ubah('type')(j.value)}
            />
          ))}
        </View>
        <Field label="Durasi (menit)" keyboardType="number-pad" value={form.duration} onChangeText={ubah('duration')} />
        <Field label="Tanggal (YYYY-MM-DD)" value={form.date} onChangeText={ubah('date')} />
        <Field label="Catatan" placeholder="Opsional" maxLength={200} value={form.note} onChangeText={ubah('note')} />
        <Button title={simpan ? 'Menyimpan...' : 'Simpan Aktivitas'} onPress={handleSimpan} disabled={simpan} />
        {pesan ? <Text>{pesan}</Text> : null}
      </Section>

      {/* Riwayat */}
      <Section title="Riwayat aktivitas">
        {riwayat.length === 0 && <Text>Belum ada aktivitas.</Text>}
        {riwayat.map((a) => (
          <View
            key={a._id}
            style={{ borderBottomWidth: 1, borderColor: colors.border, paddingVertical: space.gap, gap: 4 }}
          >
            <Text style={{ fontWeight: '600' }}>
              {labelAktivitas(a.type)} · {a.duration} menit
            </Text>
            <Text>{formatTanggal(a.date)}</Text>
            {a.note ? <Text>{a.note}</Text> : null}
            <Button title="Hapus" variant="outline" onPress={() => handleHapus(a._id)} />
          </View>
        ))}
      </Section>
    </Screen>
  );
}
