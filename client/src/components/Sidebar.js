import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const Sidebar = ({ onNavigate, closeSidebar }) => {
  const [showTicketOptions, setShowTicketOptions] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={closeSidebar}>
      <View style={styles.overlay}>
        {/* Sidebar Content */}
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.sidebar}>
            {/* Close Button */}
            <TouchableOpacity onPress={closeSidebar} style={styles.closeButtonContainer}>
            </TouchableOpacity>

            {/* ScrollView for Better Navigation on Smaller Screens */}
            <ScrollView>
              {/* Sidebar Header */}
              <Text style={styles.header}>SMARTIC HYBRID POWER MANAGEMENT SYSTEM</Text>

              {/* Navigation Options with Icons */}
              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Home')}>
                <Icon name="home" size={20} color="#343a40" />
                <Text style={styles.option}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('DataSummary')}>
                <Icon name="list-alt" size={20} color="#343a40" />
                <Text style={styles.option}>Data Summary</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('VoltageCharts')}>
                <Icon name="bar-chart" size={20} color="#343a40" />
                <Text style={styles.option}>Voltage Charts</Text>
              </TouchableOpacity>

              {/* Tickets with Sub-options */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setShowTicketOptions(!showTicketOptions)}
              >
                <Icon name="ticket" size={20} color="#343a40" />
                <Text style={styles.option}>Tickets</Text>
                <Icon
                  name={showTicketOptions ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#343a40"
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>

              {showTicketOptions && (
                <View style={styles.subOptionsContainer}>
                  <TouchableOpacity style={styles.subMenuItem} onPress={() => onNavigate('OpenTickets')}>
                    <Icon name="file" size={18} color="#6c757d" />
                    <Text style={styles.subOption}>Open Tickets</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.subMenuItem} onPress={() => onNavigate('TicketSummary')}>
                    <Icon name="file-text" size={18} color="#6c757d" />
                    <Text style={styles.subOption}>Ticket Summary</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent overlay
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999, // Ensure the overlay is above other components
  },
  sidebar: {
    width: '70%',  // Sidebar will take 70% of the screen width
    backgroundColor: '#ffffff',  // Light grey background
    padding: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 30,
    color: '#000000',  // Black close button
  },
  header: {
    color: '#343a40',  // Darker color for header text
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  chevronIcon: {
    marginLeft: 'auto', // Ensures the chevron icon is at the far right
  },
  option: {
    color: '#343a40',
    fontSize: 16,
    marginLeft: 15,
  },
  subOptionsContainer: {
    paddingLeft: 35,
    marginTop: 10,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subOption: {
    color: '#6c757d',
    fontSize: 14,
    marginLeft: 15,
  },
});

export default Sidebar;
