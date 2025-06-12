import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AutocompleteInput from '@/components/AutocompleteInput';
import { fakeRouteMap, fakeRouteNumbers } from '../lib/fakeRoutes';

export default function Trip() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const insets = useSafeAreaInsets();
  const styles = initstyles(nowColorScheme);

  // 輸入狀態
  const [startStop, setStartStop] = useState('');
  const [endStop, setEndStop] = useState('');
  const [busNumber, setBusNumber] = useState('');

  const stopOptions = useMemo(() => {
    return busNumber && fakeRouteMap[busNumber] ? fakeRouteMap[busNumber].map(s => s.StopName.Zh_tw) : [];
  }, [busNumber]);


  // 建立行程邏輯
  const handleCreateTrip = () => {
    // 基本欄位檢查
    if (!startStop || !endStop || !busNumber) {
      Alert.alert('錯誤', '請輸入所有欄位');
      return;
    }



    // ✅ 導航到地圖頁面，傳遞 stops（站點陣列）與 trip 參數
    // ⚠️ 注意：這裡的 stops 是用 JSON.stringify 傳遞，未來 TDX 資料也可以這樣傳
    router.push({
      pathname: '/map',
      params: {
        busNumber,
        startStop,
        endStop,
        city: 'Taipei',
        stops: JSON.stringify(fakeRouteMap[busNumber] ?? [])
      }
    });
  };

  return (
    <SafeAreaView style={styles.topBarContainer}>
      <View style={styles.topBar}>
        <Text style={{color: Colors[nowColorScheme].text, fontWeight: 'bold', fontSize: 28}}>Trip</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ThemedView style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>Create Trip</ThemedText>

            <AutocompleteInput
              label="Bus Number"
              data={fakeRouteNumbers}
              value={busNumber}
              onChange={(val) => {
                setBusNumber(val);
                setStartStop('');
                setEndStop('');
              }}
              colorScheme={nowColorScheme}
            />

            <AutocompleteInput
              label="Start Stop"
              data={stopOptions}
              value={startStop}
              onChange={setStartStop}
              colorScheme={nowColorScheme}
            />

            <AutocompleteInput
              label="End Stop"
              data={stopOptions}
              value={endStop}
              onChange={setEndStop}
              colorScheme={nowColorScheme}
            />

          
          <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
            <ThemedText style={styles.buttonText}>View on Map</ThemedText>
          </TouchableOpacity>
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
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors[nowColorScheme].text,
    },
    container: {
      flex: 1,
      backgroundColor: Colors[nowColorScheme].background,
    },
    contentContainer: {
      padding: 20,
      flexGrow: 1,
    },
    formContainer: {
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      gap: 16,
      backgroundColor: 'transparent',
    },
    input: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderColor: Colors[nowColorScheme].border,
      borderRadius: 8,
      color: Colors[nowColorScheme].text,
      backgroundColor: Colors[nowColorScheme].background,
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 16,
    },
  });
  return styles;
};
