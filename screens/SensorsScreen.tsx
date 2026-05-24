// screens/SensorsScreen.tsx
// Sensors screen for FieldReportX
// Professional redesign with teal and gold theme

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
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
  const [magnitude, setMagnitude] = useState(0);

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  const detectMovement = (x: number, y: number, z: number) => {
    const mag = Math.sqrt(x * x + y * y + z * z);
    setMagnitude(mag);

    if (mag > 2.5) {
      setMovementStatus('Shake Detected!');
      setShakeCount((prev) => prev + 1);
      Alert.alert(
        '⚠️ Shake Detected',
        'Unusual device movement detected during inspection.',
        [{ text: 'OK' }]
      );
    } else if (mag > 1.5) {
      setMovementStatus('Moving');
    } else {
      setMovementStatus('Stationary');
    }
  };

  const startMonitoring = () => {
    Accelerometer.setUpdateInterval(500);
    const sub = Accelerometer.addListener((data) => {
      setAccelerometerData(data);
      detectMovement(data.x, data.y, data.z);
    });
    setSubscription(sub);
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setIsMonitoring(false);
    setMovementStatus('Stationary');
    setMagnitude(0);
  };

  const getStatusColour = () => {
    if (movementStatus.includes('Shake')) return '#e63946';
    if (movementStatus.includes('Moving')) return '#f4a261';
    return '#2d6a4f';
  };

  const getStatusIcon = () => {
    if (movementStatus.includes('Shake')) return '🚨';
    if (movementStatus.includes('Moving')) return '🏃';
    return '✅';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d7377" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sensors</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Movement Status Card */}
        <View
          style={[
            styles.statusCard,
            { borderLeftColor: getStatusColour() },
          ]}
        >
          <View style={styles.statusHeader}>
            <Text style={styles.statusLabel}>Movement Status</Text>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isMonitoring
                    ? '#2d6a4f'
                    : '#ccc',
                },
              ]}
            />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusIcon}>
              {getStatusIcon()}
            </Text>
            <Text
              style={[
                styles.statusValue,
                { color: getStatusColour() },
              ]}
            >
              {movementStatus}
            </Text>
          </View>
          <View style={styles.statusDetails}>
            <View style={styles.statusDetailItem}>
              <Text style={styles.statusDetailLabel}>
                Magnitude
              </Text>
              <Text style={styles.statusDetailValue}>
                {magnitude.toFixed(3)}
              </Text>
            </View>
            <View style={styles.statusDetailDivider} />
            <View style={styles.statusDetailItem}>
              <Text style={styles.statusDetailLabel}>
                Shakes
              </Text>
              <Text style={styles.statusDetailValue}>
                {shakeCount}
              </Text>
            </View>
            <View style={styles.statusDetailDivider} />
            <View style={styles.statusDetailItem}>
              <Text style={styles.statusDetailLabel}>
                Status
              </Text>
              <Text style={styles.statusDetailValue}>
                {isMonitoring ? '🟢 Live' : '⚫ Off'}
              </Text>
            </View>
          </View>
        </View>

        {/* Accelerometer Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 Accelerometer</Text>
          <Text style={styles.cardSubtitle}>
            Real-time X, Y, Z acceleration values (g-force)
          </Text>

          {/* X Axis */}
          <View style={styles.axisContainer}>
            <View style={styles.axisHeader}>
              <View
                style={[
                  styles.axisLabel,
                  { backgroundColor: '#e8f0fe' },
                ]}
              >
                <Text
                  style={[
                    styles.axisLabelText,
                    { color: '#4a90d9' },
                  ]}
                >
                  X
                </Text>
              </View>
              <Text style={styles.axisValue}>
                {accelerometerData.x.toFixed(4)} g
              </Text>
            </View>
            <View style={styles.axisBarBg}>
              <View
                style={[
                  styles.axisBarFill,
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
          </View>

          {/* Y Axis */}
          <View style={styles.axisContainer}>
            <View style={styles.axisHeader}>
              <View
                style={[
                  styles.axisLabel,
                  { backgroundColor: '#e8f5ee' },
                ]}
              >
                <Text
                  style={[
                    styles.axisLabelText,
                    { color: '#2d6a4f' },
                  ]}
                >
                  Y
                </Text>
              </View>
              <Text style={styles.axisValue}>
                {accelerometerData.y.toFixed(4)} g
              </Text>
            </View>
            <View style={styles.axisBarBg}>
              <View
                style={[
                  styles.axisBarFill,
                  {
                    width: `${Math.min(
                      Math.abs(accelerometerData.y) * 50,
                      100
                    )}%`,
                    backgroundColor: '#2d6a4f',
                  },
                ]}
              />
            </View>
          </View>

          {/* Z Axis */}
          <View style={styles.axisContainer}>
            <View style={styles.axisHeader}>
              <View
                style={[
                  styles.axisLabel,
                  { backgroundColor: '#fff3e0' },
                ]}
              >
                <Text
                  style={[
                    styles.axisLabelText,
                    { color: '#f4a261' },
                  ]}
                >
                  Z
                </Text>
              </View>
              <Text style={styles.axisValue}>
                {accelerometerData.z.toFixed(4)} g
              </Text>
            </View>
            <View style={styles.axisBarBg}>
              <View
                style={[
                  styles.axisBarFill,
                  {
                    width: `${Math.min(
                      Math.abs(accelerometerData.z) * 50,
                      100
                    )}%`,
                    backgroundColor: '#f4a261',
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            ℹ️ How FieldReportX Uses Sensors
          </Text>
          <Text style={styles.infoText}>
            The accelerometer detects device movement during field
            inspections. FieldReportX uses this to identify if a
            field worker is stationary or moving, and alerts when
            unusual device movement occurs that could indicate a
            dropped device or safety incident.
          </Text>
        </View>

        {/* Start/Stop Button */}
        <TouchableOpacity
          style={[
            styles.mainButton,
            isMonitoring
              ? styles.stopButton
              : styles.startButton,
          ]}
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <Text style={styles.mainButtonText}>
            {isMonitoring
              ? '⏹ Stop Monitoring'
              : '▶️ Start Monitoring'}
          </Text>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            setShakeCount(0);
            setMagnitude(0);
          }}
        >
          <Text style={styles.resetButtonText}>
            Reset Counters
          </Text>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSpacer: {
    width: 50,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 32,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statusDetails: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
  },
  statusDetailItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDetailLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  statusDetailValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#14213d',
  },
  statusDetailDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14213d',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 20,
  },
  axisContainer: {
    marginBottom: 16,
  },
  axisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  axisLabel: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  axisLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  axisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14213d',
  },
  axisBarBg: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  axisBarFill: {
    height: 8,
    borderRadius: 4,
  },
  infoCard: {
    backgroundColor: '#e8f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0d7377',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0d7377',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  mainButton: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButton: {
    backgroundColor: '#0d7377',
    shadowColor: '#0d7377',
  },
  stopButton: {
    backgroundColor: '#e63946',
    shadowColor: '#e63946',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resetButton: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    height: 40,
  },
});