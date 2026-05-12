// screens/RegisterScreen.tsx
// Register screen for FieldReportX
// Professional redesign with teal and gold theme

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { registerUser } from '../services/firebase';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      await registerUser(email, password);
      Alert.alert(
        'Success',
        'Account created successfully! You are now logged in.'
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0d7377" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Top Header Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>📋</Text>
          </View>
          <Text style={styles.appName}>FieldReportX</Text>
          <Text style={styles.tagline}>Report Smarter. Work Safer.</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Create Account</Text>
          <Text style={styles.formSubtitle}>
            Join FieldReportX to start submitting reports
          </Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showPassword}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Password Strength Indicator */}
          <View style={styles.strengthContainer}>
            <View
              style={[
                styles.strengthBar,
                {
                  backgroundColor:
                    password.length === 0
                      ? '#eee'
                      : password.length < 6
                      ? '#e63946'
                      : password.length < 10
                      ? '#f4a261'
                      : '#2d6a4f',
                  width:
                    password.length === 0
                      ? '0%'
                      : password.length < 6
                      ? '33%'
                      : password.length < 10
                      ? '66%'
                      : '100%',
                },
              ]}
            />
          </View>
          <Text style={styles.strengthText}>
            {password.length === 0
              ? ''
              : password.length < 6
              ? 'Weak password'
              : password.length < 10
              ? 'Medium password'
              : '✅ Strong password'}
          </Text>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>
                Create Account →
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            FieldReportX — Built for field professionals
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d7377',
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    backgroundColor: '#0d7377',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoIcon: {
    fontSize: 35,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 32,
    paddingTop: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14213d',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#14213d',
    paddingVertical: 14,
  },
  showPassword: {
    fontSize: 18,
    padding: 4,
  },
  strengthContainer: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  registerButton: {
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
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#aaa',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  loginButton: {
    borderWidth: 1.5,
    borderColor: '#0d7377',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#0d7377',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 20,
  },
});