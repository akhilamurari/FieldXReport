// screens/MyReportsScreen.tsx
// My Reports screen for FieldReportX
// Professional redesign with teal and gold theme

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
  StatusBar,
} from 'react-native';
import { auth, getUserReports, Report } from '../services/firebase';

export default function MyReportsScreen({ navigation }: any) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);
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
        <ActivityIndicator size="large" color="#0d7377" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0d7377" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {reports.length}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0d7377"
          />
        }
      >

        {/* Empty State */}
        {reports.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
            </View>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptyText}>
              Your submitted field reports will appear here.
              Pull down to refresh.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              All Reports — Pull to refresh
            </Text>
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() =>
                  navigation.navigate('ReportDetail', { report })
                }
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.statusBadge,
                      report.status === 'submitted'
                        ? styles.statusSubmitted
                        : styles.statusDraft,
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {report.status === 'submitted'
                        ? '✅ Submitted'
                        : '📝 Draft'}
                    </Text>
                  </View>
                  <Text style={styles.cardArrow}>→</Text>
                </View>

                {/* Report Title */}
                <Text style={styles.reportTitle}>
                  {report.title}
                </Text>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Details */}
                <View style={styles.cardDetails}>
                  <View style={styles.cardDetailRow}>
                    <Text style={styles.cardDetailIcon}>📍</Text>
                    <Text
                      style={styles.cardDetailText}
                      numberOfLines={1}
                    >
                      {report.location || 'No location'}
                    </Text>
                  </View>
                  <View style={styles.cardDetailRow}>
                    <Text style={styles.cardDetailIcon}>📝</Text>
                    <Text
                      style={styles.cardDetailText}
                      numberOfLines={2}
                    >
                      {report.notes}
                    </Text>
                  </View>
                  <View style={styles.cardDetailRow}>
                    <Text style={styles.cardDetailIcon}>🕐</Text>
                    <Text style={styles.cardDetailText}>
                      {formatDate(report.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Photo Indicator */}
                {report.photoUrl && (
                  <View style={styles.photoIndicator}>
                    <Text style={styles.photoIndicatorText}>
                      📷 Photo attached
                    </Text>
                  </View>
                )}

              </TouchableOpacity>
            ))}
          </>
        )}

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
    paddingBottom: 24,
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
  headerBadge: {
    backgroundColor: '#f4a261',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#e8f5f5',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#14213d',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#0d7377',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusSubmitted: {
    backgroundColor: '#e8f5ee',
  },
  statusDraft: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2d6a4f',
  },
  cardArrow: {
    fontSize: 18,
    color: '#0d7377',
    fontWeight: 'bold',
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#14213d',
    marginBottom: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  cardDetails: {
    gap: 8,
  },
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardDetailIcon: {
    fontSize: 14,
    width: 20,
  },
  cardDetailText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  photoIndicator: {
    backgroundColor: '#e8f5f5',
    borderRadius: 8,
    padding: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  photoIndicatorText: {
    fontSize: 12,
    color: '#0d7377',
    fontWeight: '600',
  },
  footer: {
    height: 40,
  },
});