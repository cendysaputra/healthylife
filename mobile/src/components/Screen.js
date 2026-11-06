import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, space } from '../lib/theme';

// Kerangka layar: scroll, tarik untuk refresh, loading, dan error
export default function Screen({ children, loading, error, onRefresh, refreshing = false }) {
  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={styles.content}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {children}
        </>
      )}
    </ScrollView>
  );
}

export function Section({ title, children }) {
  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.screen, paddingBottom: space.section * 2 },
  section: { marginBottom: space.section, gap: space.gap },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  error: { color: colors.danger, marginBottom: space.gap },
});
