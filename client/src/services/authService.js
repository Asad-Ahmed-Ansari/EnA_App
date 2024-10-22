import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '../../ipconfig';

// Function to save the token
const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

// Function to get the token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('Retrieved token:', token);
    return token;
  } catch (error) {
    console.error('Failed to retrieve the token:', error);
  }
};

// Test to ensure AsyncStorage works
(async () => {
  try {
    await AsyncStorage.setItem('test', 'testValue');
    const value = await AsyncStorage.getItem('test');
    console.log('AsyncStorage Test:', value); // Should log 'testValue' if AsyncStorage is working correctly
  } catch (error) {
    console.error('AsyncStorage Test Error:', error);
  }
})();

// Function to handle login
const login = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post(`${config.baseUrl}/auth/login`, {
        usernameOrEmail,
        password,
      });
      const { token, role, branchName } = response.data;
  
      if (token) {
        await saveToken(token);
        return { token, role, branchName }; // Return role along with the token
      } else {
        console.error('No token received');
      }
    } catch (error) {
      if (error.response) {
        console.error('Login error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error during login setup:', error.message);
      }
    }
  };
  

export { login, getToken };
