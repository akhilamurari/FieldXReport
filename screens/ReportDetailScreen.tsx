// screens/ReportDetailScreen.tsx
// Report detail screen for FieldReportX
// Shows full details of a submitted report

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function ReportDetailScreen({ route, navigation }: any) {
  // Get report data passed from MyReportsScreen
  const { report } = route.params;

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <Text style={styles.headerTitle}>Report Details</Text>
      </View>

      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          report.status === 'submitted'
            ? styles.statusSubmitted
            : styles.statusDraft,
        ]}
      >
        <Text style={styles.statusText}>
          {report.status.toUpperCase()}
        </Text>
      </View>

      {/* Report Title */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Report Title</Text>
        <Text style={styles.cardValue}>{report.title}</Text>
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Location</Text>
        <Text style={styles.cardValue}>
          📍 {report.location || 'No location recorded'}
        </Text>
        {report.latitude && report.longitude && (
          <Text style={styles.coordinates}>
            GPS: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      {/* Notes */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Notes</Text>
        <Text style={styles.cardValue}>{report.notes}</Text>
      </View>

      {/* Submitted At */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Submitted At</Text>
        <Text style={styles.cardValue}>
          🕐 {formatDate(report.createdAt)}
        </Text>
      </View>

      {/* Report ID */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Report ID</Text>
        <Text style={styles.reportId}>{report.id}</Text>
      </View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButtonBottom}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonBottomText}>
          ← Back to My Reports
        </Text>
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
  statusBadge: {
    margin: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusSubmitted: {
    backgroundColor: '#28a745',
  },
  statusDraft: {
    backgroundColor: '#ffa500',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 16,
    color: '#1a1a2e',
    lineHeight: 24,
  },
  coordinates: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  reportId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  backButtonBottom: {
    backgroundColor: '#1a1a2e',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonBottomText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    height: 40,
  },
});