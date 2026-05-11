// screens/MyReportsScreen.tsx
// My Reports screen for FieldReportX
// Shows all submitted reports from Firestore

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { auth, getUserReports, Report } from '../services/firebase';

export default function MyReportsScreen({ navigation }: any) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch reports from Firestore
  const fetchReports = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const userReports = await getUserReports(user.uid);
      setReports(userReports);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  // Format date
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <Text style={styles.header}>My Reports</Text>
      <Text style={styles.subheader}>
        {reports.length} report{reports.length !== 1 ? 's' : ''} found
      </Text>

      {/* Empty State */}
      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Reports Yet</Text>
          <Text style={styles.emptyText}>
            Your submitted reports will appear here
          </Text>
        </View>
      ) : (
        // Report Cards
        reports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            onPress={() =>
              navigation.navigate('ReportDetail', { report })
            }
          >
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
            <Text style={styles.reportTitle}>{report.title}</Text>

            {/* Location */}
            <Text style={styles.reportDetail}>
              📍 {report.location || 'No location'}
            </Text>

            {/* Notes Preview */}
            <Text style={styles.reportNotes} numberOfLines={2}>
              📝 {report.notes}
            </Text>

            {/* Date */}
            <Text style={styles.reportDate}>
              🕐 {formatDate(report.createdAt)}
            </Text>

            {/* Tap hint */}
            <Text style={styles.tapHint}>Tap to view details →</Text>

          </TouchableOpacity>
        ))
      )}

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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  statusSubmitted: {
    backgroundColor: '#28a745',
  },
  statusDraft: {
    backgroundColor: '#ffa500',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  reportDetail: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  reportNotes: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  tapHint: {
    fontSize: 11,
    color: '#4a90d9',
    marginTop: 8,
    textAlign: 'right',
  },
  footer: {
    height: 40,
  },
});