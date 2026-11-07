import { Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from './Button';
import { space } from '../lib/theme';

// Muncul di layar yang butuh login
export default function LoginPrompt({ pesan, from }) {
  return (
    <View style={{ gap: space.gap }}>
      <Text>{pesan}</Text>
      <Button title="Masuk" onPress={() => router.push({ pathname: '/login', params: { from } })} />
      <Button
        title="Daftar"
        variant="outline"
        onPress={() => router.push({ pathname: '/register', params: { from } })}
      />
    </View>
  );
}
