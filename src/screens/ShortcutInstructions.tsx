import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, Alert } from 'react-native';
import { AuthContext } from '../auth/authContext';
import * as Clipboard from 'expo-clipboard';

export default function ShortcutInstructions() {
  const { userToken } = useContext(AuthContext);

  const copyTokenToClipboard = async () => {
    if (userToken) {
      await Clipboard.setStringAsync(userToken);
      Alert.alert('Copied', 'Your token has been copied to clipboard');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <Text style={styles.dictItem}>  - Request Body Type: JSON</Text>
      <Text style={styles.dictItem}>  - JSON keys and values:</Text>
      <Text style={styles.dictItem}>
        {'    {\n      "content": "Text",\n      "timestamp": "Current Date"\n    }'}
      </Text>

      <Text style={styles.tokenLabel}>Your Token:</Text>
      <View style={styles.tokenContainer}>
        <Text selectable style={styles.tokenText}>
          {userToken || 'No token found'}
        </Text>
      </View>
      <Button title="Copy Token to Clipboard" onPress={copyTokenToClipboard} />

      {/* Replace 'require' path below with your actual screenshot path */}
      <Text style={[styles.step, { marginTop: 20 }]}>Example Screenshot:</Text>
      <Image
        source={require('../../assets/1.jpeg')}
        style={styles.image}
        resizeMode="contain"
      /><Image
        source={require('../../assets/2.jpeg')}
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  step: {
    fontSize: 16,
    marginBottom: 10,
  },
  dictItem: {
    marginLeft: 15,
    fontSize: 15,
    marginBottom: 6,
    color: '#333',
    fontFamily: 'monospace',
  },
  tokenLabel: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tokenContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#444',
  },
  image: {
    width: '100%',
    height: 250,
    marginTop: 10,
    borderRadius: 8,
  },
});
