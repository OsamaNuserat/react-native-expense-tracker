import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Card, Text, TextInput, Button } from 'react-native-paper';

interface AddMessageModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (content: string, timestamp?: string) => void;
}

export default function AddMessageModal({ visible, onDismiss, onSubmit }: AddMessageModalProps) {
  const [content, setContent] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onSubmit(content.trim(), timestamp.trim() || undefined);
    setContent('');
    setTimestamp('');
    onDismiss();
  };

  const handleCancel = () => {
    setContent('');
    setTimestamp('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleCancel}
        contentContainerStyle={styles.modal}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Add Manual Message
            </Text>
            <Text style={styles.subtitle}>
              Enter the SMS message content to be parsed
            </Text>

            <TextInput
              label="Message Content"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              mode="outlined"
              style={styles.input}
              placeholder="Enter the bank SMS message..."
              theme={{
                colors: {
                  primary: '#FF6384',
                  background: '#2A2A2A',
                  surface: '#2A2A2A',
                  onSurface: '#FFF',
                }
              }}
            />

            <TextInput
              label="Timestamp (optional)"
              value={timestamp}
              onChangeText={setTimestamp}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DDTHH:mm:ssZ"
              theme={{
                colors: {
                  primary: '#FF6384',
                  background: '#2A2A2A',
                  surface: '#2A2A2A',
                  onSurface: '#FFF',
                }
              }}
            />

            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={handleCancel}
                style={styles.button}
                textColor="#FFF"
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleSubmit}
                style={[styles.button, styles.submitButton]}
                disabled={!content.trim()}
              >
                Add Message
              </Button>
            </View>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
  },
  card: {
    backgroundColor: '#2A2A2A',
  },
  title: {
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    color: '#AAA',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 0.48,
  },
  submitButton: {
    backgroundColor: '#FF6384',
  },
});
