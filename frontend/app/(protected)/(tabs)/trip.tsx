import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useContext, useEffect, useCallback, use } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '@/utils/authContext';
import { GetAllBuses, GetBusAllStops, SendCreateTrip } from '@/utils/busService';
import DropdownSelect, { Option } from '@/components/DropdownSelect';
import AutocompleteInput from '@/components/AutocompleteInput';
import { fakeRouteMap, fakeRouteNumbers } from '../../../assets/lib/fakeRoutes';

export default function Trip() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const insets = useSafeAreaInsets();
  const styles = initstyles(nowColorScheme);
  const authState = useContext(AuthContext);

  // 輸入狀態
  const [startStop, setStartStop] = useState('');
  const [endStop, setEndStop] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [allStops, setAllStops] = useState<{ name: string, location: { lat: number, lon: number } }[][]>([]);

  const [direction, setDirection] = useState(Number(-1));

  const [stopOptions, setStopOptions] = useState<string[]>([]);

  const [allBusList, setAllBusList] = useState<string[]>([]);

    // 建立行程邏輯
  const handleCreateTrip = () => {
    SendCreateTrip(authState.userId, authState?.pairedWith?.id, busNumber, startStop, endStop, direction, allStops[direction][allStops[direction].length - 1].name ?? '');
    authState.setStartStop(startStop);
    authState.setEndStop(endStop);
    authState.setDirection(direction);
    authState.setTerminal(allStops[direction][allStops[direction].length - 1].name ?? '');
    authState.setBusNumber(busNumber);
    authState.setInTrip(true);

    if (!startStop || !endStop || !busNumber) {
      Alert.alert('錯誤', '請輸入所有欄位');
      return;
    }

    const tripParams = {
      busNumber,
      startStop,
      endStop,
      city: 'Taipei',
      // TODO: stops 應改為 TDX 回傳的站點 JSON，而非 fakeRouteMap
      stops: JSON.stringify(fakeRouteMap[busNumber] ?? [])
    }

    if(authState.role === 'caretaker'){
      // TODO: 若未來需等候 TDX API 回應成功後再跳轉，請改為 async/await 控制流程
      router.push({ pathname: '/map', params: tripParams})
    }else if(authState.role === 'careReceiver'){
      router.push({ pathname : '/busStatus', params: tripParams})
    }
  };

  const handleSelectBusChange = useCallback(async (val: string) => {
      setBusNumber(val);
      setStartStop('');
      setEndStop('');
      const allStops = await GetBusAllStops(val);
      setAllStops(allStops);
  }, []);

  const handleDirectionChange = useCallback(async (val: string) => {
      const dir = Number(val);
      setDirection(dir);
      const options = allStops[dir].map(s => s.name) || [];
      setStopOptions(options);
  }, [allStops]);

    useEffect(() => {
    const fetchAllBuses = async () => {
      const buses = await GetAllBuses(); // 假設回傳 string[]
      setAllBusList(buses);
    };
    fetchAllBuses();
  }, []);

  useEffect(() => {
    if (authState.role !== 'caretaker') {
      router.replace('/');
    }
  }, [authState.role, router]);

  if (authState.role !== 'caretaker') {
    return null;
  }
  
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
              data={allBusList}
              value={busNumber}
              onChange={handleSelectBusChange}
              colorScheme={nowColorScheme}
            />
            
           <DropdownSelect
              label="方向"
              options={
                [
                  { label: (allStops[0] && allStops[0].length > 0) ? '往：'+allStops[0][allStops[0].length - 1].name : '去程', value: '0' },
                  { label: (allStops[1] && allStops[1].length > 0) ? '往：'+allStops[1][allStops[1].length - 1].name : '回程', value: '1' }
                ]
              }
              selectedValue={direction === -1 ?  ''  : direction.toString() }
              onValueChange={handleDirectionChange}
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
            <ThemedText style={styles.buttonText}>開始行程</ThemedText>
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
