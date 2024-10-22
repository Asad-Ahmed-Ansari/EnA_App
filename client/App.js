import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Import your Loader
import Loader from './src/components/loader'; // Ensure the correct path to Loader

// Screens
import LoginScreen from './src/screens/LoginScreen';
import UserPage from './src/screens/UserPage';
import AdminPage from './src/screens/AdminPage';
import SuperAdminPage from './src/screens/SuperAdminPage';
import RegisterUser from './src/screens/RegisterUser';
import HomeScreen from './src/screens/HomeScreen';
import DataSummaryScreen from './src/screens/DataSummaryScreen';
import VoltageChartsScreen from './src/screens/VoltageChartsScreen';
import TicketsScreen from './src/screens/TicketsScreen';
import OpenTicketsScreen from './src/screens/OPenTicketScreen';
import TicketSummaryScreen from './src/screens/TicketSummaryScreen';

// Create Navigators
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Navigator for Super Admin
const SuperAdminDrawer = () => (
  <Drawer.Navigator initialRouteName="SuperAdminPage">
    <Drawer.Screen name="SuperAdminPage" component={SuperAdminPage} />
    <Drawer.Screen name="RegisterUser" component={RegisterUser} />
  </Drawer.Navigator>
);

// Register for push notifications and return the token
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const AppNavigator = () => {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Register for notifications
    registerForPushNotificationsAsync();

    // Handle incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification responses
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    // Cleanup listeners
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: { backgroundColor: '#111a22' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DataSummary" component={DataSummaryScreen} />
      <Stack.Screen name="VoltageCharts" component={VoltageChartsScreen} />
      <Stack.Screen name="Tickets" component={TicketsScreen} />
      <Stack.Screen name="OpenTickets" component={OpenTicketsScreen} />
      <Stack.Screen name="TicketSummary" component={TicketSummaryScreen} />
      <Stack.Screen name="SuperAdminDrawer" component={SuperAdminDrawer} options={{ headerShown: false }}/>
      <Stack.Screen name="AdminPage" component={AdminPage}/>
      <Stack.Screen name="UserPage" component={UserPage}/>
    </Stack.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true); // Manage loading state

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false); // Simulate loading time
    }, 3000);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <Loader /> // Display loader during loading phase
      ) : (
        <AppNavigator /> // Show app navigator after loading is complete
      )}
    </NavigationContainer>
  );
};

export default App;
