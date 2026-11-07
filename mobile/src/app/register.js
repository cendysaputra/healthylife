import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { pesanError } from '../lib/api';
import { useAuth } from '../lib/auth';
import Screen, { Section } from '../components/Screen';
import Field from '../components/Field';
import Button from '../components/Button';

export default function Register() {
  const { from } = useLocalSearchParams();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', konfirmasi: '' });
  const [proses, setProses] = useState(false);
  const [error, setError] = useState('');

  const ubah = (key) => (value) => setForm({ ...form, [key]: value });

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
    <Screen error={error}>
      <Section>
        <Field label="Nama" value={form.name} onChangeText={ubah('name')} autoComplete="name" />
        <Field
          label="Email"
          value={form.email}
          onChangeText={ubah('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Field label="Password" value={form.password} onChangeText={ubah('password')} secureTextEntry />
        <Field label="Konfirmasi password" value={form.konfirmasi} onChangeText={ubah('konfirmasi')} secureTextEntry />
        <Button title={proses ? 'Memproses...' : 'Daftar'} onPress={handleDaftar} disabled={proses} />
        <Button
          title="Sudah punya akun? Masuk"
          variant="outline"
          onPress={() => router.replace({ pathname: '/login', params: from ? { from } : {} })}
        />
      </Section>
    </Screen>
  );
}
