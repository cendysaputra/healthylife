import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, fonts } from '../lib/theme';
import Teks from './Teks';
import Ikon from './Ikon';
import BellButton from './BellButton';

// Logo teks
export function Logo({ size = 26, light = false }) {
  return (
    <Text
      style={{ fontSize: size, lineHeight: Math.round(size * 1.25), letterSpacing: -0.7 }}
      accessibilityLabel="HealthyLife"
    >
      <Text style={{ fontFamily: fonts.medium, color: colors.orange }}>Healthy</Text>
      <Text style={{ fontFamily: fonts.bold, color: light ? '#fff' : colors.purple }}>Life.</Text>
    </Text>
  );
}

// Header tab
export function TabHeader() {
  return (
    <View style={styles.bar}>
      <View style={styles.logoWrap}>
        <View style={styles.logoDot} />
        <Logo />
      </View>
      <BellButton />
    </View>
  );
}

const kembali = () => (router.canGoBack() ? router.back() : router.replace('/'));

// Header stack
export function StackHeader({ title }) {
  return (
    <View style={styles.bar}>
      <Pressable
        onPress={kembali}
        accessibilityRole="button"
        accessibilityLabel="Kembali"
        hitSlop={6}
        style={({ pressed }) => [styles.circle, pressed && { opacity: 0.7 }]}
      >
        <Ikon name="back" size={20} />
      </Pressable>
      <Teks w="semibold" style={styles.title} numberOfLines={1}>
        {title}
      </Teks>
      <View style={styles.circleSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 56,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  logoWrap: { flexDirection: 'row', alignItems: 'center', minHeight: 46 },
  logoDot: {
    position: 'absolute',
    left: -6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleSpacer: { width: 40 },
  title: { flex: 1, textAlign: 'center', fontSize: 15, lineHeight: 20 }
});
