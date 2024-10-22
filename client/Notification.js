import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import config from './ipconfig';

// Set the notification handler to enable sound
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true, // Enable sound for all notifications
    shouldSetBadge: false,
  }),
});

// Function to register for push notifications
export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  // Create notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX, // Maximum importance with sound
      sound: 'default', // Enable sound
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Function to send token to the backend
export async function sendTokenToBackend(token) {
  try {
    await fetch(`${config.baseUrl}/auth/save-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        expoPushToken: token,
      }),
    });
    console.log('Token sent to backend');
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
}

// Function to send a local notification with sound
export async function sendLocalNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Successful Login 🎉",
      body: 'Welcome to SMARTIC!',
      data: { someData: 'Some extra data' },
      sound: true, // Ensure sound is enabled
    },
    trigger: null, // Sends the notification immediately
    android: {
      channelId: 'default', // Use the custom notification channel
    },
  });
}

// Function to add listeners for notifications
export function addNotificationListeners(notificationListenerRef, responseListenerRef) {
  notificationListenerRef.current = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response received:', response);
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListenerRef.current);
    Notifications.removeNotificationSubscription(responseListenerRef.current);
  };
}
