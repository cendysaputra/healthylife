import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import api from '../lib/api';
import { useAuth } from '../lib/auth';
import { colors } from '../lib/theme';
import Teks from './Teks';
import Ikon from './Ikon';

// Lonceng notifikasi
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
      onPress={() => router.push(user ? '/notifikasi' : { pathname: '/login', params: { from: '/notifikasi' } })}
      accessibilityRole="button"
      accessibilityLabel={`Notifikasi, ${count} konten baru`}
      hitSlop={6}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.7 }]}
    >
      <Ikon name="bell" size={20} />
      {count > 0 && (
        <View style={styles.badge}>
          <Teks w="bold" style={styles.badgeText}>
            {count > 9 ? '9+' : count}
          </Teks>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: colors.orange,
    borderWidth: 2,
    borderColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: { color: '#fff', fontSize: 10, lineHeight: 12 }
});
