// SuperAdminPage.js

import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import config from '../../ipconfig';


const SuperAdminPage = ({ navigation }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState('All Sites');
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);


    // Set header options including the Logout button
    useEffect(() => {
      navigation.setOptions({
        title: 'Super Admin',
        drawerLabel: 'Super Admin',
        headerTitleStyle: {
          color: 'black',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerRight: () => (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginRight: 10 }}>
            <Image source={require('../assets/logout-8.png')} style={{ width: 22, height: 22 }} />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);


  // Function to fetch sites from the server
  const fetchSites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get(`${config.baseUrl}/api/sites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSites(response.data); // Update the state with the fetched data
    } catch (error) {
      console.error('Error fetching sites:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Stop loading once the fetch is done
    }
  };

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchSites(); // Initial fetch when component loads

    // Add listener to refetch data when the page is focused
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSites(); // Fetch again when returning to this screen
    });

    return unsubscribe; // Clean up the listener when component unmounts
  }, [navigation]);

  const filteredSites = sites.filter((site) => {
    //console.log(`Site Bank Name: ${site.bank_name}, Selected Bank: ${selectedBank}`); // Debugging line
    if (selectedBank === 'All Sites') return true;
    return site.bank_name?.trim().toLowerCase() === selectedBank.trim().toLowerCase();
  });
  

  const handleBankSelection = (bankName) => {
    setSelectedBank(bankName);
  };

  const handleContactButtonPress = (site) => {
    Alert.alert(
      'Contact Information',
      `Contacting ${site.contact_person || 'N/A'}\nPhone: ${site.contact_phone || 'N/A'}\nEmail: ${site.contact_email || 'N/A'}`
    );
  };

  const handleSitePress = (site) => {
    navigation.navigate('UserPage', { branchName: site.branch_name });
  };

  const handleSiteHold = (site) => {
    setSelectedSite(site);
    setDeleteModalVisible(true);
  };

  const handleDeleteSite = async () => {
    if (!selectedSite) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`${config.baseUrl}/api/sites/${selectedSite.site_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        setSites(sites.filter(site => site.site_id !== selectedSite.site_id));
        setDeleteModalVisible(false);
        Alert.alert('Success', 'Site deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete site');
      }
    } catch (error) {
      console.error('Error deleting site:', error);
      Alert.alert('Error', 'An error occurred while deleting the site');
    }
  };
  
  

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login'); // Navigate to login screen after logout
  };

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this site?</Text>
            <TouchableOpacity onPress={handleDeleteSite} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Bank Selection Buttons */}
      <View style={styles.bankSelectionContainer}>
        <TouchableOpacity onPress={() => handleBankSelection('Meezan Bank')} style={styles.bankButton}>
          <Text style={styles.bankButtonText}>Meezan Bank</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBankSelection('Bank Islami')} style={styles.bankButton}>
          <Text style={styles.bankButtonText}>Bank Islami</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBankSelection('MCB Bank')} style={styles.bankButton}>
          <Text style={styles.bankButtonText}>MCB Bank</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleBankSelection('All Sites')} style={styles.bankButton}>
          <Text style={styles.bankButtonText}>All Sites</Text>
        </TouchableOpacity>
      </View>

      {/* Display Sites */}
      {loading ? (
        <Text style={styles.loadingText}>Loading sites...</Text>
      ) : filteredSites.length > 0 ? (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {filteredSites.map((site, index) => (
              <TouchableOpacity
                key={`${site.site_id}-${index}`}
                onLongPress={() => handleSiteHold(site)} // Trigger delete modal on hold
                onPress={() => handleSitePress(site)}
                style={styles.siteContainer}
              >
                <Image source={{ uri: site.logo_url }} style={styles.siteLogo} />
                <Text style={styles.branchText}>Branch Code: {site.branch_code || 'N/A'}</Text>
                <Text style={styles.branchText}>Branch Name: {site.branch_name || 'N/A'}</Text>
                <Text style={styles.branchText}>Device ID: {site.device_number || 'N/A'}</Text>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity onPress={() => handleContactButtonPress(site)} style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.noSitesText}>No sites available for {selectedBank}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    padding: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align logout icon to the right
    marginBottom: 10,
  },
  mainContent: {
    paddingTop: 80, // Adjusted for the fixed header
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: -10,
    textAlign: 'space-between',
  },
  logoutButton: {
    position: 'absolute',
    top: -18,
    right: 0,
  },
  icon: {
    width: 24,
    height: 24, // Adjust the width and height as needed
  },
  bankSelectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bankButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#aecce4',
    borderRadius: 5,
  },
  bankButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  siteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent background for site container
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '48%', // Adjust width to fit two items per row
  },
  siteLogo: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
    alignSelf: 'center',
  },
  branchText: {
    fontSize: 12,
    color: '#333333', // Dark gray text for readability
    marginVertical: 2,
  },
  buttonWrapper: {
    marginTop: 'auto', // Push button to the bottom
  },
  contactButton: {
    marginTop: 5,
    paddingVertical: 8,
    backgroundColor: '#aecce4', // Button color
    borderRadius: 5,
  },
  contactButtonText: {
    color: '#000000', // Black text
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noSitesText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginTop: 20,
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

export default SuperAdminPage;
