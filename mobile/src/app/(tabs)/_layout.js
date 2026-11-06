import { Tabs } from 'expo-router';
import BellButton from '../../components/BellButton';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerRight: () => <BellButton />, tabBarIconStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" options={{ title: 'Beranda', headerTitle: 'HealthyLife' }} />
      <Tabs.Screen name="jelajah" options={{ title: 'Jelajah' }} />
      <Tabs.Screen name="aktivitas" options={{ title: 'Aktivitas' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
