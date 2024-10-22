import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Temporary storage for submitted tickets
const ticketData = [
  {
    id: '1',
    title: 'Monitoring',
    message: 'abc',
    dateTime: '2023-08-03 07:39:49',
  },
  {
    id: '2',
    title: 'abc',
    message: '....',
    dateTime: '2022-04-20 07:31:40',
  },
];

const TicketSummaryScreen = ({ navigation }) => {
  const [tickets, setTickets] = useState(ticketData);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // For logout modal

  // Set header options dynamically, including Logout modal
  useEffect(() => {
    navigation.setOptions({
      title: 'Ticket Summary',
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


  // Date filtering logic
  const filterTicketsByDate = () => {
    const filtered = ticketData.filter(ticket => {
      const ticketDate = new Date(ticket.dateTime);
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return ticketDate >= from && ticketDate <= to;
    });
    setTickets(filtered);
  };

  // Date picker handler for 'From' date
  const handleFromDateConfirm = (date) => {
    setFromDate(date.toLocaleDateString()); // Format date as mm/dd/yyyy
    setFromDatePickerVisible(false);
  };

  // Date picker handler for 'To' date
  const handleToDateConfirm = (date) => {
    setToDate(date.toLocaleDateString()); // Format date as mm/dd/yyyy
    setToDatePickerVisible(false);
  };

  const renderTicket = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.title}</Text>
      <Text style={styles.cell}>{item.message}</Text>
      <Text style={styles.cell}>{item.dateTime}</Text>
    </View>
  );
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login'); // Navigate to login screen after logout
  };

  return (
    <View style={styles.container}>
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
      
      {/* Date Filter Inputs */}
      <View style={styles.dateFilterContainer}>
        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Date-From mm/dd/yyyy"
            value={fromDate}
            onChangeText={setFromDate}
          />
          <TouchableOpacity onPress={() => setFromDatePickerVisible(true)}>
            <Icon name="calendar" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Date-To mm/dd/yyyy"
            value={toDate}
            onChangeText={setToDate}
          />
          <TouchableOpacity onPress={() => setToDatePickerVisible(true)}>
            <Icon name="calendar" size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: '#aecce4' }]} onPress={filterTicketsByDate}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={isFromDatePickerVisible}
        mode="date"
        onConfirm={handleFromDateConfirm}
        onCancel={() => setFromDatePickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isToDatePickerVisible}
        mode="date"
        onConfirm={handleToDateConfirm}
        onCancel={() => setToDatePickerVisible(false)}
      />

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>S.no</Text>
        <Text style={styles.headerCell}>Title</Text>
        <Text style={styles.headerCell}>Message</Text>
        <Text style={styles.headerCell}>DateTime</Text>
      </View>

      {/* Ticket List */}
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={item => item.id}
      />

      {/* Download Button */}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#aecce4' }]} onPress={() => { /* Handle download logic */ }}>
        <Text style={styles.buttonText}>Download</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    marginLeft: 10, // Spacing between input and icon
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#aecce4',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cell: {
    flex: 1,
  },
  button: {
    backgroundColor: 'black', // Black background color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center', // Center text
    marginTop: 10,
  },
  buttonText: {
    color: 'black', // Black text color
    fontSize: 16,
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

export default TicketSummaryScreen;
