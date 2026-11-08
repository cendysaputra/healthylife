import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space, type } from '../lib/theme';
import Teks from './Teks';
import { Maskot } from './Ikon';
import { StackHeader, TabHeader } from './AppHeader';
import { TabBarLuar } from './TabBar';

// Kerangka layar
// header: 'tab'/judul
export default function Screen({
  children,
  header = 'tab',
  hero,
  loading,
  error,
  onRefresh,
  refreshing = false,
  tabBar,
  latar = colors.cream,
  scrollRef
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      {/* Latar status bar */}
      <View style={{ height: insets.top, backgroundColor: latar }} />
      <ScrollView
        ref={scrollRef}
        style={styles.wrap}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.purple}
              colors={[colors.purple]}
              progressBackgroundColor="#fff"
            />
          ) : undefined
        }
      >
        <View style={[styles.top, { backgroundColor: latar }, !hero && styles.topSendiri]}>
          {header === 'tab' ? <TabHeader /> : <StackHeader title={header} />}
        </View>
        {hero}
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.purple} size="large" />
          </View>
        ) : (
          <View style={styles.body}>
            {error ? <Alert tipe="error">{error}</Alert> : null}
            {children}
          </View>
        )}
      </ScrollView>
      {tabBar ? <TabBarLuar aktif={tabBar} /> : null}
    </View>
  );
}

// Hero krem
export function Hero({ children, style }) {
  return <View style={[styles.hero, style]}>{children}</View>;
}

// Tautan judul section
export function LinkAksi({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      hitSlop={10}
      style={({ pressed }) => [styles.aksi, pressed && { opacity: 0.6 }]}
    >
      <Teks w="semibold" style={styles.aksiTeks}>
        {title}
      </Teks>
    </Pressable>
  );
}

export function Section({ title, aksi, children, style }) {
  return (
    <View style={[styles.section, style]}>
      {title ? (
        <View style={styles.sectionHead}>
          <Teks w="medium" style={styles.sectionTitle} accessibilityRole="header">
            {title}
          </Teks>
          {aksi}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export function Alert({ tipe = 'error', children }) {
  const sukses = tipe === 'success';
  return (
    <View
      style={[styles.alert, { backgroundColor: sukses ? colors.successBg : colors.dangerBg }]}
      accessibilityRole={sukses ? undefined : 'alert'}
      accessibilityLiveRegion="polite"
    >
      <Teks w="medium" style={{ color: sukses ? colors.success : colors.danger, fontSize: 14, lineHeight: 20 }}>
        {children}
      </Teks>
    </View>
  );
}

// Keadaan kosong
export function Kosong({ judul, teks, varian = 'lavender', children }) {
  return (
    <View style={styles.kosong}>
      <Maskot varian={varian} size={64} />
      <Teks w="medium" style={styles.kosongJudul}>
        {judul}
      </Teks>
      {teks ? <Teks style={styles.kosongTeks}>{teks}</Teks> : null}
      {children ? <View style={styles.kosongAksi}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  wrap: { flex: 1 },
  content: { paddingBottom: 40 },
  top: { backgroundColor: colors.cream, paddingHorizontal: space.screen },
  topSendiri: { borderBottomLeftRadius: radius.block, borderBottomRightRadius: radius.block, paddingBottom: 8 },
  body: { paddingHorizontal: space.screen, paddingTop: space.heroBottom },
  loading: { paddingVertical: 64, alignItems: 'center' },
  hero: {
    backgroundColor: colors.cream,
    borderBottomLeftRadius: radius.block,
    borderBottomRightRadius: radius.block,
    paddingHorizontal: space.screen,
    paddingTop: space.heroTop,
    paddingBottom: space.heroBottom
  },
  section: { marginBottom: space.section, gap: space.block },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  sectionTitle: { flex: 1, fontSize: type.section, lineHeight: 30, letterSpacing: -0.5 },
  aksi: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 32 },
  aksiTeks: { color: colors.purple, fontSize: 14, lineHeight: 18 },
  alert: { borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, marginBottom: space.block },
  kosong: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 32,
    paddingHorizontal: space.card,
    borderRadius: radius.card,
    backgroundColor: colors.lavender
  },
  kosongJudul: { fontSize: 18, lineHeight: 24, textAlign: 'center', marginTop: 8 },
  kosongTeks: { color: colors.muted, textAlign: 'center', fontSize: 14, lineHeight: 21 },
  kosongAksi: { alignSelf: 'stretch', alignItems: 'center', marginTop: 10 }
});
