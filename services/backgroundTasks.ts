// services/backgroundTasks.ts
// Background task service for FieldReportX
// Syncs reports with Firestore when app is in background

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { getUnsyncedReports, markAsSynced } from './database';
import { addReport } from './firebase';
import { auth } from './firebase';

// Task name constant
export const BACKGROUND_SYNC_TASK = 'BACKGROUND_SYNC_TASK';

// Define the background task
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log('Background sync task running...');

    // Get unsynced reports from SQLite
    const unsyncedReports = getUnsyncedReports();

    if (unsyncedReports.length === 0) {
      console.log('No unsynced reports found');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Get current user
    const user = auth.currentUser;
    if (!user) {
      console.log('No user logged in for background sync');
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }

    // Sync each unsynced report to Firestore
    for (const report of unsyncedReports) {
      try {
        const firebaseId = await addReport({
          title: report.title,
          location: report.location,
          notes: report.notes,
          status: report.status as 'draft' | 'submitted',
          userId: user.uid,
          latitude: report.latitude,
          longitude: report.longitude,
        });

        // Mark as synced in SQLite
        if (report.id) {
          markAsSynced(report.id, firebaseId);
        }

        console.log(`Report synced: ${report.title}`);
      } catch (error) {
        console.error(`Failed to sync report: ${report.title}`, error);
      }
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background sync task failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register background fetch task
export const registerBackgroundSync = async (): Promise<void> => {
  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background sync registered successfully');
  } catch (error) {
    console.error('Background sync registration failed:', error);
  }
};

// Unregister background fetch task
export const unregisterBackgroundSync = async (): Promise<void> => {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
    console.log('Background sync unregistered');
  } catch (error) {
    console.error('Background sync unregistration failed:', error);
  }
};

// Check if background sync is registered
export const isBackgroundSyncRegistered = async (): Promise<boolean> => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_SYNC_TASK
  );
  return isRegistered;
};