import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, space } from '../lib/theme';

// Input dengan label
export default function Field({ label, ...props }) {
  return (
    <View style={styles.wrap}>
      <Text>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.muted} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  input: { minHeight: 44, borderWidth: 1, borderColor: colors.border, paddingHorizontal: space.gap, color: colors.text }
});
