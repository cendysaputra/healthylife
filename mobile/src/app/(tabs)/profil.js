import { useCallback, useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import api, { pesanError } from '../../lib/api';
import { useAuth } from '../../lib/auth';
import { aktifkanPengingat, cekPengingat, matikanPengingat } from '../../lib/reminder';
import { formatTanggal } from '../../lib/format';
import { space } from '../../lib/theme';
import Screen, { Section } from '../../components/Screen';
import Button from '../../components/Button';
import Field from '../../components/Field';
import ContentCard from '../../components/ContentCard';
import LoginPrompt from '../../components/LoginPrompt';

export default function Profil() {
  const { user, setUser, logout } = useAuth();
  const [favorit, setFavorit] = useState([]);
  const [target, setTarget] = useState('');
  const [pengingat, setPengingat] = useState(false);
  const [error, setError] = useState('');
  const [pesan, setPesan] = useState('');

  useEffect(() => {
    if (user) setTarget(String(user.dailyTarget));
    cekPengingat().then(setPengingat).catch(() => {});
  }, [user]);

  // Ambil favorit setiap tab dibuka
  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      api.get('/favorites').then(({ data }) => setFavorit(data.items)).catch((err) => setError(pesanError(err)));
    }, [user])
  );

  if (!user) {
    return (
      <Screen>
        <LoginPrompt pesan="Masuk untuk melihat profil, target harian, dan konten favoritmu." from="/profil" />
      </Screen>
    );
  }

  const simpanTarget = async () => {
    setError('');
    setPesan('');
    try {
      const { data } = await api.put('/users/target', { dailyTarget: Number(target) });
      setUser({ ...user, dailyTarget: data.dailyTarget });
      setPesan('Target harian diperbarui.');
    } catch (err) {
      setError(pesanError(err));
    }
  };

  const ubahPengingat = async (nyala) => {
    if (nyala) {
      const ok = await aktifkanPengingat();
      setPengingat(ok);
      if (!ok) setError('Izin notifikasi ditolak. Aktifkan di pengaturan HP.');
    } else {
      await matikanPengingat();
      setPengingat(false);
    }
  };

  const hapusFavorit = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorit((list) => list.filter((f) => f._id !== id));
    } catch (err) {
      setError(pesanError(err));
    }
  };

  return (
    <Screen error={error}>
      {/* Data akun */}
      <Section title="Akun">
        <Text>Nama: {user.name}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Bergabung: {formatTanggal(user.createdAt)}</Text>
      </Section>

      {/* Target harian */}
      <Section title="Target harian">
        <Field label="Target (menit)" keyboardType="number-pad" value={target} onChangeText={setTarget} />
        <Button title="Simpan Target" onPress={simpanTarget} />
        {pesan ? <Text>{pesan}</Text> : null}
      </Section>

      {/* Pengingat lokal */}
      <Section title="Pengingat">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.gap }}>
          <Text style={{ flex: 1 }}>Ingatkan catat aktivitas setiap jam 19.00</Text>
          <Switch value={pengingat} onValueChange={ubahPengingat} accessibilityLabel="Pengingat harian" />
        </View>
      </Section>

      {/* Favorit */}
      <Section title="Favorit">
        {favorit.length === 0 && <Text>Belum ada konten favorit.</Text>}
        {favorit.map((c) => (
          <View key={c._id}>
            <ContentCard content={c} />
            <Button title="Hapus dari Favorit" variant="outline" onPress={() => hapusFavorit(c._id)} />
          </View>
        ))}
      </Section>

      <Button title="Keluar" variant="outline" onPress={logout} />
    </Screen>
  );
}
