// screens/ReportFormScreen.tsx
// Report form screen for FieldReportX
// Handles field report creation with GPS, camera and notifications

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { auth, addReport } from '../services/firebase';
import { insertReport } from '../services/database';
import { sendReportSubmittedNotification } from '../services/notifications';

export default function ReportFormScreen() {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  // Get current GPS location
  const getLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLatitude(latitude);
      setLongitude(longitude);

      // Get human readable address
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (address.length > 0) {
        const addr = address[0];
        setLocation(
          `${addr.street || ''} ${addr.city || ''} ${addr.region || ''} ${addr.country || ''}`
            .trim()
        );
      }
    } catch (error: any) {
      Alert.alert('Location Error', error.message);
    } finally {
      setLocationLoading(false);
    }
  };

  // Take photo or pick from gallery
  const handlePhoto = async () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert(
                'Permission Denied',
                'Camera permission is required'
              );
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            });
            if (!result.canceled) {
              setPhoto(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            });
            if (!result.canceled) {
              setPhoto(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Submit report to Firebase and SQLite
  const handleSubmit = async () => {
    if (!title || !notes) {
      Alert.alert('Error', 'Please fill in title and notes');
      return;
    }
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      // Save to Firebase Firestore
      const firebaseId = await addReport({
        title,
        notes,
        location,
        status: 'submitted',
        userId: user.uid,
        latitude: latitude || 0,
        longitude: longitude || 0,
      });

      // Save to SQLite for offline access
      insertReport({
        firebaseId,
        title,
        notes,
        location,
        status: 'submitted',
        latitude: latitude || 0,
        longitude: longitude || 0,
        createdAt: new Date().toISOString(),
        synced: 1,
      });

      // Send push notification
      await sendReportSubmittedNotification(title);

      Alert.alert(
        'Success',
        'Report submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setTitle('');
              setNotes('');
              setPhoto(null);
              getLocation();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <Text style={styles.header}>New Field Report</Text>

      {/* Report Title */}
      <Text style={styles.label}>Report Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter report title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Location */}
      <Text style={styles.label}>Location</Text>
      <View style={styles.locationRow}>
        <TextInput
          style={[styles.input, styles.locationInput]}
          placeholder="Fetching location..."
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity
          style={styles.locationButton}
          onPress={getLocation}
        >
          {locationLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.locationButtonText}>📍</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* GPS Coordinates */}
      {latitude && longitude && (
        <Text style={styles.coordinates}>
          GPS: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Text>
      )}

      {/* Notes */}
      <Text style={styles.label}>Notes *</Text>
      <TextInput
        style={styles.inputMultiline}
        placeholder="Enter inspection notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
      />

      {/* Photo */}
      <Text style={styles.label}>Photo</Text>
      <TouchableOpacity
        style={styles.photoButton}
        onPress={handlePhoto}
      >
        <Text style={styles.photoButtonText}>
          {photo ? '📷 Change Photo' : '📷 Add Photo'}
        </Text>
      </TouchableOpacity>

      {/* Photo Preview */}
      {photo && (
        <Image
          source={{ uri: photo }}
          style={styles.photoPreview}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Report</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer} />

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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputMultiline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationInput: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#1a1a2e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  locationButtonText: {
    fontSize: 20,
  },
  coordinates: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  photoButton: {
    backgroundColor: '#4a90d9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  submitButton: {
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    height: 40,
  },
});