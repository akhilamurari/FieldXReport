// screens/HomeScreen.tsx
// Home screen for FieldReportX
// Professional redesign with teal and gold theme
// Includes AdMob banner advertisement

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import * as Battery from 'expo-battery';
import { auth, logoutUser } from '../services/firebase';
import AdBanner from '../components/AdBanner';

export default function HomeScreen({ navigation }: any) {
  const [batteryLevel, setBatteryLevel] = useState<number>(0);
  const [batteryState, setBatteryState] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Get current user
    const user = auth.currentUser;
    if (user) {
      setUserName(user.email || 'Field Worker');
    }

    // Get current date
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-AU', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();

    // Get battery level
    const getBattery = async () => {
      const level = await Battery.getBatteryLevelAsync();
      const state = await Battery.getBatteryStateAsync();
      setBatteryLevel(Math.round(level * 100));
      setBatteryState(
        state === Battery.BatteryState.CHARGING
          ? '⚡ Charging'
          : '🔋 On Battery'
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
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const getBatteryColour = () => {
    if (batteryLevel < 20) return '#e63946';
    if (batteryLevel < 50) return '#f4a261';
    return '#2d6a4f';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d7377" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Good day 👋</Text>
          <Text style={styles.headerName} numberOfLines={1}>
            {userName}
          </Text>
          <Text style={styles.headerDate}>{currentTime}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutIcon}
          onPress={handleLogout}
        >
          <Text style={styles.logoutIconText}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Battery Status Card */}
        <View style={styles.batteryCard}>
          <View style={styles.batteryHeader}>
            <Text style={styles.batteryTitle}>Device Status</Text>
            <Text style={styles.batteryStateText}>
              {batteryState}
            </Text>
          </View>
          <View style={styles.batteryRow}>
            <Text style={styles.batteryPercentage}>
              {batteryLevel}%
            </Text>
            <View style={styles.batteryBarContainer}>
              <View
                style={[
                  styles.batteryBarFill,
                  {
                    width: `${batteryLevel}%` as any,
                    backgroundColor: getBatteryColour(),
                  },
                ]}
              />
            </View>
          </View>
          {batteryLevel < 20 && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>
                ⚠️ Low battery — charge before heading to field
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📋</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statLabel}>GPS Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>☁️</Text>
            <Text style={styles.statLabel}>Synced</Text>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        {/* Action Grid */}
        <View style={styles.actionGrid}>

          {/* New Report */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardPrimary]}
            onPress={() => navigation.navigate('NewReport')}
          >
            <Text style={styles.actionCardIcon}>📋</Text>
            <Text style={styles.actionCardTitle}>New Report</Text>
            <Text style={styles.actionCardSubtitle}>
              Submit field report
            </Text>
          </TouchableOpacity>

          {/* My Reports */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardSecondary]}
            onPress={() => navigation.navigate('MyReports')}
          >
            <Text style={styles.actionCardIcon}>📁</Text>
            <Text style={styles.actionCardTitle}>My Reports</Text>
            <Text style={styles.actionCardSubtitle}>
              View submitted
            </Text>
          </TouchableOpacity>

          {/* Map */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardMap]}
            onPress={() => navigation.navigate('Map')}
          >
            <Text style={styles.actionCardIcon}>🗺️</Text>
            <Text style={styles.actionCardTitle}>View Map</Text>
            <Text style={styles.actionCardSubtitle}>
              Report locations
            </Text>
          </TouchableOpacity>

          {/* Sensors */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardSensors]}
            onPress={() => navigation.navigate('Sensors')}
          >
            <Text style={styles.actionCardIcon}>📡</Text>
            <Text style={styles.actionCardTitle}>Sensors</Text>
            <Text style={styles.actionCardSubtitle}>
              Device motion
            </Text>
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            FieldReportX v1.0.0 — Report Smarter. Work Safer.
          </Text>
        </View>

      </ScrollView>

      {/* AdMob Banner at bottom of screen */}
      <AdBanner />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    backgroundColor: '#0d7377',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    maxWidth: 260,
  },
  headerDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  logoutIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIconText: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  batteryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  batteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  batteryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  batteryStateText: {
    fontSize: 13,
    color: '#0d7377',
    fontWeight: '600',
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  batteryPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14213d',
    width: 70,
  },
  batteryBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  batteryBarFill: {
    height: 10,
    borderRadius: 5,
  },
  warningBanner: {
    backgroundColor: '#fff3f3',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#e63946',
  },
  warningText: {
    fontSize: 12,
    color: '#e63946',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14213d',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '47%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  actionCardPrimary: {
    backgroundColor: '#0d7377',
  },
  actionCardSecondary: {
    backgroundColor: '#14213d',
  },
  actionCardMap: {
    backgroundColor: '#2d6a4f',
  },
  actionCardSensors: {
    backgroundColor: '#6f42c1',
  },
  actionCardIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 11,
    color: '#ccc',
  },
});