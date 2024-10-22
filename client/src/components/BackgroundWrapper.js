// src/components/BackgroundWrapper.js
import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import background from '../assets/background.jpg';

const BackgroundWrapper = ({ children }) => {
  return (
    <ImageBackground
    source={require('../assets/background.jpg')} // Use a consistent background image
    style={commonStyles.backgroundImage}
    >
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(17, 26, 34, 0.7)',  // Matching the overlay style to your current design
  },
});

export default BackgroundWrapper;
