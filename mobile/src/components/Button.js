import { Pressable, StyleSheet, View } from 'react-native';
import { colors, fonts, radius } from '../lib/theme';
import Teks from './Teks';

// Tombol pil ala web
// variant: primary | orange | outline | light | link | linkLight
export default function Button({
  title,
  onPress,
  disabled,
  variant = 'primary',
  size = 'md',
  icon,
  block = true,
  style,
  textColor,
  accessibilityLabel
}) {
  const v = VARIAN[variant] || VARIAN.primary;
  const warnaTeks = textColor || v.text;
  const isLink = variant === 'link' || variant === 'linkLight';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={isLink ? 8 : undefined}
      style={({ pressed }) => [
        styles.btn,
        size === 'sm' && styles.sm,
        isLink && styles.link,
        !block && styles.inline,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && !isLink && { backgroundColor: v.pressed, transform: [{ translateY: 1 }] },
        pressed && isLink && { opacity: 0.6 },
        disabled && styles.disabled,
        style
      ]}
    >
      <View style={styles.row}>
        {icon}
        <Teks w="semibold" style={[styles.text, size === 'sm' && styles.textSm, { color: warnaTeks }]}>
          {title}
        </Teks>
      </View>
    </Pressable>
  );
}

const VARIAN = {
  primary: { bg: colors.purple, pressed: '#5E0091', text: '#fff', border: colors.purple },
  orange: { bg: colors.orange, pressed: '#E65C00', text: '#fff', border: colors.orange },
  outline: { bg: '#fff', pressed: colors.lavender, text: colors.ink, border: colors.inputLine },
  light: { bg: '#fff', pressed: '#F4F0FA', text: colors.purple, border: '#fff' },
  link: { bg: 'transparent', pressed: 'transparent', text: colors.purple, border: 'transparent' },
  linkLight: { bg: 'transparent', pressed: 'transparent', text: '#fff', border: 'transparent' }
};

const styles = StyleSheet.create({
  btn: {
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sm: { minHeight: 38, paddingHorizontal: 16 },
  inline: { alignSelf: 'flex-start' },
  link: { minHeight: 40, paddingHorizontal: 0, borderWidth: 0, alignSelf: 'flex-start' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  disabled: { opacity: 0.55 },
  text: { fontSize: 15, lineHeight: 20, fontFamily: fonts.semibold },
  textSm: { fontSize: 14, lineHeight: 18 }
});
