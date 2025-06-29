import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Text, HelperText, Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';

type RegisterScreenNavigationProp = NavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Password must be at least 8 characters with at least one uppercase, lowercase, number, and special character
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleFieldChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register({ email, password });
      // Success toast is handled in the context
    } catch (error) {
      // Error toast is handled in the context
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Join CLIQ Expense Tracker to manage your finances
            </Text>
            
            <TextInput
              label="Email"
              mode="outlined"
              value={email}
              onChangeText={(value) => handleFieldChange('email', value)}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              error={!!errors.email}
              theme={{
                colors: {
                  primary: '#FF6384',
                  outline: '#333',
                  background: '#2A2A2A',
                  onSurface: '#FFF',
                }
              }}
            />
            <HelperText type="error" visible={!!errors.email} style={styles.errorText}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Password"
              mode="outlined"
              value={password}
              onChangeText={(value) => handleFieldChange('password', value)}
              secureTextEntry={secure}
              right={
                <TextInput.Icon
                  icon={secure ? 'eye-off' : 'eye'}
                  onPress={() => setSecure(!secure)}
                />
              }
              style={styles.input}
              error={!!errors.password}
              theme={{
                colors: {
                  primary: '#FF6384',
                  outline: '#333',
                  background: '#2A2A2A',
                  onSurface: '#FFF',
                }
              }}
            />
            <HelperText type="error" visible={!!errors.password} style={styles.errorText}>
              {errors.password}
            </HelperText>

            <TextInput
              label="Confirm Password"
              mode="outlined"
              value={confirmPassword}
              onChangeText={(value) => handleFieldChange('confirmPassword', value)}
              secureTextEntry={secureConfirm}
              right={
                <TextInput.Icon
                  icon={secureConfirm ? 'eye-off' : 'eye'}
                  onPress={() => setSecureConfirm(!secureConfirm)}
                />
              }
              style={styles.input}
              error={!!errors.confirmPassword}
              theme={{
                colors: {
                  primary: '#FF6384',
                  outline: '#333',
                  background: '#2A2A2A',
                  onSurface: '#FFF',
                }
              }}
            />
            <HelperText type="error" visible={!!errors.confirmPassword} style={styles.errorText}>
              {errors.confirmPassword}
            </HelperText>

            <Button 
              mode="contained" 
              onPress={handleRegister} 
              style={styles.button}
              loading={loading}
              disabled={loading}
              buttonColor="#FF6384"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
              textColor="#FF6384"
            >
              Already have an account? Sign in
            </Button>
          </Card.Content>
        </Card>
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
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  errorText: {
    color: '#FF6384',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 12,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkButton: {
    marginTop: 16,
  },
});
