// screens/AIAssistantScreen.tsx
// AI Assistant screen for FieldReportX
// Uses AI to improve and summarise field report notes
// Mock AI response for development — replace with real API in production

import React from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import * as Speech from 'expo-speech';

type Mode = 'improve' | 'summarise' | 'safety';

export default function AIAssistantScreen({ navigation }: any) {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('improve');

  // Mock AI processing
  const processWithAI = async (
    text: string,
    selectedMode: Mode
  ): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const date = new Date().toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    if (selectedMode === 'improve') {
      return `Field Inspection Report — ${date}

The following observations were recorded during the site inspection:

${text}

All findings have been documented in accordance with workplace safety protocols. The site supervisor has been notified and a follow-up inspection is recommended within 48 hours to ensure compliance with relevant Australian Standards.

Prepared by: FieldReportX AI Assistant
Status: Ready for submission`;
    } else if (selectedMode === 'summarise') {
      const sentences = text
        .split('.')
        .filter((s) => s.trim().length > 0);
      const firstPoint =
        sentences.length > 0
          ? sentences[0].trim()
          : text.slice(0, 50);
      return `Summary — ${date}

- ${firstPoint} — documented and logged
- Site conditions assessed and findings recorded
- Follow-up action required within 48 hours
- Report submitted to site supervisor for review`;
    } else {
      return `⚠️ Safety Assessment — ${date}

Potential Safety Concerns Identified:

- Hazard observed: ${text.slice(0, 60)}...
- Risk Level: Medium — requires prompt attention
- Recommended Action: Conduct formal risk assessment
- Personnel: Ensure all staff are briefed on findings

Compliance Note: Review against AS/NZS 4801 Occupational Health and Safety Management Systems before proceeding.`;
    }
  };

  // Handle AI processing
  const handleProcess = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some notes first');
      return;
    }
    try {
      setLoading(true);
      const result = await processWithAI(inputText, mode);
      setOutputText(result);
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Could not process your notes. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Text to speech
  const handleSpeak = () => {
    if (!outputText) {
      Alert.alert('Error', 'No text to speak');
      return;
    }
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    Speech.speak(outputText, {
      language: 'en-AU',
      pitch: 1.0,
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Use AI output text
  const handleUseText = () => {
    if (!outputText) {
      Alert.alert('Error', 'No AI output to use');
      return;
    }
    setInputText(outputText);
    setOutputText('');
    Alert.alert(
      'Done',
      'AI improved text is ready to use in your report.'
    );
  };

  // Clear all
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    }
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
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            🤖 AI-Powered Report Assistant
          </Text>
          <Text style={styles.infoText}>
            Use AI to improve your field report notes, generate
            professional summaries, or identify safety concerns.
            Tap Speak to hear the AI result read aloud in
            Australian English.
          </Text>
        </View>

        {/* Mode Selector */}
        <Text style={styles.sectionLabel}>Select Mode</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'improve' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('improve')}
          >
            <Text style={styles.modeEmoji}>✨</Text>
            <Text
              style={[
                styles.modeButtonText,
                mode === 'improve' && styles.modeButtonTextActive,
              ]}
            >
              Improve
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'summarise' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('summarise')}
          >
            <Text style={styles.modeEmoji}>📝</Text>
            <Text
              style={[
                styles.modeButtonText,
                mode === 'summarise' &&
                  styles.modeButtonTextActive,
              ]}
            >
              Summarise
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === 'safety' && styles.modeButtonActive,
            ]}
            onPress={() => setMode('safety')}
          >
            <Text style={styles.modeEmoji}>⚠️</Text>
            <Text
              style={[
                styles.modeButtonText,
                mode === 'safety' && styles.modeButtonTextActive,
              ]}
            >
              Safety
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode Description */}
        <View style={styles.modeDescription}>
          <Text style={styles.modeDescriptionText}>
            {mode === 'improve'
              ? '✨ Rewrites your notes into professional field report language'
              : mode === 'summarise'
              ? '📝 Condenses your notes into clear bullet point summary'
              : '⚠️ Analyses your notes for potential safety hazards'}
          </Text>
        </View>

        {/* Input Section */}
        <Text style={styles.sectionLabel}>Your Notes</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Type your field report notes here...&#10;&#10;Example: checked site roof damaged water leak near door unsafe area near entrance"
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
          multiline
          numberOfLines={6}
        />

        {/* Character Count */}
        <Text style={styles.charCount}>
          {inputText.length} characters
        </Text>

        {/* Process Button */}
        <TouchableOpacity
          style={[
            styles.processButton,
            loading && styles.processButtonDisabled,
          ]}
          onPress={handleProcess}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.loadingText}>
                AI is processing...
              </Text>
            </View>
          ) : (
            <Text style={styles.processButtonText}>
              {mode === 'improve'
                ? '✨ Improve with AI'
                : mode === 'summarise'
                ? '📝 Summarise with AI'
                : '⚠️ Check Safety with AI'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Output Section */}
        {outputText ? (
          <View style={styles.outputSection}>

            {/* Output Header */}
            <View style={styles.outputHeader}>
              <Text style={styles.sectionLabel}>
                AI Result
              </Text>
              <TouchableOpacity
                style={[
                  styles.speakButton,
                  isSpeaking && styles.speakButtonActive,
                ]}
                onPress={handleSpeak}
              >
                <Text style={styles.speakButtonText}>
                  {isSpeaking ? '⏹ Stop' : '🔊 Speak'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Output Box */}
            <View style={styles.outputBox}>
              <Text style={styles.outputText}>
                {outputText}
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={styles.useButton}
              onPress={handleUseText}
            >
              <Text style={styles.useButtonText}>
                ✅ Use This Text in Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reprocessButton}
              onPress={handleProcess}
            >
              <Text style={styles.reprocessButtonText}>
                🔄 Regenerate
              </Text>
            </TouchableOpacity>

          </View>
        ) : null}

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
  clearText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#e8f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#0d7377',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0d7377',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14213d',
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButtonActive: {
    backgroundColor: '#0d7377',
    borderColor: '#0d7377',
  },
  modeEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  modeDescription: {
    backgroundColor: '#f0f8f8',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  modeDescriptionText: {
    fontSize: 12,
    color: '#0d7377',
    fontWeight: '500',
  },
  inputBox: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#14213d',
    height: 160,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  charCount: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 16,
  },
  processButton: {
    backgroundColor: '#0d7377',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0d7377',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  processButtonDisabled: {
    backgroundColor: '#7ab8bb',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  outputSection: {
    marginBottom: 20,
  },
  outputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  speakButton: {
    backgroundColor: '#6f42c1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  speakButtonActive: {
    backgroundColor: '#e63946',
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  outputBox: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#0d7377',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  outputText: {
    fontSize: 14,
    color: '#14213d',
    lineHeight: 22,
  },
  useButton: {
    backgroundColor: '#2d6a4f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#2d6a4f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  reprocessButton: {
    borderWidth: 1.5,
    borderColor: '#0d7377',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  reprocessButtonText: {
    color: '#0d7377',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    height: 40,
  },
});