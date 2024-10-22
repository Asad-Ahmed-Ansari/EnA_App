import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import config from '../../ipconfig';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterUser = ({ navigation }) => {
  const [branchCode, setBranchCode] = useState('');
  const [branchName, setBranchName] = useState('');
  const [bankName, setBankName] = useState('');
  const [deviceNumber, setDeviceNumber] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('User');
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    navigation.setOptions({
      title: 'Register User',
      headerTitleStyle: {
        color: 'black',
        fontWeight: 'bold',
      },
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTintColor: 'black',
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>
          <Image source={require('../assets/logout-8.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Clear irrelevant fields when role changes
  useEffect(() => {
    setBranchCode('');
    setBranchName('');
    setBankName('');
    setDeviceNumber('');
    setContactPerson('');
    setContactPhone('');
    setEmail('');
    setPassword('');
    setUsername('');
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [role]);

  const handleRegister = async () => {
    if (role === 'User' && (!branchCode || !branchName || !bankName || !deviceNumber || !contactPerson || !contactPhone || !email || !password)) {
      Alert.alert('Validation Error', 'All fields are required for Registration.');
      return;
    }

    if (role === 'Admin' && (!username || !email || !password || !bankName)) {
      Alert.alert('Validation Error', 'All fields are required for Registration.');
      return;
    }

    if (role === 'SuperAdmin' && (!username || !email || !password)) {
      Alert.alert('Validation Error', 'All fields are required for Registration.');
      return;
    }

    const data = role === 'User' ? {
      branchCode,
      branchName,
      bankName,
      deviceNumber,
      contactPerson,
      contactPhone,
      email,
      password,
    } : {
      username,
      email,
      password,
      bankName: role === 'Admin' ? bankName : undefined,
    };

    try {
      await axios.post(`${config.baseUrl}/auth/register`, {
        ...data,
        role
      });
      Alert.alert('Success', 'User registered successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to register user. Please try again.');
      console.error('Registration error:', error.response ? error.response.data : error.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        {/* Role Selector */}
        <View style={styles.roleSelectorContainer}>
          <Text style={styles.label}>Select Role:</Text>
          <View style={styles.roleSelectorBox}>
            <Picker
              selectedValue={role}
              style={styles.picker}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="User" value="User" />
              <Picker.Item label="Admin" value="Admin" />
              <Picker.Item label="Super Admin" value="SuperAdmin" />
            </Picker>
          </View>
        </View>

        {/* User Input Fields */}
        {role === 'User' && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="business" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                placeholderTextColor="#000"
                value={bankName}
                onChangeText={setBankName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="code" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Branch Code"
                placeholderTextColor="#000"
                value={branchCode}
                onChangeText={setBranchCode}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Branch Name"
                placeholderTextColor="#000"
                value={branchName}
                onChangeText={setBranchName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contact Person"
                placeholderTextColor="#000"
                value={contactPerson}
                onChangeText={setContactPerson}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="phone-portrait" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Device Number"
                placeholderTextColor="#000"
                value={deviceNumber}
                onChangeText={setDeviceNumber}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Contact Phone"
                placeholderTextColor="#000"
                value={contactPhone}
                onChangeText={setContactPhone}
              />
            </View>
          </>
        )}

        {/* Admin Input Fields */}
        {role === 'Admin' && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#000"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="business" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Bank Name"
                placeholderTextColor="#000"
                value={bankName}
                onChangeText={setBankName}
              />
            </View>
          </>
        )}

        {/* Super Admin Input Fields */}
        {role === 'SuperAdmin' && (
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={24} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#000"
              value={username}
              onChangeText={setUsername}
            />
          </View>
        )}

        {/* Email Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#000"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#000"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Modal for Logout Confirmation */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        > 
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleLogout} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  roleSelectorContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roleSelectorBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  button: {
    backgroundColor: '#aecce4',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    marginVertical: 10,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#ff0000',
  },
});

export default RegisterUser;
