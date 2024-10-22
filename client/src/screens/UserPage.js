import React, { useEffect, useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../ipconfig';


// Memoized Sidebar Component
const MemoizedSidebar = memo(Sidebar);

const UserPage = ({ navigation }) => {
  const [userData, setUserData] = useState({ site: {}, device: {} });
  const [logData, setLogData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState('');
  const route = useRoute();
  const { branchName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: branchName, // Dynamically set branchName as title
      headerTitleStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 24, // Increase the font size
        textAlign: 'center', // Center the text to allow padding to work better
        paddingHorizontal: 15, // Use horizontal padding to move it more to the right
      },
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTintColor: 'black', // Back button and other icons color
      headerLeft: () => ( // Add sidebar toggle button to the left side
        <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={{ marginLeft: 18 }}>
          <Icon name="bars" size={20} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => ( // Add logout button to the right side
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>
          <Image source={require('../assets/logout-8.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, branchName, setIsSidebarOpen, setModalVisible]); // Add dependencies here
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login'); // Navigate to login screen after logout
  };

  // Fetch role from AsyncStorage
  useEffect(() => {
    const fetchUserRole = async () => {
      const storedRole = await AsyncStorage.getItem('userRole');
      if (storedRole) {
        setRole(storedRole);
      }
    };
    fetchUserRole();
  }, []);

  // Memoized fetchUserData to avoid unnecessary re-renders
  const fetchUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${config.baseUrl}/api/users/data`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();

    // Mock log data
    const mockLogData = [
      { userId: '101', dateTime: '2024-09-09 04:25:12', btUpperRange: '60V', btLowerRange: '48V', autoManualStatus: 'Auto' },
      { userId: '102', dateTime: '2024-09-09 04:30:15', btUpperRange: '58V', btLowerRange: '47V', autoManualStatus: 'Manual' },
      { userId: '103', dateTime: '2024-09-09 04:35:20', btUpperRange: '62V', btLowerRange: '49V', autoManualStatus: 'Auto' },
      { userId: '104', dateTime: '2024-09-09 04:40:18', btUpperRange: '59V', btLowerRange: '47V', autoManualStatus: 'Manual' },
      { userId: '105', dateTime: '2024-09-09 04:45:25', btUpperRange: '61V', btLowerRange: '48V', autoManualStatus: 'Auto' }
    ];

    setLogData(mockLogData);
  }, [fetchUserData]);

  // Handle navigation based on the role
  const handleNavigation = useCallback((screen) => {
    setIsSidebarOpen(false); // Close sidebar when navigating

    // Handle navigation logic for Home based on role
    if (screen === 'Home') {
      switch (role.trim()) {
        case 'Super Admin':
          navigation.navigate('SuperAdminPage');
          break;
        case 'Admin':
          navigation.navigate('AdminPage');
          break;
        case 'User':
          navigation.navigate('UserPage', { branchName });
          break;
        default:
          alert('Invalid role. Please contact support.');
      }
    } else {
      navigation.navigate(screen);
    }
  }, [navigation, role, branchName]);

  return (
    <View style={styles.container}>

      {/* Modal for Logout and Cancel */}
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

      

      {/* Sidebar Component */}
      {isSidebarOpen && <MemoizedSidebar onNavigate={handleNavigation} closeSidebar={() => setIsSidebarOpen(false)} />}
        

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>

        {/* Voltage Information */}
        <View style={styles.voltageInfo}>
          <View style={styles.voltageCard}>
            <Text style={styles.voltageTitle}>UTILITY VOLTAGE</Text>
            <Text style={styles.voltageValue}>0 Volts</Text>
          </View>
          <View style={styles.voltageCard}>
            <Text style={styles.voltageTitle}>GENERATOR VOLTAGE</Text>
            <Text style={styles.voltageValue}>220 Volts</Text>
          </View>
          <View style={styles.voltageCard}>
            <Text style={styles.voltageTitle}>BATTERY VOLTAGE</Text>
            <Text style={styles.voltageValue}>50.0 Volts</Text>
          </View>
        </View>

        {/* Last Update Card */}
        <View style={styles.lastUpdateCard}>
          <Text style={styles.lastUpdateText}>LAST UPDATE</Text>
          <Text style={styles.lastUpdateTime}>2024-07-08 15:48:51</Text>
        </View>

        {/* Voltage Rating Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Voltage Rating</Text>

          {/* Voltage Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendText}><Text style={{ color: '#ff6384' }}>■</Text> Utility Voltage</Text>
            <Text style={styles.legendText}><Text style={{ color: '#ffce56' }}>■</Text> Generator Voltage</Text>
            <Text style={styles.legendText}><Text style={{ color: '#36a2eb' }}>■</Text> Battery Voltage</Text>
          </View>
          
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  data: [45, 140, 120, 150, 90, 160], // Utility Voltage
                  color: () => '#ff6384',
                },
                {
                  data: [44, 230, 100, 240, 70, 250], // Generator Voltage
                  color: () => '#ffce56',
                },
                {
                  data: [50, 55, 45, 60, 65, 40], // Battery Voltage
                  color: () => '#36a2eb',
                },
              ],
            }}
            width={Dimensions.get('window').width - 30}
            height={220}
            yAxisSuffix="V"
            chartConfig={styles.chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Battery Information */}
        <View style={styles.batteryInfo}>
          <Text style={styles.batteryTitle}>Battery Voltage</Text>
          <View style={styles.batteryContainer}>
            <View style={styles.batteryShape}>
              <View style={styles.batteryLevel} />
              <View style={styles.batteryIndicator}>
                <Text style={styles.batteryPercentText}>83.9%</Text>
              </View>
            </View>
          </View>
          <Text style={styles.batteryStatus}>Battery-Charging Status: Charged</Text>
        </View>

        {/* Notifications Card */}
        <View style={styles.notificationsCard}>
          <Text style={styles.notificationTitle}>Notification</Text>
          <Text style={styles.notificationText}>2024-09-09 04:25:12 : Generator Power On with 237V</Text>
          <Text style={styles.notificationText}>2024-09-09 04:01:12 : Utility Failure</Text>
        </View>

        {/* Parameter Status Log */}
        <View style={styles.parameterLog}>
          <TouchableOpacity onPress={() => navigation.navigate('DataSummary')}>
            <Text style={styles.parameterLogTitle}>Parameter Status Log</Text>
          </TouchableOpacity>

          {/* Table Headers */}
          <View style={styles.logTableHeader}>
            <Text style={styles.tableHeaderText}>User ID</Text>
            <Text style={styles.tableHeaderText}>Date-Time</Text>
            <Text style={styles.tableHeaderText}>BT Upper Range</Text>
            <Text style={styles.tableHeaderText}>BT Lower Range</Text>
            <Text style={styles.tableHeaderText}>Auto/Manual Status</Text>
          </View>

          {/* Table Rows */}
          {logData.map((log, index) => (
            <View key={index} style={styles.logRow}>
              <Text style={styles.logText}>{log.userId}</Text>
              <Text style={styles.logText}>{log.dateTime}</Text>
              <Text style={styles.logText}>{log.btUpperRange}</Text>
              <Text style={styles.logText}>{log.btLowerRange}</Text>
              <Text style={styles.logText}>{log.autoManualStatus}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ffffff',
    elevation: 10,
  },
  title: {
    fontSize: 24, // Adjust font size here
    fontWeight: 'bold',
    color: 'black',
    paddingRight: 20, // Add padding to move it right
  },
  hamburgerIcon: {
    position: 'absolute', // Position the icon absolutely
    left: 15, // Keep the icon aligned to the left
    padding: 5,
  },
  branchName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignItems: 'center',
  },
  mainContent: {
    paddingTop: 20, // Adjusted for the fixed header
    paddingBottom: 20,
    paddingHorizontal: 15,
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
    voltageInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    voltageCard: {
      width: '30%',
      padding: 10,
      backgroundColor: '#aecce4',
      borderRadius: 5,
      alignItems: 'center',
    },
    voltageTitle: {
      fontSize: 12,
      color: '#007BFF',
      marginBottom: 5,
      textAlign: 'center',
    },
    voltageValue: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    lastUpdateCard: {
      backgroundColor: '#aecce4',
      borderRadius: 8,
      elevation: 2,
      padding: 15,
      marginVertical: 10,
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 5,
    },
    lastUpdate: {
      alignItems: 'center',
      marginBottom: 20,
    },
    lastUpdateText: {
      fontSize: 14,
      color: '#333',
    },
    lastUpdateTime: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    chartContainer: {
      marginBottom: 30,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    legendText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    chart: {
      marginVertical: 10,
      borderRadius: 10,
    },
    chartConfig: {
      backgroundColor: '#fff',
      backgroundGradientFrom: '#aecce4',
      backgroundGradientTo: '#f0f0f0',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.5,
    },
    batteryInfo: {
      marginVertical: 20,
      backgroundColor: '#aecce4',
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 2,
      alignItems: 'center',
    },
    batteryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    batteryContainer: {
      width: '100%',
      height: 50,
      position: 'relative',
      marginVertical: 10,
    },
    batteryShape: {
      height: 30,
      width: '90%',
      backgroundColor: '#D8D8D8',
      borderRadius: 5,
      position: 'absolute',
      top: 10,
      left: '5%',
    },
    batteryLevel: {
      height: '100%',
      width: '80%', // Adjust this for battery level
      backgroundColor: '#29ab87',
      borderRadius: 5,
    },
    batteryIndicator: {
      position: 'absolute',
      top: 0,
      left: '5%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    batteryPercentText: {
      color: '#000',
      fontWeight: 'bold',
    },
    batteryStatus: {
      fontSize: 14,
      color: '#555',
    },
    notifications: {
      marginBottom: 20,
    },
    notificationsCard: {
      padding: 20,
      borderRadius: 10,
      backgroundColor: '#f8d7da',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    notificationTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    notificationCard: {
      backgroundColor: '#f8d7da',
      padding: 10,
      borderRadius: 5,
    },
    notificationText: {
      fontSize: 14,
      color: '#721c24',
    },
    parameterLog: {
      marginBottom: 20,
      paddingHorizontal: 5, // Added padding to ensure heading stays inside
    },
    parameterLogTitle: {
      fontSize: 20, // Increased size for visibility
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center', // Ensure the heading is centered properly
    },
    logTableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#aecce4',
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderRadius: 5, // Added radius for better appearance
    },
    tableHeaderText: {
      flex: 1,
      fontSize: 12,
      color: '#000000',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    logRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 5,
      backgroundColor: '#f0f0f0',
      marginBottom: 5,
      borderRadius: 5,
    },
    logText: {
      flex: 1,
      fontSize: 12,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background for modal
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
  

export default UserPage;
