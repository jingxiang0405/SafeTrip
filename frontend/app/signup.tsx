import { Image } from 'expo-image';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useState, useContext } from 'react';
import { AuthContext } from '@/utils/authContext';
import { Colors } from '@/constants/Colors';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const authContext = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const styles = initStyles(nowColorScheme);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Replace this with your actual sign-up logic
    authContext.signUp(username, email, phone, password);
  };

  const dismissKeyboard = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ alignItems: 'center', width: '100%' }}
        >
          <ThemedText style={styles.text}>Sign Up</ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={ Colors[nowColorScheme].subtext }
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={ Colors[nowColorScheme].subtext }
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={ Colors[nowColorScheme].subtext }
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={ Colors[nowColorScheme].subtext }
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={ Colors[nowColorScheme].subtext }
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const initStyles = (nowColorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: Colors[nowColorScheme].background,
    },
    text: {
      color: Colors[nowColorScheme].text,
      height: 40,
      fontSize: 24,
      marginBottom: 20,
    },
    input: {
      width: '80%',
      color: Colors[nowColorScheme].text,
      maxWidth: 400,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: Colors[nowColorScheme].border,
      borderRadius: 5,
    },
    button: {
      marginTop: 10,
      padding: 15,
      backgroundColor: '#007bff',
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
    },
  });
