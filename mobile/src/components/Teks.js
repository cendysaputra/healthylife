import { StyleSheet, Text } from 'react-native';
import { colors, fonts, type } from '../lib/theme';

// Teks dengan font IBM Plex Sans
export default function Teks({ w = 'regular', style, ...props }) {
  return <Text {...props} style={[styles.base, { fontFamily: fonts[w] }, style]} />;
}

// Judul besar ala hero web
export function Judul({ children, aksen, warnaAksen = colors.orange, size = type.page, style }) {
  return (
    <Teks
      w="medium"
      accessibilityRole="header"
      style={[styles.judul, { fontSize: size, lineHeight: Math.round(size * 1.14) }, style]}
    >
      {children}
      {aksen ? <Text style={{ color: warnaAksen }}>{aksen}</Text> : null}
    </Teks>
  );
}

export function Eyebrow({ children, style }) {
  return <Teks style={[styles.eyebrow, style]}>{children}</Teks>;
}

const styles = StyleSheet.create({
  base: { color: colors.ink, fontSize: type.body, lineHeight: 23 },
  judul: { letterSpacing: -0.6, color: colors.ink },
  eyebrow: { fontSize: 12, letterSpacing: 0.6, lineHeight: 18, textTransform: 'uppercase', color: colors.muted }
});
