import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../lib/theme';
import Teks from './Teks';
import Ikon, { Simbol } from './Ikon';

// Dropdown pilihan
export default function Select({ value, options, onChange, label = 'Pilih kategori', ikonTombol = 'kategori' }) {
  const [buka, setBuka] = useState(false);
  const pilihan = options.find((o) => o.value === value) || options[0];

  return (
    <View>
      <Pressable
        onPress={() => setBuka((b) => !b)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${pilihan.label}`}
        accessibilityState={{ expanded: buka }}
        style={[styles.trigger, buka && styles.triggerOn]}
      >
        {ikonTombol === 'opsi' && pilihan.simbol ? (
          <View style={[styles.opsiIkon, { backgroundColor: pilihan.warna || colors.lavender }]}>
            <Simbol id={pilihan.simbol} size={20} />
          </View>
        ) : (
          <Ikon name="kategori" size={18} color={colors.purple} />
        )}
        <Teks w="semibold" style={styles.triggerTeks}>
          {pilihan.label}
        </Teks>
        <View style={{ transform: [{ rotate: buka ? '180deg' : '0deg' }] }}>
          <Ikon name="chevron-down" size={18} color={colors.muted} />
        </View>
      </Pressable>

      {buka && (
        <View style={styles.panel} accessibilityRole="menu">
          {options.map((o) => {
            const aktif = o.value === value;
            return (
              <Pressable
                key={o.value || 'semua'}
                onPress={() => {
                  onChange(o.value);
                  setBuka(false);
                }}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: aktif }}
                style={({ pressed }) => [styles.opsi, (aktif || pressed) && styles.opsiOn]}
              >
                <View style={[styles.opsiIkon, { backgroundColor: o.warna || colors.lavender }]}>
                  {o.simbol ? <Simbol id={o.simbol} size={20} /> : <Ikon name="kategori" size={14} color={colors.purple} />}
                </View>
                <Teks w={aktif ? 'semibold' : 'medium'} style={[styles.opsiTeks, aktif && { color: colors.purple }]}>
                  {o.label}
                </Teks>
                {aktif ? <Ikon name="check" size={18} color={colors.purple} strokeWidth={2} /> : null}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lavenderLine,
    backgroundColor: '#fff'
  },
  triggerOn: { borderColor: colors.focusLine },
  triggerTeks: { flex: 1, fontSize: 14, lineHeight: 18 },
  panel: {
    marginTop: 8,
    padding: 6,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.lavenderLine,
    backgroundColor: '#fff',
    shadowColor: '#5A3E1B',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3
  },
  opsi: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 46, paddingHorizontal: 10, borderRadius: 18 },
  opsiOn: { backgroundColor: colors.lavender },
  opsiIkon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  opsiTeks: { flex: 1, fontSize: 14, lineHeight: 18 }
});
