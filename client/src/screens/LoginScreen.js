import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, Animated, Easing, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { login } from '../services/authService'; 
import logo from '../assets/EnA_logorem.png'; 
import background from '../assets/file7.png'; 
import { sendTokenToBackend } from '../../Notification';
import { sendLocalNotification } from '../../Notification';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();
  const notificationListener = useRef();
  const responseListener = useRef();

    // Set header options dynamically, including Logout modal
    useEffect(() => {
      navigation.setOptions({
        title: 'SMARTIC',
        headerTitleStyle: {
          color: 'black',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: 'black', // Back button and other icons color
      });
    }, [navigation]);

  // Register for notifications when component mounts
  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus === 'granted') {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
      }
    }

    registerForPushNotificationsAsync();

    // Add notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {});
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    // Cleanup listeners on component unmount
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const response = await login(email, password);
      console.log('Login Response:', response);
      const token = response?.token;
  
      if (token) {
        await AsyncStorage.setItem('token', token);
        await sendTokenToBackend(token);
  
        const role = response?.role;
        const branchName = response?.branchName;
        console.log('Branch Name:', branchName);
  
        if (role) {
          await AsyncStorage.setItem('userRole', role);
          await sendLocalNotification(); // Send local notification on successful login
  
          switch (role.trim()) {
            case 'Super Admin':
              navigation.navigate('SuperAdminDrawer');
              break;
            case 'Admin':
              navigation.navigate('AdminPage');
              break;
            case 'User':
              if (branchName) {
                navigation.navigate('UserPage', { branchName });
              } else {
                alert('Branch name missing for user. Please contact support.');
              }
              break;
            default:
              alert('Invalid role received. Please contact support.');
          }
        } else {
          alert('Invalid credentials. Please try again.');
        }
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('An error occurred. Please check your credentials and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  };

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      clearInputs(); // Clear inputs when navigating back to the login page
    });

    return unsubscribe; // Cleanup the event listener on unmount
  }, [navigation]);

  return (
    <ImageBackground source={background} style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
        />
        {/* Conditionally render the eye icon */}
        {password.length > 0 && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(prev => !prev)} style={styles.eyeIcon}>
            <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      <Animated.View style={[styles.button, { transform: [{ scale: buttonScale }] }]}>
        <TouchableOpacity 
          onPress={() => {
            animateButton();
            handleLogin();
          }}
          activeOpacity={0.7}
          disabled={isLoggingIn}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
    width: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  icon: {
    marginRight: 10,
    color: '#888',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#aecce4',
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;
