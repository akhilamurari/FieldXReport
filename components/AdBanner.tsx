// components/AdBanner.tsx
// Mock AdMob banner for Expo Go development
// Real AdMob banner will load in production APK build

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.adLabel}>Advertisement</Text>
      <View style={styles.adBanner}>
        <Text style={styles.adText}>
          🏗️ FieldReportX Pro — Upgrade for unlimited reports
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  adLabel: {
    fontSize: 10,
    color: '#aaa',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  adBanner: {
    backgroundColor: '#e8f5f5',
    borderWidth: 1,
    borderColor: '#0d7377',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: 320,
    alignItems: 'center',
  },
  adText: {
    fontSize: 13,
    color: '#0d7377',
    fontWeight: '600',
  },
});