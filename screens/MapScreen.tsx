// screens/MapScreen.tsx
// Map screen for FieldReportX
// Shows all submitted reports as markers on a map

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { auth, getUserReports, Report } from '../services/firebase';

export default function MapScreen() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    getLocationAndReports();
  }, []);

  const getLocationAndReports = async () => {
    try {
      // Get current location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }

      // Get reports from Firestore
      const user = auth.currentUser;
      if (user) {
        const userReports = await getUserReports(user.uid);
        // Filter reports that have GPS coordinates
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Map</Text>
        <Text style={styles.headerSubtitle}>
          {reports.length} report{reports.length !== 1 ? 's' : ''} on map
        </Text>
      </View>

      {/* Map */}
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
            pinColor="#1a1a2e"
            onPress={() => setSelectedReport(report)}
          />
        ))}

        {/* Circle around current location */}
        {currentLocation && (
          <Circle
            center={currentLocation}
            radius={100}
            fillColor="rgba(26, 26, 46, 0.1)"
            strokeColor="rgba(26, 26, 46, 0.3)"
            strokeWidth={1}
          />
        )}
      </MapView>

      {/* Selected Report Card */}
      {selectedReport && (
        <View style={styles.reportCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedReport(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.reportTitle}>{selectedReport.title}</Text>
          <Text style={styles.reportDetail}>
            📍 {selectedReport.location}
          </Text>
          <Text style={styles.reportDetail} numberOfLines={2}>
            📝 {selectedReport.notes}
          </Text>
        </View>
      )}

      {/* Refresh Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={getLocationAndReports}
      >
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
  reportCard: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#999',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
    marginRight: 24,
  },
  reportDetail: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});