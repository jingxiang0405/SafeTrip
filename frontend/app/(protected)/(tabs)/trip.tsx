import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';

// 假資料：用來模擬站點資料（未來這裡會改成從 TDX API 抓）
import { fakeStops } from '../lib/fakeData';

// 驗證輸入的起點與終點是否在 fake 路線中（未來可以改成使用 TDX 回傳的 stops 來檢查）
import { validateStops } from '../lib/validateStops';

export default function Trip() {
  const router = useRouter();

  // 輸入狀態
  const [startStop, setStartStop] = useState('');
  const [endStop, setEndStop] = useState('');
  const [busNumber, setBusNumber] = useState('');

  // 建立行程邏輯
  const handleCreateTrip = () => {
    // 基本欄位檢查
    if (!startStop || !endStop || !busNumber) {
      Alert.alert('錯誤', '請輸入所有欄位');
      return;
    }

    // 驗證輸入的站點是否在此路線中（可用 TDX 回傳的 Stops 陣列來比對）
    if (!validateStops(startStop, endStop)) {
      Alert.alert('錯誤', '起點或終點站不存在於路線中');
      return;
    }

    // ✅ 導航到地圖頁面，傳遞 stops（站點陣列）與 trip 參數
    // ⚠️ 注意：這裡的 stops 是用 JSON.stringify 傳遞，未來 TDX 資料也可以這樣傳
    router.push({
      pathname: '/MapScreen',
      params: {
        stops: JSON.stringify(fakeStops),
        startStop,
        endStop,
        busNumber
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>建立測試 Trip</Text>

      <TextInput placeholder="起點站" style={styles.input} value={startStop} onChangeText={setStartStop} />
      <TextInput placeholder="終點站" style={styles.input} value={endStop} onChangeText={setEndStop} />
      <TextInput placeholder="公車號碼" style={styles.input} value={busNumber} onChangeText={setBusNumber} />

      <TouchableOpacity style={styles.button} onPress={handleCreateTrip}>
        <Text style={styles.buttonText}>建立並查看地圖</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 樣式
const styles = StyleSheet.create({
  container: { padding: 24, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '600' },
});
