import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '@/utils/authContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const authState = useContext(AuthContext);
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
      <Tabs.Screen 
        name="trip"
        options={{ 
          title: 'Trip',
          href: authState.role === 'caretaker' ? '/trip' : null,
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
        name="busStatus"
        options={{ 
          title: 'BusStatus',
          href: authState.role === 'careReceiver' ? '/busStatus' : null,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'bus' : 'bus-outline'}
              color={color} 
              size={size} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="map"
        options={{ 
          title: 'Map',
          href: authState.role === 'caretaker' && authState.inTrip? '/map' : null,
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
