import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Text, Dialog, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

export default function MoreScreen() {
  const navigation = useNavigation<any>(); // Using any for now, will fix typing later
  const { logout, user } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    setShowLogoutDialog(false);
    await logout(false); // Logout from current device only
  };

  const handleLogoutAllDevices = async () => {
    setShowLogoutDialog(false);
    await logout(true); // Logout from all devices
  };

  const showLogoutOptions = () => {
    setShowLogoutDialog(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      {/* User Info Card */}
      {user && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Account</Text>
            <Text variant="bodyMedium" style={styles.userEmail}>
              {user.email}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* Settings Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>Settings</Text>
          
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('ShortcutInstructions')}
            style={styles.button}
            icon="information"
          >
            Shortcut Instructions
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('SpendingAdvisor')}
            style={styles.button}
            icon="lightbulb"
          >
            Spending Advisor
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Messages')}
            style={styles.button}
            icon="message-text"
          >
            View Messages
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Categories')}
            style={styles.button}
            icon="tag"
          >
            Manage Categories
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('BudgetSettings')}
            style={styles.button}
            icon="wallet"
          >
            Budget Settings
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('RecurringPayments')}
            style={styles.button}
            icon="repeat"
          >
            Recurring Payments
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Bills')}
            style={styles.button}
            icon="receipt"
          >
            Bills & Reminders
          </Button>

          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('FinancialGoals')}
            style={styles.button}
            icon="flag"
          >
            Financial Goals
          </Button>
        </Card.Content>
      </Card>

      {/* Logout Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Button 
            mode="contained" 
            onPress={showLogoutOptions}
            style={[styles.button, styles.logoutButton]}
            icon="logout"
            buttonColor="#d32f2f"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
      </ScrollView>

      {/* Logout Options Dialog */}
      <Portal>
        <Dialog visible={showLogoutDialog} onDismiss={() => setShowLogoutDialog(false)}>
          <Dialog.Title>Logout Options</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Choose how you want to logout:</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor="#d32f2f">
              This Device Only
            </Button>
            <Button onPress={handleLogoutAllDevices} textColor="#d32f2f">
              All Devices
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    padding: 15,
  },
  card: {
    backgroundColor: '#2A2A2A',
    marginBottom: 15,
  },
  cardTitle: {
    color: '#FFF',
    marginBottom: 15,
  },
  userEmail: {
    color: '#AAA',
  },
  button: {
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 10,
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
