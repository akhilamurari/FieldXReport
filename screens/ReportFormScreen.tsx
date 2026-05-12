// screens/ReportFormScreen.tsx
// Report form screen for FieldReportX
// Professional redesign with teal and gold theme

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
  StatusBar,
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
              Alert.alert('Permission Denied', 'Camera permission is required');
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

  const handleSubmit = async () => {
    if (!title || !notes) {
      Alert.alert('Missing Fields', 'Please fill in title and notes');
      return;
    }
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }
      const firebaseId = await addReport({
        title,
        notes,
        location,
        status: 'submitted',
        userId: user.uid,
        latitude: latitude || 0,
        longitude: longitude || 0,
        photoUrl: photo || '',
      });
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
      await sendReportSubmittedNotification(title);
      Alert.alert(
        '✅ Report Submitted',
        'Your field report has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d7377" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Field Report</Text>
        <Text style={styles.headerSubtitle}>
          Fill in the details below
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Report Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📋 Report Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter report title"
            placeholderTextColor="#aaa"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📍 Location</Text>
          <View style={styles.locationRow}>
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Fetching location..."
              placeholderTextColor="#aaa"
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
          {latitude && longitude && (
            <View style={styles.gpsTag}>
              <Text style={styles.gpsText}>
                🛰️ GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📝 Notes *</Text>
          <TextInput
            style={styles.inputMultiline}
            placeholder="Enter inspection notes..."
            placeholderTextColor="#aaa"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={5}
          />
        </View>

        {/* Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>📷 Photo</Text>
          {photo ? (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photo }}
                style={styles.photoPreview}
              />
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={handlePhoto}
              >
                <Text style={styles.changePhotoText}>
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.photoButton}
              onPress={handlePhoto}
            >
              <Text style={styles.photoButtonIcon}>📷</Text>
              <Text style={styles.photoButtonText}>Add Photo</Text>
              <Text style={styles.photoButtonSubtext}>
                Take photo or choose from gallery
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Report →
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer} />

      </ScrollView>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14213d',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#14213d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputMultiline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#14213d',
    height: 140,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  locationInput: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#0d7377',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 22,
  },
  gpsTag: {
    backgroundColor: '#e8f5f5',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  gpsText: {
    fontSize: 12,
    color: '#0d7377',
    fontWeight: '600',
  },
  photoButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  photoButtonIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14213d',
    marginBottom: 4,
  },
  photoButtonSubtext: {
    fontSize: 12,
    color: '#aaa',
  },
  photoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  changePhotoButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    alignItems: 'center',
    marginTop: -40,
  },
  changePhotoText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#0d7377',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#0d7377',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    height: 40,
  },
});