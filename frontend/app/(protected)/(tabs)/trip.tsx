import { useRouter } from 'expo-router';
import React, { useState, useMemo} from 'react';
import { Platform, StyleSheet, ScrollView, View, SafeAreaView, TextInput, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import AutocompleteInput from '@/components/AutocompleteInput';
import { fakeRouteMap, fakeRouteNumbers } from '../lib/fakeRoutes';

export default function Trip() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const styles = initStyles(nowColorScheme);

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
        <ThemedText style={styles.headerTitle}>Trip</ThemedText>
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

const initStyles = (nowColorScheme: 'light' | 'dark') => {
  const styles = StyleSheet.create({
    topBarContainer: {
      flex: 1,
      backgroundColor: Colors[nowColorScheme].background,
    },
    topBar: {
      backgroundColor: Colors[nowColorScheme].background,
      marginTop: 10,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
      height: Platform.OS === 'android' ? 79 : 50,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderBottomColor: Colors[nowColorScheme].border,
      borderBottomWidth: 0.5,
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
    title: {
      marginBottom: 24,
      textAlign: 'center',
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
