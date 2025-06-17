// components/GlobalTaskProvider.tsx
import React, { useEffect, useContext } from 'react';
import { AuthContext } from '@/utils/authContext';
import { CheckTripStatus, SendCareReceiverLoc, getCareReceiverLoc } from '@/utils/busService';
import * as Location from 'expo-location';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const GlobalTaskProvider = ({ children }: { children:any }) => {
  const {
    isLoggedIn,
    userId,
    pairedWith,
    role,
    inTrip,
    setInTrip,
    setBusNumber,
    setStartStop,
    setEndStop,
    setTerminal,
    setDirection,
    setCareReceiverLocation,
    // any other setters or states you want to update
  } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) return; // only run when logged in
    const interval = setInterval(async () => {
      try {
        const now = new Date().toLocaleTimeString();
        console.log(`[✅ Task ran at ${now} for user ${userId}]`);
        // console.log(`${isLoggedIn} ${userId} ${role} ${inTrip}`);
        if (role === 'careReceiver') {
          if (!inTrip) {
            const status = await CheckTripStatus(userId);
            if (status !== null && status !== undefined) {
                setBusNumber(status?.busName);
                setStartStop(status?.startStation);
                setEndStop(status?.endStation);
                setTerminal(status?.direction?.terminal);
                setDirection(status?.direction?.direction);
                setInTrip(true);
                console.log(status);
            }
          }
          if (inTrip) {
            const loc = await Location.getCurrentPositionAsync({});
            const location = {
              "lat": loc.coords.latitude,
              "lng": loc.coords.longitude
            }
            setCareReceiverLocation(location);
            // Send the care receiver's current location to the backend
            await SendCareReceiverLoc(userId, location);
            console.log(`Sent care receiver location for user ${userId}`);
          }
        }
        else if (role === 'caretaker') {
          const loc = await getCareReceiverLoc(pairedWith?.id);
          setCareReceiverLocation(loc);
        }
        // Example: fetch some status or update trip info
        // const response = await fetch('your-api-endpoint', { headers: { Authorization: `Bearer ${token}` } });
        // const data = await response.json();
        // setInTrip(data.inTrip);

        // Just an example log or state update for demo:
        // setInTrip(prev => !prev);
      } catch (error) {
        console.error('Error running global task:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    isLoggedIn,
    userId,
    pairedWith,
    role,
    inTrip,
    setInTrip,
    setBusNumber,
    setStartStop,
    setEndStop,
    setTerminal,
    setDirection,
    setCareReceiverLocation
  ]);

  return  <>{children}</>;
};
