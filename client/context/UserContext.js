import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://192.168.0.114:3000/api/users/user-info', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserRole(response.data.role);
        } else {
          console.warn('No token found in AsyncStorage.');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('Guest');
      }
    };

    fetchUserRole();
  }, []);

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};
