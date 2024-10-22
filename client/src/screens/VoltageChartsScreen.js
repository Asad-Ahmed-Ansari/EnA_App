import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VoltageChartsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false); // For logout modal

  useEffect(() => {
    navigation.setOptions({
      title: 'Voltage Charts',
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


  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login'); // Navigate to login screen after logout
  };

  // Sample data for charts
  const chartData = {
    generator: [220, 230, 215, 240, 235, 250],
    utility: [120, 140, 130, 150, 145, 160],
    battery: [50, 55, 45, 60, 65, 70],
  };

  const renderChart = (chartType, title, color) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title} Voltage Chart</Text>
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              data: chartData[chartType],
              color: () => color, // Chart color based on chart type
            },
          ],
        }}
        width={Dimensions.get('window').width - 30} // Width of chart
        height={220} // Height of chart
        yAxisSuffix="V"
        chartConfig={styles.chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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


      {/* Render all charts on one screen with scrollable view */}
      {renderChart('generator', 'Generator', '#ffce56')}
      {renderChart('utility', 'Utility', '#ff6384')}
      {renderChart('battery', 'Battery', '#36a2eb')}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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
  chart: {
    borderRadius: 10,
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

export default VoltageChartsScreen;
