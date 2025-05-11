import { Image } from 'expo-image';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, useColorScheme} from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState, useContext } from 'react';
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
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <ThemedText style={styles.text}>Login screen</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={'#999'}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={'#999'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
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
    },
    text: {
      color: Colors[nowColorScheme].text,
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
      borderColor: '#ccc',
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