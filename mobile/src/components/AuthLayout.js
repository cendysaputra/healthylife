import { StyleSheet, View } from 'react-native';
import { colors, space, type } from '../lib/theme';
import Screen, { Alert, Hero } from './Screen';
import Teks, { Judul } from './Teks';
import { Maskot } from './Ikon';
import { kartuStyle } from './LoginPrompt';

// Kerangka masuk/daftar
export default function AuthLayout({ judul, aksen, deskripsi, kartuJudul, header, error, children }) {
  return (
    <Screen
      header={header}
      hero={
        <Hero style={styles.hero}>
          <Judul size={type.page} aksen={aksen}>
            {judul}
          </Judul>
          <Teks style={styles.deskripsi}>{deskripsi}</Teks>
        </Hero>
      }
    >
      <View style={styles.kartu}>
        <Maskot varian="krem" size={50} style={styles.maskot} />
        <Teks w="medium" style={styles.kartuJudul} accessibilityRole="header">
          {kartuJudul}
        </Teks>
        {error ? <Alert>{error}</Alert> : null}
        {children}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.heroTop, paddingBottom: 72 },
  deskripsi: { color: colors.muted, lineHeight: 23, marginTop: 12 },
  kartu: { ...kartuStyle, marginTop: -72, gap: space.block },
  maskot: { position: 'absolute', top: -24, right: 24 },
  kartuJudul: { fontSize: 24, lineHeight: 30, letterSpacing: -0.5, marginBottom: 2 }
});
