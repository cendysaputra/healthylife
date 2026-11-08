import { Pressable, StyleSheet, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';
import Teks from './Teks';
import { IkonTab } from './Ikon';

export const TAB = [
  { name: 'index', href: '/', label: 'Beranda', ikon: 'beranda' },
  { name: 'jelajah', href: '/jelajah', label: 'Jelajah', ikon: 'jelajah' },
  { name: 'aktivitas', href: '/aktivitas', label: 'Aktivitas', ikon: 'aktivitas' },
  { name: 'profil', href: '/profil', label: 'Profil', ikon: 'profil' }
];

// Tab bar
export function TabBarView({ aktif }) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const fokus = aktif ?? TAB.find((t) => t.href === pathname)?.name;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {TAB.map((t) => {
        const on = fokus === t.name;
        const warna = on ? colors.purple : '#8A8494';
        return (
          <Pressable
            key={t.name}
            onPress={() => {
              if (pathname !== t.href) router.navigate(t.href);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={t.label}
            android_ripple={null}
            style={styles.item}
          >
            <IkonTab name={t.ikon} aktif={on} color={warna} size={23} />
            <Teks w={on ? 'semibold' : 'medium'} style={[styles.label, { color: warna }]}>
              {t.label}
            </Teks>
          </Pressable>
        );
      })}
    </View>
  );
}

// Untuk navigator Tabs
export default function TabBar() {
  return <TabBarView />;
}

// Tab bar luar
export function TabBarLuar({ aktif = 'jelajah' }) {
  return <TabBarView aktif={aktif} />;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#fff', paddingTop: 10 },
  item: { flex: 1, alignItems: 'center', gap: 4, minHeight: 44 },
  label: { fontSize: 11, lineHeight: 14 }
});
