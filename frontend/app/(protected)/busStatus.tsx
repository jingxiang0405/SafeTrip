import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Platform, ScrollView, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useMockDependentLocation } from '@/hooks/useMockDependentLocation';

const TARGET_STOP = {
  name: '善導寺',
  latitude: 25.0451,
  longitude: 121.5235,
};
// TODO: 未來改為從 props or route params 中取得 endStop 座標，避免寫死

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // 地球半徑（公尺）
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function BusStatusScreen() {
  const { busNumber, startStop, endStop, stops } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const insets = useSafeAreaInsets();
  const styles = initStyles(nowColorScheme);

  const [distance, setDistance] = useState<number | null>(null);
  const [arrived, setArrived] = useState(false);

  useMockDependentLocation(); // TODO: 正式上線時移除，改為由裝置 GPS 定時取得位置並上傳後端

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({});
        // TODO: 此處改為 fetch 被照顧者位置（由後端提供）
        // const res = await fetch('https://api.xxx.com/dependent-location');
        // const loc = await res.json();
        const dist = getDistanceMeters(
          loc.coords.latitude,
          loc.coords.longitude,
          TARGET_STOP.latitude,
          TARGET_STOP.longitude
        );

        setDistance(dist);

        if (dist < 50 && !arrived) {
          //TODO
          Alert.alert('提醒您下車', '已抵達善導寺站');
          setArrived(true);
        }
      } catch (e) {
        console.warn('定位失敗:', e);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [arrived]);

  let stopList: any[] = [];
  try {
    stopList = stops ? JSON.parse(stops as string) : [];
  } catch (e) {
    console.warn('無法解析 stops');
  }

  const getNotice = () => {
    if (distance === null) return '讀取位置中...';
    if (distance < 50) return '提醒您下車';
    if (distance < 150) return '即將到站';
    return '尚未到站';
  };

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

          <Text style={styles.label}>目標站點：</Text>
          <Text style={styles.currentStop}>{TARGET_STOP.name}</Text>

          <Text style={styles.notice}>{getNotice()}</Text>
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
