// screens/SensorsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SensorsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sensors Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
});