  import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
  import { useImage } from "expo-image";
  import { AppleMapsMapType } from "expo-maps/build/apple/AppleMaps.types";
  import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { locationList } from "@/assets/lib/LocationList";
  import { AppleMaps, GoogleMaps } from 'expo-maps';
  import { Platform, View, Text, Alert, Linking } from 'react-native';
  import { useLocalSearchParams } from 'expo-router';
  import React, { useContext, useEffect ,useState} from 'react';
  import * as Location from 'expo-location';
  //import { fakeBusPositions } from '@/assets/lib/fakeData';
  // import { fakeShapeMap } from '@/assets/lib/fakeShapes';
  //import { getMockDependentLocation } from '@/hooks/useMockDependentLocation';
  import busIcon from '@/assets/images/bus.png';
  import stopIcon from '@/assets/images/stop.png';
  import dependentIcon from '@/assets/images/dependent.png';
  import { useProximityAlert } from '@/hooks/useProximityAlert';
  import { GetBusRouteShape , GetBusInfo, GetBusAllStops, getCareReceiverLoc} from '@/utils/busService';
  import { AuthContext } from '@/utils/authContext';

  type StopMarker = { 
    latitude: number;
    longitude: number;
    title: string;
  };

  export default function Map() {
    const authState = useContext(AuthContext);
    const [dependentLocation, setDependentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [shapePoints, setShapePoints] = useState<{ lat: number; lng: number }[]>([]);
    const [busesPos, setBusesPos] = useState<{ latitude: number; longitude: number }[]>([]);
    const [polyline, setPolyline] = useState<{ coordinates: { latitude: number; longitude: number }[] } | undefined>(undefined);
    const [stops, setStops] = useState<StopMarker[]>([]); 
    const [availStops, setAvailStops] = useState<any[]>([]); // 用於存放可用的站點資料
    // 載入後定期取得
    useEffect(() => {
      const interval = setInterval(async () => {
        const loc = authState.careReceiverLocation;
        if (loc) setDependentLocation({
          latitude: loc.lat,
          longitude: loc.lng
        });
      }, 1000); // 每 1 秒抓一次

      return () => clearInterval(interval);
    }, []);

    //TODO: 用真的busPosition
    useProximityAlert(busesPos[0], true);

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


useEffect(() => {
  const fetchRoute = async () => {
    try {
      const busRouteShape = await GetBusRouteShape(authState.busNumber ?? '', authState.direction ?? 0);
      setShapePoints(busRouteShape ?? []);
      const prepolyline = (busRouteShape).length > 0 ? {
        coordinates: busRouteShape.map((p: { lat: number; lng: number }) => ({
          latitude: p.lat,
          longitude: p.lng,
        })),
        strokeColor: 'blue',
        strokeWidth: 4,
      } : undefined;
      setPolyline(prepolyline);
      const stops = await GetBusAllStops(authState.busNumber ?? '');
      if (stops && stops[authState.direction ?? 0]) {
        setAvailStops(stops[(authState.direction ?? 0).toString()] ?? []);
        // console.log('availStops:', availStops);

        // console.log('stops:', stop
        // s);
      }
      const BusesInfo = await GetBusInfo(authState.busNumber ?? '');
      setBusesPos(BusesInfo.map((bus: any) => ({
        latitude: bus.BusPosition.PositionLat,
        longitude: bus.BusPosition.PositionLon,
      })));
      
    } catch (error) {
      console.error('Failed to fetch bus route shape:', error);
      setShapePoints([]);
    }
  };

  fetchRoute();
}, []);// 👈 this ensures it only runs once

    // Default to Taipei city center if no stops available
    const defaultLocation = {
      latitude: 25.0330,  // Taipei 101 location
      longitude: 121.5654
    };
   
    // Convert stops to map marker coordinates or use empty array
    const stopMarkers: StopMarker[] = availStops.length > 0
      ? availStops.map((stop: any) => ({
          latitude: stop.location.lat,
          longitude: stop.location.lon,
          title: stop.name || 'Unknown Stop'
        }))
      : [];
    // console.log('stops:', stops);
    // console.log('stopMarkers:', stopMarkers);
    
    // Set initial region centered on first stop or default location
    const initialRegion = {
      latitude: stopMarkers.length > 0 ? stopMarkers[0].latitude : defaultLocation.latitude,
      longitude: stopMarkers.length > 0 ? stopMarkers[0].longitude : defaultLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    };

    const markersGoogle = [
    ...stopMarkers.map((marker, index) => ({
      coordinates: { latitude: marker.latitude, longitude: marker.longitude },
      title: `${index + 1}. ${marker.title}`,
      snippet : "站點",
      //icon : busIcon,
    })),
    // TODO: 啟用 icon 欄位並改為 TDX API 提供的公車即時位置資料
    ...(stops.length > 0 ? busesPos.map((bus, index) => ({
      coordinates: bus,
      title: `Bus ${index + 1}`,
      snippet : "即時位置",
      //icon : stopIcon,
    })) : []),
    ...(dependentLocation
    ? [{
        coordinates: dependentLocation,
        title: '被照顧者位置',
        snippet : "ˇ",
        
      }]
    : [])
    ];
    const markersApple = [
    ...stopMarkers.map((marker, index) => ({
      coordinates: { latitude: marker.latitude, longitude: marker.longitude },
      title: `${index + 1}. ${marker.title}`,
      tintColor: 'deepskyblue',
      systemImage: 'signpost.right',
    })),
    // ...(stops.length > 0 ? fakeBusPositions.map((bus, index) => ({
    //   coordinates: bus,
    //   title: `Bus ${index + 1}`,
    //   tintColor: 'crimson',
    //   systemImage: 'bus',
    // })) : []),
    ...(dependentLocation
    ? [{
      
      coordinates: dependentLocation,
      title: '被照顧者位置',
      tintColor: 'orange',
      systemImage: 'person.circle.fill',
      }]
    : [])
    ];

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
          polylines={polyline ? [polyline] : []}
          markers={markersApple}
          
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
          polylines={polyline ? [polyline] : []}
          markers={markersGoogle}
          
        />
      );
    } else {
      return <Text>Maps are only available on Android and iOS</Text>;
    }
  }
