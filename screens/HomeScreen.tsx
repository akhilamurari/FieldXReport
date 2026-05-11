// screens/HomeScreen.tsx
// Home screen for FieldReportX
// Shows welcome message, battery level and quick actions

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import * as Battery from 'expo-battery';
import { auth, logoutUser } from '../services/firebase';

export default function HomeScreen({ navigation }: any) {
  const [batteryLevel, setBatteryLevel] = useState<number>(0);
  const [batteryState, setBatteryState] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Get current user
    const user = auth.currentUser;
    if (user) {
      setUserName(user.email || 'Field Worker');
    }

    // Get battery level
    const getBattery = async () => {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();
      setBatteryLevel(Math.round(level * 100));
      setBatteryState(
        state === Battery.BatteryState.CHARGING
          ? 'Charging'
          : 'Not Charging'
      );
    };
    getBattery();

    // Subscribe to battery updates
    const batterySubscription = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        setBatteryLevel(Math.round(batteryLevel * 100));
      }
    );

    return () => {
      batterySubscription.remove();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>FieldReportX</Text>
        <Text style={styles.subtitle}>Welcome, {userName}</Text>
      </View>

      {/* Battery Status Card */}
      <View style={styles.batteryCard}>
        <Text style={styles.cardTitle}>Battery Status</Text>
        <Text style={styles.batteryLevel}>{batteryLevel}%</Text>
        <View style={styles.batteryBar}>
          <View
            style={[
              styles.batteryFill,
              {
                width: `${batteryLevel}%` as any,
                backgroundColor:
                  batteryLevel < 20
                    ? '#dc3545'
                    : batteryLevel < 50
                    ? '#ffa500'
                    : '#28a745',
              },
            ]}
          />
        </View>
        <Text style={styles.batteryState}>{batteryState}</Text>
        {batteryLevel < 20 && (
          <Text style={styles.batteryWarning}>
            ⚠️ Low battery — please charge your device
          </Text>
        )}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      {/* New Field Report */}
      <TouchableOpacity
        style={[styles.actionButton, styles.primaryButton]}
        onPress={() => navigation.navigate('NewReport')}
      >
        <Text style={styles.actionButtonText}>
          📋 New Field Report
        </Text>
      </TouchableOpacity>

      {/* My Reports */}
      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => navigation.navigate('MyReports')}
      >
        <Text style={styles.actionButtonText}>📁 My Reports</Text>
      </TouchableOpacity>

      {/* View Map */}
      <TouchableOpacity
        style={[styles.actionButton, styles.mapButton]}
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={styles.actionButtonText}>🗺️ View Map</Text>
      </TouchableOpacity>

      {/* Sensors */}
      <TouchableOpacity
        style={[styles.actionButton, styles.sensorsButton]}
        onPress={() => navigation.navigate('Sensors')}
      >
        <Text style={styles.actionButtonText}>📡 Sensors</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.actionButton, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.actionButtonText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FieldReportX v1.0.0</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  batteryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  batteryLevel: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  batteryBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  batteryFill: {
    height: 8,
    borderRadius: 4,
  },
  batteryState: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  batteryWarning: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#1a1a2e',
  },
  secondaryButton: {
    backgroundColor: '#4a90d9',
  },
  mapButton: {
    backgroundColor: '#28a745',
  },
  sensorsButton: {
    backgroundColor: '#6f42c1',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});