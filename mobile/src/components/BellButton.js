import { useCallback, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import api from '../lib/api';
import { useAuth } from '../lib/auth';

// Ikon lonceng di header, angka = konten baru
export default function BellButton() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!user) return setCount(0);
      api
        .get('/notifications')
        .then(({ data }) => setCount(data.count))
        .catch(() => setCount(0));
    }, [user])
  );

  return (
    <Pressable
      onPress={() => router.push(user ? '/notifikasi' : '/login')}
      accessibilityRole="button"
      accessibilityLabel={`Notifikasi, ${count} konten baru`}
      style={{ paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' }}
    >
      <Text>Notif{count > 0 ? ` (${count})` : ''}</Text>
    </Pressable>
  );
}
