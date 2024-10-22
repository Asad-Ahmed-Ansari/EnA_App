import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import date picker
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataSummaryScreen = ({ navigation }) => {
  // State for date range filters and search
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false); // Visibility state for 'From' date picker
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false); // Visibility state for 'To' date picker
  const [modalVisible, setModalVisible] = useState(false); // For logout modal

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items to show per page

    // Set header options dynamically, including Logout modal
    useEffect(() => {
      navigation.setOptions({
        title: 'Data Summary',
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

  // Example data (replace this with actual dynamic data)
  const tableData = [
    { id: '1', dateTime: '2024-04-16 19:05:16', mode: 'Auto', utilityVoltage: '0', genSetVoltage: '220', batteryVoltage: '50.0', upsOutput: 'OFF' },
    { id: '2', dateTime: '2023-12-27 12:49:51', mode: 'Auto', utilityVoltage: '109', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '3', dateTime: '2023-12-27 12:46:50', mode: 'Auto', utilityVoltage: '108', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '4', dateTime: '2023-12-27 12:43:50', mode: 'Auto', utilityVoltage: '110', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '5', dateTime: '2023-12-27 12:40:50', mode: 'Auto', utilityVoltage: '113', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '6', dateTime: '2023-12-27 12:37:50', mode: 'Auto', utilityVoltage: '113', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '7', dateTime: '2023-12-27 12:34:50', mode: 'Auto', utilityVoltage: '111', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '8', dateTime: '2023-12-27 12:31:53', mode: 'Auto', utilityVoltage: '112', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '9', dateTime: '2023-12-27 12:28:50', mode: 'Auto', utilityVoltage: '112', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '10', dateTime: '2023-12-27 12:25:50', mode: 'Auto', utilityVoltage: '113', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '1', dateTime: '2024-04-16 19:05:16', mode: 'Auto', utilityVoltage: '0', genSetVoltage: '220', batteryVoltage: '50.0', upsOutput: 'OFF' },
    { id: '2', dateTime: '2023-12-27 12:49:51', mode: 'Auto', utilityVoltage: '109', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '3', dateTime: '2023-12-27 12:46:50', mode: 'Auto', utilityVoltage: '108', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '4', dateTime: '2023-12-27 12:43:50', mode: 'Auto', utilityVoltage: '110', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '5', dateTime: '2023-12-27 12:40:50', mode: 'Auto', utilityVoltage: '113', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '6', dateTime: '2023-12-27 12:37:50', mode: 'Auto', utilityVoltage: '113', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '7', dateTime: '2023-12-27 12:34:50', mode: 'Auto', utilityVoltage: '111', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '8', dateTime: '2023-12-27 12:31:53', mode: 'Auto', utilityVoltage: '112', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '9', dateTime: '2023-12-27 12:28:50', mode: 'Auto', utilityVoltage: '112', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
    { id: '10', dateTime: '2023-12-27 12:25:50', mode: 'Auto', utilityVoltage: '113', genSetVoltage: '0', batteryVoltage: '54.5', upsOutput: 'OFF' },
  ];

  // Calculate total pages based on items per page
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  // Function to get the data for the current page
  const paginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return tableData.slice(startIndex, startIndex + itemsPerPage);
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login'); // Navigate to login screen after logout
  };


  // Render each row in the table
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.dateTime}</Text>
      <Text style={styles.cell}>{item.mode}</Text>
      <Text style={styles.cell}>{item.utilityVoltage}</Text>
      <Text style={styles.cell}>{item.genSetVoltage}</Text>
      <Text style={styles.cell}>{item.batteryVoltage}</Text>
      <Text style={styles.cell}>{item.upsOutput}</Text>
    </View>
  );

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

      {/* Date Filters */}
      <View style={styles.filterContainer}>
        {/* Date-From Input with Calendar Icon */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Date-From mm/dd/yyyy"
            value={fromDate}
            onChangeText={setFromDate}
          />
          <TouchableOpacity onPress={() => setFromDatePickerVisible(true)} style={styles.iconContainer}>
            <Icon name="calendar" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Date-To Input with Calendar Icon */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Date-To mm/dd/yyyy"
            value={toDate}
            onChangeText={setToDate}
          />
          <TouchableOpacity onPress={() => setToDatePickerVisible(true)} style={styles.iconContainer}>
            <Icon name="calendar" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Custom Styled Submit Button */}
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#9abddc' }]}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
        <Text style={styles.headerCell}>DateTime</Text>
        <Text style={styles.headerCell}>Mode</Text>
        <Text style={styles.headerCell}>Utility Voltage</Text>
        <Text style={styles.headerCell}>GenSet Voltage</Text>
        <Text style={styles.headerCell}>Battery Voltage</Text>
        <Text style={styles.headerCell}>UPS Output</Text>
      </View>

      {/* Table Data */}
      <FlatList
        data={paginatedData()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage(currentPage - 1)}
          style={currentPage === 1 ? styles.disabledButton : styles.button}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage(currentPage + 1)}
          style={currentPage === totalPages ? styles.disabledButton : styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
  },
  logoutButton: {
    position: 'absolute',
    top: 26,
    right: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  iconContainer: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#aecce4',
    padding: 10,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    marginBottom: 5,
    borderRadius: 5,
  },
  cell: {
    flex: 1,
    fontSize: 8,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#aecce4',
    borderRadius: 5,
  },
  disabledButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontSize: 16,
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

export default DataSummaryScreen;
