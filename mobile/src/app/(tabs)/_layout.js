import { Tabs } from 'expo-router';
import { colors } from '../../lib/theme';
import TabBar from '../../components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      backBehavior="history"
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="jelajah" options={{ title: 'Jelajah' }} />
      <Tabs.Screen name="aktivitas" options={{ title: 'Aktivitas' }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil' }} />
    </Tabs>
  );
}
