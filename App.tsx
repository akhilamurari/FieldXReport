// App.tsx
// Main entry point for FieldReportX
// Sets up navigation, authentication state, SQLite database,
// notifications and background tasks

import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { ActivityIndicator, View, Text } from 'react-native';
import { initDatabase } from './services/database';
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
} from './services/notifications';
import { registerBackgroundSync } from './services/backgroundTasks';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ReportFormScreen from './screens/ReportFormScreen';
import MyReportsScreen from './screens/MyReportsScreen';
import MapScreen from './screens/MapScreen';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom tab navigator for main app screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1a1a2e',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="NewReport"
        component={ReportFormScreen}
        options={{
          tabBarLabel: 'New Report',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          tabBarLabel: 'My Reports',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📁</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🗺️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root component handles auth flow
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialise SQLite database
    try {
      initDatabase();
      console.log('Database initialised successfully');
    } catch (error) {
      console.error('Database initialisation error:', error);
    }

    // Request notification permissions and schedule daily reminder
    const setupNotifications = async () => {
      try {
        const granted = await requestNotificationPermissions();
        if (granted) {
          await scheduleDailyReminder();
          console.log('Notifications set up successfully');
        }
      } catch (error) {
        console.error('Notification setup error:', error);
      }
    };
    setupNotifications();

    // Register background sync task
    const setupBackgroundSync = async () => {
      try {
        await registerBackgroundSync();
        console.log('Background sync registered successfully');
      } catch (error) {
        console.error('Background sync setup error:', error);
      }
    };
    setupBackgroundSync();

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <ActivityIndicator size="large" color="#1a1a2e" />
        <Text
          style={{
            marginTop: 12,
            color: '#666',
            fontSize: 16,
          }}
        >
          Loading FieldReportX...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // User is logged in — show main app
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          // User is not logged in — show auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}