import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, space } from '../lib/theme';

// Tombol polos, gampang diganti saat styling
export default function Button({ title, onPress, disabled, variant = 'primary' }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[styles.btn, variant === 'outline' && styles.outline, disabled && styles.disabled]}
    >
      <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: space.gap,
    backgroundColor: colors.text
  },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.text },
  disabled: { opacity: 0.5 },
  text: { color: colors.bg, fontWeight: '600' },
  textOutline: { color: colors.text }
});
