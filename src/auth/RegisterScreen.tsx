import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from './authContext';
import Toast from 'react-native-toast-message';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type RegisterScreenNavigationProp = NavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { registerUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);

  const handleRegister = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email and password are required',
      });
      return;
    }

    try {
      await registerUser(email, password);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email already in use',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Register</Text>
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={secure}
        right={
          <TextInput.Icon
            icon={secure ? 'eye-off' : 'eye'}
            onPress={() => setSecure(!secure)}
          />
        }
        style={styles.input}
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#6200ee',
  },
});
