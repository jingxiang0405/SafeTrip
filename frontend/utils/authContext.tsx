import { SplashScreen, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { api } from './apiConfig';
import { Alert } from 'react-native';

SplashScreen.preventAutoHideAsync();


type Partner = {
    id: number;
    name: string;
} | null;


type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    userId: number;
    username?: string;
    role: string;
    pairedWith: Partner;
    token: string;
    emergencyContact?: string;
    startStop?: string;
    endStop?: string;
    direction?: number;
    terminal?: string;
    busNumber?: string;
    inTrip: boolean;
    careReceiverLocation?: { lat: number, lng: number } | null | undefined;
    nearbyBus?: { PlateNumb: string, BusPosition: { PositionLon: number, PositionLat: number, GeoHash: string } } | null | undefined;

    logIn: (username: string, password: string) => void;
    signUp: (username: string, email: string, phone: string, password: string) => void;
    logOut: () => void;
    selectRole: (newRole: string) => void;
    setPairedWith: (partner: Partner) => void;
    pairWith: (partner: Partner, currentRole?: string) => void;
    unpair: () => void;
    setEmergencyContact: (phone: string) => void;
    setStartStop: (startStop: string) => void;
    setEndStop: (endStop: string) => void;
    setDirection: (direction: number) => void;
    setTerminal: (terminal: string) => void;
    setBusNumber: (busNumber: string) => void;
    setInTrip: (inTrip: boolean) => void;
    setCareReceiverLocation: (location: { lat: number, lng: number } | null | undefined) => void;
    setNearbyBus: (nearbyBus: { PlateNumb: string, BusPosition: { PositionLon: number, PositionLat: number, GeoHash: string } } | null | undefined) => void;

    generatePairCode: () => Promise<string>;
    waitForPairComplete: () => Promise<{ success: boolean; partnerId: number }>;
    submitPairCode: (code: string) => Promise<{ success: boolean; partnerId: number }>;
    checkPairStatus: () => Promise<{ success: boolean; partnerId?: number }>;
};


const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    userId: 0,
    username: "",
    role: "",
    pairedWith: null,
    token: "",
    emergencyContact: "",
    startStop: "",
    endStop: "",
    direction: -1,
    terminal: "",
    busNumber: "",
    inTrip: false,
    careReceiverLocation: null,
    nearbyBus: null,

    logIn: () => { },
    signUp: () => { },
    logOut: () => { },
    selectRole: () => { },
    setPairedWith: () => { },
    pairWith: () => { },
    unpair: () => { },
    setEmergencyContact: () => { },
    setStartStop: () => {}, 
    setEndStop: () => {},
    setDirection: () => {},
    setTerminal: () => {},
    setBusNumber: () => {},
    setInTrip: () => {},
    generatePairCode: async () => "",
    waitForPairComplete: async () => ({ success: false, partnerId: 0 }),
    submitPairCode: async () => ({ success: false, partnerId: 0 }),
    checkPairStatus: async () => ({ success: false }),
    setCareReceiverLocation: () => {},
    setNearbyBus: () => {}
});

export function AuthProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [pairedWith, setPairedWith] = useState<Partner>(null);
    const [token, setToken] = useState<string>("");
    const [emergencyContact, setEmergencyContact] = useState<string>("");
    const [startStop, setStartStop] = useState<string>("");
    const [endStop, setEndStop] = useState<string>("");
    const [direction, setDirection] = useState<number>(-1);
    const [terminal, setTerminal] = useState<string>("");
    const [busNumber, setBusNumber] = useState<string>("");
    const [inTrip, setInTrip] = useState<boolean>(false);
    const [careReceiverLocation, setCareReceiverLocation] = useState<{ lat: number, lng: number } | null | undefined>(null);
    const [nearbyBus, setNearbyBus] = useState<{ PlateNumb: string, BusPosition: { PositionLon: number, PositionLat: number, GeoHash: string } } | null | undefined>(null);

    const router = useRouter();

    const storeAuthState = async (auth: {
        userId: number;
        username: string;
        token: string;
        role: string;
        pairedWith: Partner;
        emergencyContact?: string;
        startStop?: string,
        endStop?: string,
        direction?: number,
        terminal?: string,
        busNumber?: string,
        inTrip?: boolean,
        careReceiverLocation?: { lat: number, lng: number } | null | undefined,
        nearbyBus?: { PlateNumb: string, BusPosition: { PositionLon: number, PositionLat: number, GeoHash: string } } | null | undefined,
    }) => {
        try {
            const jsonValue = JSON.stringify(auth);
            await AsyncStorage.setItem(authStorageKey, jsonValue);
        } catch (e) {
            console.warn("Failed to store auth state:", e);
            throw e;
        }
    };

    const logIn = async (username: string, password: string) => {
        try {
            const response = await api.post('/user/login', {
                name: username,
                password
            });

            const userData = response.data;

            // First update all states
            setUserId(userData.id);
            setIsLoggedIn(true);
            setUsername(userData.name);
            setToken(userData.token);
            setRole(userData.role || '');
            setPairedWith(userData.partner_id ? { id: userData.partner_id, name: userData.partner_name } : null);

            // Then store the state
            await storeAuthState({
                userId: userData.id,
                username: userData.name,
                token: userData.token,
                role: userData.role || '',
                pairedWith: userData.partner_id ? { id: userData.partner_id, name: userData.partner_name } : null,
                emergencyContact
            });

            router.replace("/");
        } catch (error: any) {
            console.error('Login failed:', error);
            // Reset states on failure
            setIsLoggedIn(false);
            setUsername("");
            setToken("");

            // Show error message to user
            Alert.alert(
                "Login Failed",
                error.response?.data?.message || "Invalid username or password"
            );
            throw error;
        }
    };

    const signUp = async (username: string, email: string, phone: string, password: string) => {
        try {
            const response = await api.post('/user/signup', {
                name: username,
                password,
                email,
                phone
            });

            const userData = response.data;

            // First update all states
            setIsLoggedIn(true);
            setUsername(userData.name);
            setUserId(userData.id);
            setToken(userData.token);
            setRole('');
            setPairedWith(null);
            setEmergencyContact("");
            setStartStop("");
            setEndStop("");
            setDirection(-1);
            setTerminal("");
            setBusNumber("");
            setCareReceiverLocation(null);
            setNearbyBus(null);

            // Then store the state
            await storeAuthState({
                userId: userData.id,
                username: userData.name,
                token: userData.token,
                role: '',
                pairedWith: null,
                emergencyContact: ""
            });

            router.replace("/");
        } catch (error: any) {
            console.error('Signup failed:', error);
            // Reset states on failure
            setIsLoggedIn(false);
            setUserId(0);
            setUsername("");
            setToken("");

            // Show error message to user
            Alert.alert(
                "Signup Failed",
                error.response?.data?.message || "Could not create account"
            );
            throw error;
        }
    };

    const logOut = async () => {
        try {
            // Optionally call backend to invalidate token
            // await api.post('/user/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggedIn(false);
            setUserId(0);
            setUsername("");
            setToken("");
            setRole('');
            setPairedWith(null);
            setEmergencyContact("");
            setCareReceiverLocation(null);
            setNearbyBus(null);
            await storeAuthState({
                userId: 0,
                username: "",
                token: "",
                role: '',
                pairedWith: null,
                emergencyContact: ""
            });
            await AsyncStorage.removeItem(authStorageKey);
            router.replace("/login");
        }
    };

    const selectRole = async (newRole: string) => {
        try {
            // First set the state
            setRole(newRole);
            // Then store the updated state
            await storeAuthState({
                userId,
                username,
                token,
                role: newRole,
                pairedWith,
                emergencyContact
            });
        } catch (error) {
            // Reset state on failure
            setRole('');
            throw error;
        }
    };

    const pairWith = async (partner: Partner, currentRole?: string) => {
        if (!partner || !partner.id || !partner.name) {
            throw new Error('Invalid partner data');
        }

        try {
            setPairedWith(partner);
            // Use the passed role value or fall back to state
            const roleToUse = currentRole || role;
            await storeAuthState({
                userId,
                username,
                token,
                role: roleToUse,
                pairedWith: partner,
                emergencyContact
            });
        } catch (error) {
            console.error('Pairing failed:', error);
            setPairedWith(null); // Reset on failure
            throw error;
        }
    };

    const unpair = async () => {
        try {
            // TODO: implement backend 
            setPairedWith(null);
            setRole(''); // This is resetting the role!
            await storeAuthState({ userId, username, token, role: '', pairedWith: null, emergencyContact });
        } catch (error) {
            throw error;
        }
    };

    const handleSetEmergencyContact = async (phone: string) => {
        try {
            // TODO: Backend - Update emergency contact in backend
            // API call example:
            // const response = await axios.post('/api/emergency-contact', {
            //     userId: username,
            //     token: token,
            //     phone: phone
            // });
            // if (response.status === 200) {
            //     setEmergencyContact(phone);
            //     storeAuthState({ username, token, role, pairedWith, emergencyContact: phone });
            // }

            // Temporary local implementation
            setEmergencyContact(phone);
            storeAuthState({ userId, username, token, role, pairedWith, emergencyContact: phone });
        } catch (error) {
            console.error('Setting emergency contact failed:', error);
            throw error;
        }
    };

    const generatePairCode = async () => {
        try {
            const response = await api.get(`/user/pair/${userId}`);
            return response.data.code;
        } catch (error) {
            console.error('Generate pair code failed:', error);
            throw error;
        }
    };

    const waitForPairComplete = async () => {
        try {
            const response = await api.get(`/user/pair/${userId}/subscribe`);
            if (response.data.success) {
                console.log('Pairing completed:', response.data);
                const partnerData = response.data;
                setPairedWith({ id: partnerData.caretakerId, name: partnerData.caretakerName || '' });
                setRole('careReceiver');

                // Update stored state
                await storeAuthState({
                    userId,
                    username,
                    token,
                    role: 'careReceiver',
                    pairedWith: { id: partnerData.caretakerId, name: partnerData.caretakerName || '' },
                    emergencyContact
                });

                return { success: true, partnerId: partnerData.caretakerId };
            }
            return { success: false, partnerId: 0 };
        } catch (error) {
            console.error('Wait for pair failed:', error);
            throw error;
        }
    };

    const submitPairCode = async (code: string) => {
        try {
            const response = await api.put(`/user/${userId}/pair/code/${code}`);
            if (response.data.message === 'pairing success') {
                const partnerData = response.data;
                console.log('Pairing successful:', partnerData);
                setPairedWith({ id: partnerData.partnerId, name: partnerData.partnerName });
                setRole('caretaker');

                // Update stored state
                await storeAuthState({
                    userId,
                    username,
                    token,
                    role: 'caretaker',
                    pairedWith: { id: partnerData.partnerId, name: partnerData.partnerName },
                    emergencyContact
                });

                return { success: true, partnerId: partnerData.partnerId };
            }
            return { success: false, partnerId: 0 };
        } catch (error) {
            console.warn('Submit pair code failed:', error);
            throw error;
        }
    };

    const checkPairStatus = async () => {
        try {
            const response = await api.get(`/user/pair/${userId}/status`);
            return {
                success: response.data.success,
                partnerId: response.data.partnerId
            };
        } catch (error) {
            console.error('Check pair status failed:', error);
            return { success: false };
        }
    };

    useEffect(() => {
        const getAuthFromStorage = async () => {
            try {
                const value = await AsyncStorage.getItem(authStorageKey);
                if (value !== null) {
                    const { userId, username, token, role, pairedWith, emergencyContact } = JSON.parse(value);
                    setUserId(userId);
                    setUsername(username);
                    setToken(token);
                    setRole(role);
                    setPairedWith(pairedWith);
                    setEmergencyContact(emergencyContact || "");
                    setIsLoggedIn(true);
                } else {
                    // No stored auth data
                    setIsLoggedIn(false);
                    setUsername("");
                    setToken("");
                    setRole("");
                    setPairedWith(null);
                    setEmergencyContact("");
                }
            } catch (e) {
                console.log("Error fetching from storage", e);
                // Reset auth state on error
                setIsLoggedIn(false);
                setUserId(0);
                setUsername("");
                setToken("");
                setRole("");
                setPairedWith(null);
                setEmergencyContact("");
            }
            setIsReady(true);
        };
        getAuthFromStorage();
    }, []);

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    return (
        <AuthContext.Provider
            value={{
                userId,
                isLoggedIn,
                isReady,
                username,
                token,
                role,
                pairedWith,
                emergencyContact,
                startStop,
                endStop,
                direction,
                terminal,
                busNumber,
                inTrip,
                careReceiverLocation,
                nearbyBus,
                logIn,
                signUp,
                logOut,
                selectRole,
                pairWith,
                setPairedWith,
                unpair,
                setEmergencyContact: handleSetEmergencyContact,
                generatePairCode,
                waitForPairComplete,
                submitPairCode,
                checkPairStatus,
                setStartStop,
                setEndStop,
                setDirection,
                setTerminal,
                setBusNumber,
                setInTrip,
                setCareReceiverLocation,
                setNearbyBus
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
