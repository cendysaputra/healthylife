import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { pesanError } from '../lib/api';
import { useAuth } from '../lib/auth';
import { colors } from '../lib/theme';
import AuthLayout from '../components/AuthLayout';
import Field from '../components/Field';
import Button from '../components/Button';
import Teks from '../components/Teks';

export default function Register() {
  const { from } = useLocalSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', konfirmasi: '' });
  const [proses, setProses] = useState(false);
  const [error, setError] = useState('');

  const ubah = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleDaftar = async () => {
    setError('');
    if (form.password.length < 8) return setError('Password minimal 8 karakter.');
    if (form.password !== form.konfirmasi) return setError('Konfirmasi password tidak sama.');

    setProses(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      if (from) router.replace(from);
      else router.back();
    } catch (err) {
      setError(pesanError(err));
      setProses(false);
    }
  };

  return (
    <AuthLayout
      judul={'Satu akun,\n'}
      aksen="banyak langkah baik."
      deskripsi="Buat akun gratis untuk mencatat aktivitas, memantau target, dan menyimpan konten favorit."
      kartuJudul="Daftar gratis"
      header="Daftar"
      error={error}
    >
      <Field
        label="Nama"
        value={form.name}
        onChangeText={ubah('name')}
        placeholder="Nama panggilanmu"
        autoComplete="name"
        textContentType="name"
      />
      <Field
        label="Email"
        value={form.email}
        onChangeText={ubah('email')}
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <Field
        label="Password"
        value={form.password}
        onChangeText={ubah('password')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <Field
        label="Konfirmasi"
        value={form.konfirmasi}
        onChangeText={ubah('konfirmasi')}
        secureTextEntry
        hint="Password minimal 8 karakter."
        returnKeyType="go"
        onSubmitEditing={handleDaftar}
      />
      <Button title={proses ? 'Memproses...' : 'Daftar'} onPress={handleDaftar} disabled={proses} />
      <View style={styles.footer}>
        <Teks style={styles.footerTeks}>Sudah punya akun?</Teks>
        <Button
          title="Masuk"
          variant="link"
          onPress={() => router.replace({ pathname: '/login', params: from ? { from } : {} })}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerTeks: { color: colors.muted, fontSize: 14 }
});
