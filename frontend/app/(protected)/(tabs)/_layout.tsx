import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        // tabBarInactiveBackgroundColor: Colors[colorScheme ?? 'light'].background,
        // tabBarActiveBackgroundColor: Colors[colorScheme ?? 'light'].background,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            // backgroundColor: TabBarBackground.color,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            position: 'absolute',
            elevation: 0,
          },
          default: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            position: 'absolute',
            elevation: 0,
          },
        }),
      }}>
      <Tabs.Screen 
        name="index"
        options={{ 
          title: 'Home',
          // headerLeft: () => <></>,
          // tabBarIcon: () => <IonIcons name="home" size={30} />,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              color={color} 
              size={size} 
            />
          ),
        }} 
      />
      {/* <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
          tabBarIcon: ({ color }) => <IconSymbol size={27} name="paperplane.fill" color={color} />,
        }}
      /> */}
      <Tabs.Screen 
        name="trip"
        options={{ 
          title: 'Trip',
          // headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'paper-plane' : 'paper-plane-outline'} 
              color={color} 
              size={size} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="MapScreen"
        options={{ 
          title: 'MapScreen',
          // headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'map' : 'map-outline'} 
              color={color} 
              size={size} 
            />
          )
        }} 
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-circle' : 'account-circle-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
