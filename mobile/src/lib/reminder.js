import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Tampilkan notifikasi walau aplikasi sedang dibuka
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

const ID_PENGINGAT = 'pengingat-harian';

// Pasang pengingat harian jam 19.00
export const aktifkanPengingat = async () => {
  const izin = await Notifications.requestPermissionsAsync();
  if (!izin.granted) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('pengingat', {
      name: 'Pengingat harian',
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }

  await Notifications.cancelScheduledNotificationAsync(ID_PENGINGAT).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: ID_PENGINGAT,
    content: {
      title: 'HealthyLife',
      body: 'Sudah bergerak hari ini? Catat aktivitasmu, yuk.'
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 19,
      minute: 0,
      channelId: 'pengingat'
    }
  });
  return true;
};

export const matikanPengingat = () => Notifications.cancelScheduledNotificationAsync(ID_PENGINGAT).catch(() => {});

export const cekPengingat = async () => {
  const list = await Notifications.getAllScheduledNotificationsAsync();
  return list.some((n) => n.identifier === ID_PENGINGAT);
};
