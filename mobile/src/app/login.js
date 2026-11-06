import { useState } from 'react';
import { Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { pesanError } from '../lib/api';
import { useAuth } from '../lib/auth';
import Screen, { Section } from '../components/Screen';
import Field from '../components/Field';
import Button from '../components/Button';

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
      // Kembali ke layar asal kalau ada
      if (from) router.replace(from);
      else router.back();
    } catch (err) {
      setError(pesanError(err));
      setProses(false);
    }
  };

  return (
    <Screen error={error}>
      <Section>
        {from ? <Text>Masuk dulu untuk melanjutkan.</Text> : null}
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" />
        <Button title={proses ? 'Memproses...' : 'Masuk'} onPress={handleMasuk} disabled={proses} />
        <Button title="Belum punya akun? Daftar" variant="outline" onPress={() => router.replace({ pathname: '/register', params: from ? { from } : {} })} />
      </Section>
    </Screen>
  );
}
