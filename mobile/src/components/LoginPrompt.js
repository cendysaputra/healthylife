import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius, space } from '../lib/theme';
import Button from './Button';
import Teks from './Teks';
import { Maskot } from './Ikon';

// Ajakan login
export default function LoginPrompt({ judul = 'Masuk dulu, yuk.', pesan, from }) {
  return (
    <View style={styles.card}>
      <Maskot varian="krem" size={50} style={styles.maskot} />
      <Teks w="medium" style={styles.judul}>
        {judul}
      </Teks>
      <Teks style={styles.pesan}>{pesan}</Teks>
      <Button title="Masuk" onPress={() => router.push({ pathname: '/login', params: { from } })} />
      <Button
        title="Daftar gratis"
        variant="outline"
        onPress={() => router.push({ pathname: '/register', params: { from } })}
      />
    </View>
  );
}

export const kartuStyle = {
  backgroundColor: '#fff',
  borderRadius: radius.card,
  padding: space.card,
  gap: space.inner,
  shadowColor: '#5A3E1B',
  shadowOpacity: 0.1,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 12 },
  elevation: 4
};

const styles = StyleSheet.create({
  card: kartuStyle,
  maskot: { position: 'absolute', top: -22, right: 22 },
  judul: { fontSize: 22, lineHeight: 28, letterSpacing: -0.4, marginTop: 4 },
  pesan: { color: colors.muted, fontSize: 14, lineHeight: 21, marginBottom: 6 }
});
