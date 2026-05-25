// screens/MapScreen.tsx
// Map screen for FieldReportX
// Shows all submitted reports as markers on a map
// iOS only — Android support coming in next update

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { auth, getUserReports, Report } from '../services/firebase';

// Only import maps on iOS
let MapView: any = null;
let Marker: any = null;
let Circle: any = null;

if (Platform.OS === 'ios') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Circle = Maps.Circle;
}

export default function MapScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(
    null
  );

  useEffect(() => {
    if (Platform.OS === 'ios') {
      getLocationAndReports();
    } else {
      setLoading(false);
    }
  }, []);

  const getLocationAndReports = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
      const user = auth.currentUser;
      if (user) {
        const userReports = await getUserReports(user.uid);
        const reportsWithLocation = userReports.filter(
          (r) => r.latitude && r.longitude
        );
        setReports(reportsWithLocation);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Show Android not supported screen
  if (Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0d7377"
        />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Report Map</Text>
          <Text style={styles.headerSubtitle}>
            View report locations
          </Text>
        </View>
        <View style={styles.unsupportedContainer}>
          <Text style={styles.unsupportedIcon}>🗺️</Text>
          <Text style={styles.unsupportedTitle}>
            Map Feature
          </Text>
          <Text style={styles.unsupportedText}>
            The interactive map is optimised for iOS devices.
            {'\n\n'}
            On Android, your reports are still saved with GPS
            coordinates and can be viewed in the My Reports screen.
            {'\n\n'}
            Full Android map support is planned for the next
            version of FieldReportX.
          </Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              📍 All reports are GPS tagged
            </Text>
            <Text style={styles.infoText}>
              📋 View reports in My Reports tab
            </Text>
            <Text style={styles.infoText}>
              🔄 Coordinates saved to Firebase
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d7377" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d7377" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Report Map</Text>
          <Text style={styles.headerSubtitle}>
            {reports.length} report{reports.length !== 1 ? 's' : ''} plotted
          </Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={getLocationAndReports}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Map - iOS Only */}
      {MapView && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.latitude || -37.8136,
            longitude: currentLocation?.longitude || 144.9631,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Report Markers */}
          {reports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.latitude || 0,
                longitude: report.longitude || 0,
              }}
              title={report.title}
              description={report.location}
              pinColor="#0d7377"
              onPress={() => setSelectedReport(report)}
            />
          ))}

          {/* Circle around current location */}
          {currentLocation && (
            <Circle
              center={currentLocation}
              radius={100}
              fillColor="rgba(13, 115, 119, 0.1)"
              strokeColor="rgba(13, 115, 119, 0.3)"
              strokeWidth={2}
            />
          )}
        </MapView>
      )}

      {/* Selected Report Card */}
      {selectedReport && (
        <View style={styles.reportCard}>
          <View style={styles.reportCardHeader}>
            <View style={styles.reportCardBadge}>
              <Text style={styles.reportCardBadgeText}>
                ✅ Submitted
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedReport(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.reportCardTitle}>
            {selectedReport.title}
          </Text>
          <View style={styles.reportCardDetail}>
            <Text style={styles.reportCardIcon}>📍</Text>
            <Text style={styles.reportCardText}>
              {selectedReport.location}
            </Text>
          </View>
          <View style={styles.reportCardDetail}>
            <Text style={styles.reportCardIcon}>📝</Text>
            <Text
              style={styles.reportCardText}
              numberOfLines={2}
            >
              {selectedReport.notes}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#0d7377',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  refreshButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 20,
  },
  map: {
    flex: 1,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  unsupportedIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  unsupportedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14213d',
    marginBottom: 16,
    textAlign: 'center',
  },
  unsupportedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#e8f5f5',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#0d7377',
    fontWeight: '600',
  },
  reportCard: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0d7377',
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportCardBadge: {
    backgroundColor: '#e8f5ee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  reportCardBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d6a4f',
  },
  closeButton: {
    width: 28,
    height: 28,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  reportCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14213d',
    marginBottom: 10,
  },
  reportCardDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  reportCardIcon: {
    fontSize: 14,
    width: 20,
  },
  reportCardText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});