import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

// Import the logo image
const logo = require('../assets/EnA_logorem.png'); // Adjust this path to your image location

const Loader = () => {
  const scale = useSharedValue(0);  // Shared value for scaling
  const opacity = useSharedValue(0);  // Shared value for fading in
  const rotate = useSharedValue(0);  // Shared value for rotating

  useEffect(() => {
    // Start the scaling, opacity, and rotation animation in sequence
    opacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

    scale.value = withSequence(
      withTiming(1, { duration: 1000 }),   // Scale from 0 to 1
      withSpring(1.1),                    // Slight overshoot for bounce
      withSpring(1)                       // Settle back to scale 1
    );

    rotate.value = withTiming(360, { duration: 1000 }); // Rotate by 360 degrees
  }, []);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` }, // Rotate by the given degrees
      ],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Animated logo image */}
      <Animated.Image
        source={logo}
        style={[styles.logo, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,  // Adjust width as necessary
    height: 200, // Adjust height as necessary
  },
});

export default Loader;
