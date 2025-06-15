import { Image } from 'expo-image';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, useColorScheme, Platform, KeyboardAvoidingView } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState, useContext } from 'react';
import { Link } from 'expo-router';
import { AuthContext } from '@/utils/authContext';
import { Colors } from '@/constants/Colors';
// import { Button } from '@react-navigation/elements';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const authContext = useContext(AuthContext);
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';

  const styles = initStyles(nowColorScheme);

  const handleLogin = () => {
    authContext.logIn(username, password); // Assuming your logIn function now accepts username and password
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
          style={{alignContent: 'center', alignItems: 'center', width: '100%'}}
        >
          <ThemedText style={styles.text}>Login</ThemedText>
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
            placeholder="Password"
            placeholderTextColor={ Colors[nowColorScheme].subtext }
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text style={{ color: Colors[nowColorScheme].text }}>Don't have an account? </Text>
            <Link href="/signup">
              <Text style={{ color: '#007bff' }}>Sign up</Text>
            </Link>
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const initStyles = (nowColorScheme: 'light' | 'dark') => {
  const styles = StyleSheet.create({
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
      backgroundColor: '#007bff', // Example button color
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
    },
  });
  return styles;
}