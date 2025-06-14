import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

export default function BusStatusScreen() {
  const { busNumber, startStop, endStop, stops } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const insets = useSafeAreaInsets();
  const styles = initStyles(nowColorScheme);

  // 假設目前到站（可以用 setInterval 模擬動態更新）
  const currentStopIndex = 2; // 假資料，目前是第 3 站
  let stopList: any[] = [];
  try {
    stopList = stops ? JSON.parse(stops as string) : [];
  } catch (e) {
    console.warn('無法解析 stops');
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <ThemedText style={styles.headerText}>Bus Info</ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <ThemedView style={styles.infoBox}>
          <Text style={styles.label}>公車號碼：</Text>
          <Text style={styles.value}>{busNumber}</Text>

          <Text style={styles.label}>起點站：</Text>
          <Text style={styles.value}>{startStop}</Text>

          <Text style={styles.label}>終點站：</Text>
          <Text style={styles.value}>{endStop}</Text>

          <Text style={styles.label}>目前到站：</Text>
          <Text style={styles.currentStop}>
            {stopList[currentStopIndex]?.StopName?.Zh_tw ?? '資料讀取中...'}
          </Text>

          <Text style={styles.notice}>即將提醒您下車</Text>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const initStyles = (mode: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[mode].background,
    },
    topBar: {
      backgroundColor: Colors[mode].background,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
      height: Platform.OS === 'android' ? 79 : 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: Colors[mode].border,
      borderBottomWidth: 0.5,
    },
    headerText: {
      color: Colors[mode].text,
      fontWeight: 'bold',
      fontSize: 28,
    },
    scrollView: {
      flex: 1,
      padding: 16,
    },
    infoBox: {
      backgroundColor: Colors[mode].boxBackground,
      borderRadius: 12,
      padding: 20,
      gap: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[mode].text,
    },
    value: {
      fontSize: 18,
      color: Colors[mode].text,
      marginBottom: 12,
    },
    currentStop: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007AFF',
      marginBottom: 8,
    },
    notice: {
      fontSize: 16,
      color: 'red',
      fontWeight: '600',
    },
  });
