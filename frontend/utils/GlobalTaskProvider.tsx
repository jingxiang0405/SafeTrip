// components/GlobalTaskProvider.tsx
import React, { useEffect, useContext } from 'react';
import { AuthContext } from '@/utils/authContext';
import { CheckTripStatus } from '@/utils/busService';

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
    setDirection
    // any other setters or states you want to update
  } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) return; // only run when logged in
    const interval = setInterval(async () => {
      try {
        const now = new Date().toLocaleTimeString();
        console.log(`[✅ Task ran at ${now} for user ${userId}]`);
        // console.log(`${isLoggedIn} ${userId} ${role} ${inTrip}`);
        if (role === 'careReceiver' && !inTrip) {
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
    setDirection
  ]);

  return  <>{children}</>;
};
