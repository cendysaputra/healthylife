import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../lib/auth';
import '../lib/reminder';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="konten/[slug]" options={{ title: 'Detail' }} />
        <Stack.Screen name="notifikasi" options={{ title: 'Notifikasi' }} />
        <Stack.Screen name="login" options={{ title: 'Masuk' }} />
        <Stack.Screen name="register" options={{ title: 'Daftar' }} />
      </Stack>
    </AuthProvider>
  );
}
