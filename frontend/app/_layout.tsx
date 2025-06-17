import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/utils/authContext';
import { Colors } from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';
import { GlobalTaskProvider } from '@/utils/GlobalTaskProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  SystemUI.setBackgroundColorAsync(Colors[colorScheme ?? 'light'].background); 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <GlobalTaskProvider>
          <ThemedView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="(protected)" options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="login" options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="signup" options={{ headerShown: false, animation: 'none' }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemedView>
        </GlobalTaskProvider>
      </AuthProvider>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
    </ThemeProvider>
  );
}
