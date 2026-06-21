import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export async function checkNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.granted;
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const permissions = await Notifications.requestPermissionsAsync();
  return permissions.granted;
}

export async function scheduleDailyNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const notifications = [
    { hour: 8, minute: 0, body: 'Zeit für deinen Morgen-Check! Wie geht es dir heute?' },
    { hour: 13, minute: 0, body: 'Mittags-Check: Wie verläuft dein Tag bisher?' },
    { hour: 20, minute: 0, body: 'Abend-Check: Reflektiere über deinen heutigen Tag.' },
  ];

  for (const n of notifications) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Mental Health Check-In',
        body: n.body,
        sound: true,
        priority: 'high',
      },
      trigger: {
        type: 'calendar' as any,
        hour: n.hour,
        minute: n.minute,
        repeats: true,
      },
    });
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
