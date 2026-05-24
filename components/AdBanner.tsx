// components/AdBanner.tsx
// AdMob banner advertisement component for FieldReportX
// Displays Google AdMob test banner ad

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use test IDs for development
// Replace with real IDs before publishing to App Store
const adUnitId = Platform.select({
  ios: TestIds.BANNER,
  android: TestIds.BANNER,
}) as string;

export default function AdBanner() {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  return (
    <View style={styles.container}>
      {/* Ad Label */}
      <Text style={styles.adLabel}>Advertisement</Text>

      {/* AdMob Banner */}
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setAdLoaded(true);
          setAdError(false);
          console.log('AdMob banner loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          setAdError(true);
          console.log('AdMob banner failed to load:', error);
        }}
      />

      {/* Error State */}
      {adError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Ad unavailable
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  adLabel: {
    fontSize: 10,
    color: '#aaa',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  errorContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#ccc',
  },
});