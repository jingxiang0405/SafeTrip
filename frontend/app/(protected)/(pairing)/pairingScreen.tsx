import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { AuthContext } from '@/utils/authContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export const unstable_settings = {
  presentation: 'modal',
};

export default function PairingScreen() {
  const authState = useContext(AuthContext);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = createStyles(colorScheme);

  const handlePair = (role: 'caregiver' | 'careReceiver') => {
    authState.selectRole(role);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innercontainer}>
      <Text style={styles.title}>選擇您的身份</Text>

      <TouchableOpacity
        style={styles.optionBox}
        onPress={() => handlePair('caregiver')}
      >
        <Ionicons name="person-outline" size={30} color={Colors[colorScheme].text} />
        <Text style={styles.optionText}>我是照護者</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionBox}
        onPress={() => handlePair('careReceiver')}
      >
        <Ionicons name="heart-outline" size={30} color={Colors[colorScheme].text} />
        <Text style={styles.optionText}>我是被照顧者</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>取消</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colorScheme: 'light' | 'dark') {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme].background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    innercontainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      maxWidth: 600,
      minWidth: 300
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[colorScheme].text,
      marginBottom: 40,
    },
    optionBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme].boxBackground,
      padding: 16,
      marginVertical: 10,
      width: '100%',
      borderRadius: 12,
    },
    optionText: {
      fontSize: 18,
      marginLeft: 12,
      color: Colors[colorScheme].text,
    },
    cancelButton: {
      marginTop: 40,
    },
    cancelText: {
      fontSize: 16,
      color: 'red',
    },
  });
}
