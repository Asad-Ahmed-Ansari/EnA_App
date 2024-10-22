import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OpenTicketsScreen = ({ navigation }) => {
  const [subject, setSubject] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // For logout modal

    // Set header options dynamically, including Logout modal
    useEffect(() => {
      navigation.setOptions({
        title: 'Open Ticket',
        headerTitleStyle: {
          color: 'black',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: 'black', // Back button and other icons color
        headerRight: () => (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>
            <Image source={require('../assets/logout-8.png')} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);
  

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Submitted:', { subject, phoneNumber, message });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login'); // Navigate to login screen after logout
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        

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

        <Text style={styles.label}>Subject:</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter subject"
        />

        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="e.g: 92xxx-xxxxxxx"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={styles.textArea}
          value={message}
          onChangeText={setMessage}
          placeholder="Your Message Here..."
          multiline={true}
          numberOfLines={4}
        />

        {/* Custom Black Button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#aecce4' }]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Address: </Text>
          Citi Tower, 33-A, Block-6, P.E.C.H.S., Shahrah-e-Faisal, Karachi 75400, Pakistan.
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Phone: </Text>
          +92 (21) 111-527-527
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Website: </Text>
          www.enapk.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    flex: 1,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    height: 100,
  },
  button: {
    backgroundColor: '#aecce4', // Black button background
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black', // White text inside the button
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#aecce4',
    padding: 20,
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#aecce4',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default OpenTicketsScreen;
