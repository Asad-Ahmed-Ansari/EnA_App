import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Alert, ScrollView, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import config from '../../ipconfig';




const AdminPage = ({ navigation }) => {
  const [sites, setSites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);


      // Set header options including the Logout button
      useEffect(() => {
        navigation.setOptions({
          title: user ? `${user.bank} Admin` : 'Loading...',
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
              <Image source={require('../assets/logout-8.png')} style={{ width: 22, height: 22 }} />
            </TouchableOpacity>
          ),
        });
      }, [navigation, user ]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userResponse = await axios.get(`${config.baseUrl}/api/users/user-info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${config.baseUrl}/api/sites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSites(response.data);
      } catch (error) {
        console.error('Error fetching sites:', error);
      }
    };

    if (user) {
      fetchSites();
    }
  }, [user]);

  const filteredSites = sites.filter(site => {
    if (user && user.bank && site.bank_name) {
      return site.bank_name?.trim().toLowerCase() === user.bank.trim().toLowerCase();
    }
    return false;
});



  const handleContactButtonPress = (site) => {
    Alert.alert(
      'Contact Information',
      `Contacting ${site.contact_person || 'N/A'}\nPhone: ${site.contact_phone || 'N/A'}\nEmail: ${site.contact_email || 'N/A'}`
    );
  };

  const handleSitePress = (site) => {
    navigation.navigate('UserPage', { branchName: site.branch_name });
  };

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

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {filteredSites.length > 0 ? (
            <View style={styles.grid}>
              {filteredSites.map((site, index) => (
                <TouchableOpacity
                  key={`${site.site_id}-${index}`}
                  onPress={() => handleSitePress(site)}
                  style={styles.siteContainer}
                >
                  <Image source={{ uri: site.logo_url }} style={styles.siteLogo} />
                  <Text style={styles.branchText}>Branch Code: {site.branch_code || 'N/A'}</Text>
                  <Text style={styles.branchText}>Branch Name: {site.branch_name || 'N/A'}</Text>
                  <Text style={styles.branchText}>Device ID: {site.device_number || 'N/A'}</Text>
                  <TouchableOpacity onPress={() => handleContactButtonPress(site)} style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noSitesText}>...</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  
  navbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns logout icon to the right
    backgroundColor: '#ffffff', // Make background white to match screen
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 5, // To add a slight shadow effect
    zIndex: 1000,
  },
  mainContent: {
    paddingTop: 80, // Adjusted for the fixed header
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'space-between',
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
  scrollContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  siteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '48%',
  },
  siteLogo: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
    alignSelf: 'center',
  },
  branchText: {
    fontSize: 12,
    color: '#333333',
    marginVertical: 2,
  },
  contactButton: {
    marginTop: 5,
    paddingVertical: 8,
    backgroundColor: '#aecce4',
    borderRadius: 5,
  },
  contactButtonText: {
    color: '#000000',
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

export default AdminPage;
