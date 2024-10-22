import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationCard = ({ title, message }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 10, margin: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5 },
  title: { fontWeight: 'bold', fontSize: 16 },
  message: { fontSize: 14, color: '#555' },
});

export default NotificationCard;
