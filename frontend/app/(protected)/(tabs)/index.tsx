import { Image } from 'expo-image';
import { Platform, StyleSheet, ScrollView, View, SafeAreaView, Text, useColorScheme } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/*
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>歡迎使用 Bus Trip App</Text>
      <TouchableOpacity onPress={() => router.push('/trip')}>
        <Text style={{ color: 'blue' }}>前往建立 Trip</Text>
      </TouchableOpacity>
    </View>
  );
}
*/


export default function Index() {
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const insets = useSafeAreaInsets();
  const styles = initstyles(nowColorScheme);

  return (
    <SafeAreaView style={styles.topBarContainer}>
      <View style={styles.topBar}>
        <Text style={{color: Colors[nowColorScheme].text, fontWeight: 'bold', fontSize: 28}}>SafeTrip</Text>
      </View>

    <ScrollView 
      style={styles.scrollview}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ScrollView>
    </SafeAreaView>
  );
}

const initstyles = (nowColorScheme: 'light' | 'dark') => {
  const styles = StyleSheet.create({
    topBarContainer: {
      flex: 1,
      backgroundColor: Colors[nowColorScheme].background,
    },
    topBar: {
      backgroundColor: Colors[nowColorScheme].background,
      marginTop: 10,
      paddingBottom: 5,
      paddingTop: Platform.OS === 'android' ? 25 : 0, // status bar padding for Android
      height: Platform.OS === 'android' ? 79 : 50,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderBottomColor: Colors[nowColorScheme].border,
      borderBottomWidth: 0.5,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    scrollview: {
      padding: 20,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      gap: 8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
      backgroundColor: 'transparent',
    },
  });

  return styles;  
};
