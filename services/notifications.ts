// services/notifications.ts
// Local notification service for FieldReportX
// Handles push notifications for report submissions

import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }
  return true;
};

// Send notification when report is submitted
export const sendReportSubmittedNotification = async (
  reportTitle: string
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✅ Report Submitted',
      body: `Your report "${reportTitle}" has been submitted successfully.`,
      sound: true,
      data: { type: 'report_submitted' },
    },
    trigger: null, // Send immediately
  });
};

// Schedule daily reminder notification at 9am
export const scheduleDailyReminder = async (): Promise<void> => {
  // Cancel existing reminders first
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📋 FieldReportX Reminder',
      body: "Don't forget to submit your field reports for today.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
    },
  });
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};