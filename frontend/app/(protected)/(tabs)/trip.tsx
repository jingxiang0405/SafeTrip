import { Colors } from '@/constants/Colors';
import axios from 'axios';
import { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BusStop {
  StopName: {
    Zh_tw: string;
  };
  StopID: string;
}


interface BusRoute {
  RouteName: {
    Zh_tw: string;
  };
  RouteID: string;
  Stops: BusStop[];
}

export default function Trip() {
  const colorScheme = useColorScheme();
  const nowColorScheme: 'light' | 'dark' = colorScheme ?? 'light';
  const [startStop, setStartStop] = useState('');
  const [endStop, setEndStop] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = initStyles(nowColorScheme);
  const insets = useSafeAreaInsets();

  const handleCreateTrip = async () => {
    if (!startStop || !endStop || !busNumber) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This would be replaced with your actual TDX API endpoint
      const response = await axios.get(`YOUR_BACKEND_API/bus-routes/${busNumber}`);
      setBusRoutes(response.data);
      
      // Here you would also create the trip in your backend
      await axios.post('YOUR_BACKEND_API/trips', {
        startStop,
        endStop,
        busNumber
      });

    } catch (err) {
      setError('Failed to create trip. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.topBarContainer}>
      <ScrollView style={styles.scrollview}>
        <View style={styles.topBar}>
          <Text style={{color: Colors[nowColorScheme].text, fontWeight: 'bold', fontSize: 28}}>Trip</Text>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Start Bus Stop</Text>
          <TextInput
            style={styles.input}
            value={startStop}
            onChangeText={setStartStop}
            placeholder="Enter starting bus stop"
            placeholderTextColor={Colors[nowColorScheme].subtext}
          />

          <Text style={styles.label}>End Bus Stop</Text>
          <TextInput
            style={styles.input}
            value={endStop}
            onChangeText={setEndStop}
            placeholder="Enter destination bus stop"
            placeholderTextColor={Colors[nowColorScheme].subtext}
          />

          <Text style={styles.label}>Bus Number</Text>
          <TextInput
            style={styles.input}
            value={busNumber}
            onChangeText={setBusNumber}
            placeholder="Enter bus number"
            placeholderTextColor={Colors[nowColorScheme].subtext}
            keyboardType="number-pad"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateTrip}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </Text>
          </TouchableOpacity>
        </View>

        {busRoutes.length > 0 && (
          <View style={styles.routeContainer}>
            <Text style={styles.sectionTitle}>Bus Route Information</Text>
            {busRoutes.map((route, index) => (
              <View key={route.RouteID} style={styles.routeItem}>
                <Text style={styles.routeName}>{route.RouteName.Zh_tw}</Text>
                <Text style={styles.stopsTitle}>Stops:</Text>
                {route.Stops.map((stop, stopIndex) => (
                  <Text key={stop.StopID} style={styles.stopName}>
                    {stopIndex + 1}. {stop.StopName.Zh_tw}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
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
      paddingBottom: 5,
      marginTop: 10,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
      height: Platform.OS === 'android' ? 79 : 50,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      borderBottomColor: Colors[nowColorScheme].border,
      borderBottomWidth: 0.5,
    },
    headerText: {
      color: Colors[nowColorScheme].text,
      fontWeight: 'bold',
      fontSize: 28,
    },
    scrollview: {
      flex: 1,
    },
    formContainer: {
      padding: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[nowColorScheme].text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: Colors[nowColorScheme === 'dark' ? 'dark' : 'light'].background,
      borderWidth: 1,
      borderColor: Colors[nowColorScheme].border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      color: Colors[nowColorScheme].text,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#007AFF',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    errorText: {
      color: '#FF3B30',
      marginBottom: 16,
    },
    routeContainer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: Colors[nowColorScheme].border,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors[nowColorScheme].text,
      marginBottom: 16,
    },
    routeItem: {
      marginBottom: 24,
      padding: 16,
      backgroundColor: Colors[nowColorScheme === 'dark' ? 'dark' : 'light'].background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[nowColorScheme].border,
    },
    routeName: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors[nowColorScheme].text,
      marginBottom: 12,
    },
    stopsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[nowColorScheme].text,
      marginBottom: 8,
    },
    stopName: {
      fontSize: 14,
      color: Colors[nowColorScheme].text,
      marginLeft: 16,
      marginBottom: 4,
    },
  });
  return styles;
};