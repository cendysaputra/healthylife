import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
// Impor per berat
import { IBMPlexSans_400Regular } from '@expo-google-fonts/ibm-plex-sans/400Regular';
import { IBMPlexSans_500Medium } from '@expo-google-fonts/ibm-plex-sans/500Medium';
import { IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans/600SemiBold';
import { IBMPlexSans_700Bold } from '@expo-google-fonts/ibm-plex-sans/700Bold';
import { AuthProvider } from '../lib/auth';
import { FavoritesProvider } from '../lib/favorites';
import { colors } from '../lib/theme';
import '../lib/reminder';

export default function RootLayout() {
  const [fontSiap, fontError] = useFonts({
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold
  });

  // Tunggu font
  if (!fontSiap && !fontError) return <View style={{ flex: 1, backgroundColor: colors.cream }} />;

  return (
    <AuthProvider>
      <FavoritesProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="konten/[slug]" />
          <Stack.Screen name="notifikasi" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack>
      </FavoritesProvider>
    </AuthProvider>
  );
}
