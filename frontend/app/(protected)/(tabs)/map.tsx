import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useImage } from "expo-image";
import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import { SafeAreaView } from "react-native-safe-area-context";
import { locationList } from "../../../assets/lib/LocationList.js";
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, View, Text, Alert, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import * as Location from 'expo-location';
import { fakeBusPositions } from '@/assets/lib/fakeData';


type StopMarker = {
  latitude: number;
  longitude: number;
  title: string;
};

export default function Map() {
  // Request location permissions
  useEffect(() => {
    const requestLocationPermissions = async () => {
      try {
        // Request foreground permission first
        const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
        if (fgStatus !== 'granted') {
          console.log('Foreground location permission denied');
          Alert.alert(
            '需要位置權限',
            '請至系統設定中開啟位置權限，以便使用地圖功能',
            [
              { text: '取消', style: 'cancel' },
              { 
                text: '前往設定', 
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                }
              }
            ]
          );
          return;
        }

        // Then request background permission
        const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
        if (bgStatus === 'granted') {
          console.log('Background location (Always) permission granted');
        } else {
          console.log('Background location (Always) permission denied');
        }
      } catch (e) {
        console.error('Failed to request location permissions:', e);
      }
    };

    requestLocationPermissions();
  }, []);

  const params = useLocalSearchParams();
  const stopsParam = params.stops as string | undefined;
  
  // Safely parse stops with error handling
  const stops = React.useMemo(() => {
    try {
      if (!stopsParam) {
        return [];
      }
      // Remove any potential wrapping quotes
      const cleanJson = stopsParam.replace(/^"(.*)"$/, '$1');
      const parsed = JSON.parse(cleanJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse stops:', error);
      console.error('Stops param:', stopsParam);
      return [];
    }
  }, [stopsParam]);

  // Default to Taipei city center if no stops available
  const defaultLocation = {
    latitude: 25.0330,  // Taipei 101 location
    longitude: 121.5654
  };

  // Convert stops to map marker coordinates or use empty array
  const stopMarkers: StopMarker[] = stops.length > 0
    ? stops.map((stop: any) => ({
        latitude: stop.StopPosition.PositionLat,
        longitude: stop.StopPosition.PositionLon,
        title: stop.StopName.Zh_tw
      }))
    : [];

  // Set initial region centered on first stop or default location
  const initialRegion = {
    latitude: stopMarkers.length > 0 ? stopMarkers[0].latitude : defaultLocation.latitude,
    longitude: stopMarkers.length > 0 ? stopMarkers[0].longitude : defaultLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };

  const markers = [
    ...stopMarkers.map(marker => ({
      coordinate: { latitude: marker.latitude, longitude: marker.longitude },
      title: marker.title,
      color: 'blue'
    })),
    ...(stops.length > 0 ? fakeBusPositions.map((bus, index) => ({
      coordinate: bus,
      title: `Bus ${index + 1}`,
      color: 'red'
    })) : [])
  ];

  const polyline = stops.length > 0 ? {
    coordinates: stopMarkers.map(marker => ({
      latitude: marker.latitude,
      longitude: marker.longitude
    })),
    strokeColor: 'blue',
    strokeWidth: 3
  } : undefined;

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View 
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: {
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          },
          zoom: 15,
        }}
        markers={markers}
        polylines={polyline ? [polyline] : []}
      />
    );
  } else if (Platform.OS === 'android') {
    return (
      <GoogleMaps.View
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: {
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          },
          zoom: 15,
        }}
        markers={markers}
        polylines={polyline ? [polyline] : []}
      />
    );
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}
