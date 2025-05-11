import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/utils/authContext';
import { Colors } from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  

  SystemUI.setBackgroundColorAsync(Colors[colorScheme ?? 'light'].background); 
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ThemedView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(protected)" options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="login" options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemedView>
      </AuthProvider>
      <StatusBar style={colorScheme=="light" ? "dark" : "light"} />
    </ThemeProvider>
  );
}
