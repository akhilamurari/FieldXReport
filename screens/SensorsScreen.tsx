// screens/SensorsScreen.tsx
// Sensors screen for FieldReportX
// Displays real-time accelerometer data and device movement detection

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function SensorsScreen({ navigation }: any) {
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [movementStatus, setMovementStatus] = useState('Stationary');
  const [shakeCount, setShakeCount] = useState(0);

  useEffect(() => {
    return () => {
      // Clean up subscription when screen unmounts
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  // Detect movement based on acceleration values
  const detectMovement = (x: number, y: number, z: number) => {
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    if (magnitude > 2.5) {
      setMovementStatus('🚨 Shake Detected!');
      setShakeCount((prev) => prev + 1);
      Alert.alert(
        'Shake Detected!',
        'Device shake detected during inspection.'
      );
    } else if (magnitude > 1.5) {
      setMovementStatus('🏃 Moving');
    } else {
      setMovementStatus('✅ Stationary');
    }
  };

  // Start accelerometer monitoring
  const startMonitoring = () => {
    Accelerometer.setUpdateInterval(500);
    const sub = Accelerometer.addListener((data) => {
      setAccelerometerData(data);
      detectMovement(data.x, data.y, data.z);
    });
    setSubscription(sub);
    setIsMonitoring(true);
  };

  // Stop accelerometer monitoring
  const stopMonitoring = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setIsMonitoring(false);
    setMovementStatus('Stationary');
  };

  // Get colour based on movement status
  const getStatusColour = () => {
    if (movementStatus.includes('Shake')) return '#dc3545';
    if (movementStatus.includes('Moving')) return '#ffa500';
    return '#28a745';
  };

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sensors</Text>
      </View>

      {/* Movement Status Card */}
      <View
        style={[
          styles.statusCard,
          { borderLeftColor: getStatusColour() },
        ]}
      >
        <Text style={styles.statusLabel}>Movement Status</Text>
        <Text
          style={[
            styles.statusValue,
            { color: getStatusColour() },
          ]}
        >
          {movementStatus}
        </Text>
        <Text style={styles.shakeCount}>
          Shakes detected: {shakeCount}
        </Text>
      </View>

      {/* Accelerometer Data Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Accelerometer Data</Text>
        <Text style={styles.cardSubtitle}>
          Real-time X, Y, Z acceleration values
        </Text>

        {/* X Axis */}
        <View style={styles.axisRow}>
          <Text style={styles.axisLabel}>X Axis</Text>
          <View style={styles.axisBarContainer}>
            <View
              style={[
                styles.axisBar,
                {
                  width: `${Math.min(
                    Math.abs(accelerometerData.x) * 50,
                    100
                  )}%`,
                  backgroundColor: '#4a90d9',
                },
              ]}
            />
          </View>
          <Text style={styles.axisValue}>
            {accelerometerData.x.toFixed(3)}
          </Text>
        </View>

        {/* Y Axis */}
        <View style={styles.axisRow}>
          <Text style={styles.axisLabel}>Y Axis</Text>
          <View style={styles.axisBarContainer}>
            <View
              style={[
                styles.axisBar,
                {
                  width: `${Math.min(
                    Math.abs(accelerometerData.y) * 50,
                    100
                  )}%`,
                  backgroundColor: '#28a745',
                },
              ]}
            />
          </View>
          <Text style={styles.axisValue}>
            {accelerometerData.y.toFixed(3)}
          </Text>
        </View>

        {/* Z Axis */}
        <View style={styles.axisRow}>
          <Text style={styles.axisLabel}>Z Axis</Text>
          <View style={styles.axisBarContainer}>
            <View
              style={[
                styles.axisBar,
                {
                  width: `${Math.min(
                    Math.abs(accelerometerData.z) * 50,
                    100
                  )}%`,
                  backgroundColor: '#ffa500',
                },
              ]}
            />
          </View>
          <Text style={styles.axisValue}>
            {accelerometerData.z.toFixed(3)}
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ How It Works</Text>
        <Text style={styles.infoText}>
          The accelerometer measures device movement in three axes.
          In FieldReportX this is used to detect if a field worker
          is stationary or moving during an inspection, and to
          alert when unusual device movement occurs.
        </Text>
      </View>

      {/* Start/Stop Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isMonitoring ? styles.stopButton : styles.startButton,
        ]}
        onPress={isMonitoring ? stopMonitoring : startMonitoring}
      >
        <Text style={styles.buttonText}>
          {isMonitoring
            ? '⏹ Stop Monitoring'
            : '▶️ Start Monitoring'}
        </Text>
      </TouchableOpacity>

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={() => setShakeCount(0)}
      >
        <Text style={styles.resetButtonText}>Reset Shake Count</Text>
      </TouchableOpacity>

      <View style={styles.footer} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shakeCount: {
    fontSize: 13,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  axisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  axisLabel: {
    width: 50,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  axisBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  axisBar: {
    height: 12,
    borderRadius: 6,
  },
  axisValue: {
    width: 55,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  infoCard: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  button: {
    margin: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#28a745',
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#666',
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    height: 40,
  },
});