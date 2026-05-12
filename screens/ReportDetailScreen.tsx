// screens/ReportDetailScreen.tsx
// Report detail screen for FieldReportX
// Professional redesign with teal and gold theme

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

export default function ReportDetailScreen({ route, navigation }: any) {
  const { report } = route.params;

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
        <Text style={styles.headerTitle}>Report Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            report.status === 'submitted'
              ? styles.statusBannerSubmitted
              : styles.statusBannerDraft,
          ]}
        >
          <Text style={styles.statusBannerIcon}>
            {report.status === 'submitted' ? '✅' : '📝'}
          </Text>
          <View>
            <Text style={styles.statusBannerTitle}>
              {report.status === 'submitted'
                ? 'Report Submitted'
                : 'Draft Report'}
            </Text>
            <Text style={styles.statusBannerDate}>
              {formatDate(report.createdAt)}
            </Text>
          </View>
        </View>

        {/* Photo */}
        {report.photoUrl ? (
          <View style={styles.photoCard}>
            <Image
              source={{ uri: report.photoUrl }}
              style={styles.photo}
              resizeMode="cover"
            />
            <View style={styles.photoOverlay}>
              <Text style={styles.photoOverlayText}>
                📷 Field Photo
              </Text>
            </View>
          </View>
        ) : null}

        {/* Report Title */}
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Text style={styles.cardIcon}>📋</Text>
            <Text style={styles.cardLabel}>Report Title</Text>
          </View>
          <Text style={styles.cardValue}>{report.title}</Text>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardLabel}>Location</Text>
          </View>
          <Text style={styles.cardValue}>
            {report.location || 'No location recorded'}
          </Text>
          {report.latitude && report.longitude && (
            <View style={styles.gpsTag}>
              <Text style={styles.gpsText}>
                🛰️ GPS: {report.latitude.toFixed(6)},{' '}
                {report.longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardLabel}>Inspection Notes</Text>
          </View>
          <Text style={styles.cardValue}>{report.notes}</Text>
        </View>

        {/* Submitted At */}
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Text style={styles.cardIcon}>🕐</Text>
            <Text style={styles.cardLabel}>Submitted At</Text>
          </View>
          <Text style={styles.cardValue}>
            {formatDate(report.createdAt)}
          </Text>
        </View>

        {/* Report ID */}
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Text style={styles.cardIcon}>🔖</Text>
            <Text style={styles.cardLabel}>Report ID</Text>
          </View>
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  statusBannerSubmitted: {
    backgroundColor: '#e8f5ee',
    borderLeftWidth: 4,
    borderLeftColor: '#2d6a4f',
  },
  statusBannerDraft: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 4,
    borderLeftColor: '#f4a261',
  },
  statusBannerIcon: {
    fontSize: 32,
  },
  statusBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14213d',
  },
  statusBannerDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  photoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  photo: {
    width: '100%',
    height: 240,
  },
  photoOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  photoOverlayText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    color: '#14213d',
    lineHeight: 24,
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
  reportId: {
    fontSize: 12,
    color: '#aaa',
    fontFamily: 'monospace',
  },
  backButtonBottom: {
    backgroundColor: '#0d7377',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0d7377',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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