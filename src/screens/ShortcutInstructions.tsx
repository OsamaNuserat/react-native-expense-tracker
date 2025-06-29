import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import * as Clipboard from 'expo-clipboard';

export default function ShortcutInstructions() {
  const { user } = useAuth();

  const copyTokenToClipboard = async () => {
    // For now, just show the message that token functionality needs to be implemented
    Alert.alert('Token', 'Token functionality will be implemented in the backend');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>How to set up the iOS Shortcut</Text>

        <Text style={styles.step}>
          1. Open the Shortcuts app on your iOS device.
        </Text>
        <Text style={styles.step}>
          2. Go to the Automation tab, then tap the + button to create a new automation.
        </Text>
        <Text style={styles.step}>
          3. Search for "Message" and select "When I Receive a Message From."
        </Text>
        <Text style={styles.step}>
          4. Enter your bank's sender name exactly as it appears in your SMS messages (case-sensitive).
        </Text>
        <Text style={styles.step}>
          5. Enable "Run Immediately," then tap Next.
        </Text>
        <Text style={styles.step}>
          6. Tap "Add Action."
        </Text>
        <Text style={styles.step}>
          7. Search and add a "Text" action. Set its content to "Shortcut Input."
        </Text>
        <Text style={styles.step}>
          8. Add a "Current Date" action.
        </Text>
        <Text style={styles.step}>
          9. Add a "Get Contents of URL" action and configure it as follows:
        </Text>
        <Text style={styles.dictItem}>• URL: https://expense-tracker-q432.onrender.com/api/parse-sms</Text>
        <Text style={styles.dictItem}>• Method: POST</Text>
        <Text style={styles.dictItem}>• Headers: Authorization: Bearer [Your Token]</Text>
        <Text style={styles.dictItem}>• Request Body:</Text>
        
        <View style={styles.codeContainer}>
          <Text style={styles.code}>
            {`{
  "content": [Text from step 7],
  "timestamp": [Current Date from step 8]
}`}
          </Text>
        </View>

        <Text style={styles.step}>
          10. Set Request Body format to JSON.
        </Text>
        <Text style={styles.step}>
          11. Tap Done to save your automation.
        </Text>

        <Text style={styles.subtitle}>Your Authentication Token:</Text>
        <View style={styles.tokenContainer}>
          <Text style={styles.token}>
            {user?.email || 'No user logged in'}
          </Text>
          <Button title="Copy Token" onPress={copyTokenToClipboard} />
        </View>

        <Text style={styles.note}>
          Note: Replace [Your Token] in the Headers with the token shown above.
        </Text>

        <Text style={styles.note}>
          After setting up this automation, your bank SMS messages will be automatically 
          parsed and added to your expense tracker!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#FFF',
  },
  step: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FFF',
    lineHeight: 22,
  },
  dictItem: {
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 15,
    color: '#AAA',
    fontFamily: 'monospace',
  },
  codeContainer: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  code: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: 'monospace',
  },
  tokenContainer: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  token: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'monospace',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#FF6384',
    fontStyle: 'italic',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
});
