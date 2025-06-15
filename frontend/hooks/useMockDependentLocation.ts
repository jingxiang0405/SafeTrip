// 這個 hook 模擬被照顧者的位置，每 10 秒移動一次，並寫入 localStorage（AsyncStorage）
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fakePath = [
  { latitude: 25.042233, longitude: 121.516002 }, // 台大醫院
  { latitude: 25.044000, longitude: 121.517500 },
  { latitude: 25.046000, longitude: 121.519000 },
  { latitude: 25.047708, longitude: 121.517055 }, // 台北車站
  { latitude: 25.045100, longitude: 121.523500 }, // 善導寺
];

export function useMockDependentLocation() {
  useEffect(() => {
    let index = 0;
    const interval = setInterval(async () => {
      const location = fakePath[index];
      await AsyncStorage.setItem('mockDependentLocation', JSON.stringify(location));
      index = (index + 1) % fakePath.length;
    }, 10000); // 每 10 秒換一個點

    return () => clearInterval(interval);
  }, []);
}

export async function getMockDependentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const value = await AsyncStorage.getItem('mockDependentLocation');
    if (value) {
      return JSON.parse(value);
    }
  } catch (e) {
    console.warn('讀取 mock dependent location 失敗', e);
  }
  return null;
}

// ✅ 被照顧者呼叫 useMockDependentLocation() → 每 10 秒寫入一筆位置
// ✅ 照顧者地圖畫面可以從 AsyncStorage 讀取 mockDependentLocation 並加上 marker
// ✅ 未來只要把這段換成 TDX+GPS 傳到後端即可
