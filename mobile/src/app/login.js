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

export default function Login() {
  const { from } = useLocalSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [proses, setProses] = useState(false);
  const [error, setError] = useState('');

  const handleMasuk = async () => {
    setError('');
    setProses(true);
    try {
      await login(email.trim(), password);
      // Kembali ke asal
      if (from) router.replace(from);
      else router.back();
    } catch (err) {
      setError(pesanError(err));
      setProses(false);
    }
  };

  return (
    <AuthLayout
      judul={'Masuk, lalu\n'}
      aksen="lanjutkan ritmemu."
      deskripsi={
        from
          ? 'Masuk dulu untuk melanjutkan. Setelah itu kamu langsung kembali ke halaman tadi.'
          : 'Catat aktivitas harian, pantau target, dan buka lagi konten favoritmu.'
      }
      kartuJudul="Masuk"
      header="Masuk"
      error={error}
    >
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={handleMasuk}
      />
      <Button title={proses ? 'Memproses...' : 'Masuk'} onPress={handleMasuk} disabled={proses} />
      <View style={styles.footer}>
        <Teks style={styles.footerTeks}>Belum punya akun?</Teks>
        <Button
          title="Daftar gratis"
          variant="link"
          onPress={() => router.replace({ pathname: '/register', params: from ? { from } : {} })}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerTeks: { color: colors.muted, fontSize: 14 }
});
