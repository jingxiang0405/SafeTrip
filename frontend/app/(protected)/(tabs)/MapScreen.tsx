import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import React from 'react';

// 假資料：模擬 2 台公車目前位置（未來改為從 TDX 拿即時位置）
import { fakeBusPositions } from '../lib/fakeData';

export default function Map() {
  // 取得從 trip.tsx 傳來的參數
  const params = useLocalSearchParams();
  const stops = JSON.parse(params.stops as string); // ⚠️ 假資料，用 JSON 傳遞站點列表
    type StopMarker = {
    latitude: number;
    longitude: number;
    title: string;
  };


  // 將 stop 轉換為地圖上的 Marker 座標格式
  const stopMarkers: StopMarker[] = stops.map((stop: any) => ({
    latitude: stop.StopPosition.PositionLat,
    longitude: stop.StopPosition.PositionLon,
    title: stop.StopName.Zh_tw
  }));
  // 設定地圖的初始區域（以第一個站為中心）
  const initialRegion = {
    latitude: stopMarkers[0].latitude,
    longitude: stopMarkers[0].longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion}>
        {/* 顯示所有公車站點 */}
        {stopMarkers.map((marker: typeof stopMarkers[number], idx: number) => (
          <Marker key={idx} coordinate={marker} title={marker.title} />
        ))}

        {/* TODO 顯示假公車位置（未來改為動態資料） */}
        {fakeBusPositions.map((bus, i) => (
          <Marker
            key={`bus-${i}`}
            coordinate={bus}
            title={`Bus ${i + 1}`}
            pinColor="red"
          />
        ))}

        {/* 畫出所有站點間的線段（模擬路線） */}
        <Polyline coordinates={stopMarkers} strokeColor="blue" strokeWidth={3} />
      </MapView>
    </View>
  );
}
