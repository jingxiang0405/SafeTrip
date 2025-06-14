import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

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

    logIn: (username: string, password: string) => void;
    signUp: (username: string, email: string, phone: string, password: string) => void;
    logOut: () => void;

    selectRole: (newRole: string) => void;
    pairWith: (partner: Partner, currentRole?: string) => void;
    unpair: () => void;
    setEmergencyContact: (phone: string) => void;
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

    logIn: () => { },
    signUp: () => { },
    logOut: () => { },
    selectRole: () => { },
    pairWith: () => { },
    unpair: () => { },
    setEmergencyContact: () => { },
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

    const router = useRouter();

    const storeAuthState = async (auth: {
        userId: number;
        username: string;
        token: string;
        role: string;
        pairedWith: Partner;
        emergencyContact?: string;
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
            // TODO: Backend
            const userData = {
                token: "dummy-user-token",
                role: role || '',
                pairedWith: pairedWith
            }
            
            // First update all states
            setIsLoggedIn(true);
            setUsername(username);
            setToken(userData.token);
            
            // Then store the state
            await storeAuthState({ 
                userId: userId,
                username, 
                token: userData.token, 
                role, 
                pairedWith, 
                emergencyContact 
            });
            
            router.replace("/");
        } catch (error) {
            console.error('Login failed:', error);
            // Reset states on failure
            setIsLoggedIn(false);
            setUsername("");
            setToken("");
            throw error;
        }
    };

    const signUp = async (username: string, email: string, phone: string, password: string) => {
        try {
            // TODO: Backend
            const newToken = "dummy-user-token";
            const newUserId = 0;

            // First update all states
            setIsLoggedIn(true);
            setUsername(username);
            setUserId(newUserId);
            setToken(newToken);
            
            // Then store the state
            await storeAuthState({ 
                userId: newUserId,
                username, 
                token: newToken, 
                role, 
                pairedWith, 
                emergencyContact 
            });
            
            router.replace("/");
        } catch (error) {
            console.error('Signup failed:', error);
            // Reset states on failure
            setIsLoggedIn(false);
            setUserId(0);
            setUsername("");
            setToken("");
            throw error;
        }
    };

    const logOut = () => {
        setIsLoggedIn(false);
        setUserId(0);
        setUsername("");
        setToken("");
        setRole('');
        setPairedWith(null);
        setEmergencyContact("");
        storeAuthState({ userId:userId, username: "", token: "", role: '', pairedWith: null, emergencyContact: "" });
        AsyncStorage.removeItem(authStorageKey);
        router.replace("/login");
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
                logIn,
                signUp,
                logOut,
                selectRole,
                pairWith,
                unpair,
                setEmergencyContact: handleSetEmergencyContact,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
