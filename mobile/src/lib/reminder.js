import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Notif saat terbuka
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

const ID_PENGINGAT = 'pengingat-harian';
const CHANNEL = 'pengingat';

// Pengingat 19.00
export const aktifkanPengingat = async () => {
  try {
    // Channel dulu (Android 13+)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL, {
        name: 'Pengingat harian',
        importance: Notifications.AndroidImportance.DEFAULT
      });
    }

    let izin = await Notifications.getPermissionsAsync();
    if (!izin.granted && izin.canAskAgain) izin = await Notifications.requestPermissionsAsync();
    if (!izin.granted) {
      return {
        ok: false,
        keSetelan: !izin.canAskAgain,
        pesan: 'Izin notifikasi belum diberikan. Aktifkan notifikasi untuk aplikasi ini di pengaturan HP.'
      };
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
        channelId: CHANNEL
      }
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, pesan: `Pengingat gagal diaktifkan: ${err?.message || 'kesalahan tidak dikenal'}` };
  }
};

export const matikanPengingat = () => Notifications.cancelScheduledNotificationAsync(ID_PENGINGAT).catch(() => {});

export const cekPengingat = async () => {
  const list = await Notifications.getAllScheduledNotificationsAsync();
  return list.some((n) => n.identifier === ID_PENGINGAT);
};
