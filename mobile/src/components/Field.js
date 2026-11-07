import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, fonts, radius } from '../lib/theme';
import Teks from './Teks';

// Field form
export default function Field({ label, hint, style, onFocus, onBlur, ...props }) {
  const [fokus, setFokus] = useState(false);
  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Teks w="medium" style={styles.label}>
          {label}
        </Teks>
      ) : null}
      <TextInput
        style={[styles.input, fokus && styles.fokus]}
        placeholderTextColor="#8A8494"
        accessibilityLabel={label}
        onFocus={(e) => {
          setFokus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFokus(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {hint ? <Teks style={styles.hint}>{hint}</Teks> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  label: { fontSize: 13, lineHeight: 18 },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.inputLine,
    borderRadius: radius.input,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: 15
  },
  fokus: { borderColor: colors.focusLine },
  hint: { fontSize: 12, lineHeight: 17, color: colors.muted }
});
