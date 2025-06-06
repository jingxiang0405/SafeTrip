import { useState, createContext, PropsWithChildren, useEffect } from "react";
import { SplashScreen, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();


type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    username?: string;
    role: string;
    pairedWith: object;
    token: string;

    logIn: (username: string, password: string) => void;
    signUp: (username: string, email: string, phone: string, password: string) => void;
    logOut: () => void;

    selectRole: (newRole: string) => void;
    pairWith: (pairWith: object) => void;
    unpair: () => void;
};

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,
    username: "",
    role: "",
    pairedWith: {},
    token: "",

    logIn: () => { },
    signUp: () => { },
    logOut: () => { },
    selectRole: () => { },
    pairWith: () => { },
    unpair: () => { },
});

export function AuthProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [pairedWith, setPairedWith] = useState<object>({});
    const [token, setToken] = useState<string>("");

    const router = useRouter();

    const storeAuthState = async (auth: {
        username: string;
        token: string;
        role: string;
        pairedWith: object;
    }) => {
        try {
            const jsonValue = JSON.stringify(auth);
            await AsyncStorage.setItem(authStorageKey, jsonValue);
        } catch (e) {
            console.log("store error", e);
        }
    };

    const logIn = (username: string, password: string) => {

        // TODO: Backend
        const userData = {
            token: "dummy-user-token",
            role: 'caregiver',
            pairedWith: { name: 'Tom', id: 123 }
        }
        setIsLoggedIn(true);
        setUsername(username);
        setToken(userData.token);
        setRole(userData.role);
        setPairedWith({});
        storeAuthState({ username, token: userData.token, role: '', pairedWith: {} });
        router.replace("/");
    };

    const signUp = (username: string, email: string, phone: string, password: string) => {


        // TODO: Backend
        const newToken = "dummy-user-token";
        setIsLoggedIn(true);
        setUsername(username);
        setToken(newToken);
        setRole('');
        setPairedWith({});
        storeAuthState({ username, token: newToken, role: '', pairedWith: {} });
        router.replace("/");
    };

    const logOut = () => {
        setIsLoggedIn(false);
        setUsername("");
        setToken("");
        setRole('');
        setPairedWith({});
        AsyncStorage.removeItem(authStorageKey);
        router.replace("/login");
    };

    const selectRole = (newRole: string) => {
        setRole(newRole);
        storeAuthState({ username, token, role: newRole, pairedWith: {} });
    };

    const pairWith = (partner: object) => {
        setPairedWith(partner);
        storeAuthState({ username, token, role, pairedWith: partner });
    };

    const unpair = () => {
        setPairedWith({});
        storeAuthState({ username, token, role, pairedWith: {} });
    };

    useEffect(() => {
        const getAuthFromStorage = async () => {
            try {
                const value = await AsyncStorage.getItem(authStorageKey);
                if (value !== null) {
                    const { username, token, role, pairedWith } = JSON.parse(value);
                    setUsername(username);
                    setToken(token);
                    setRole(role);
                    setPairedWith(pairedWith);
                    setIsLoggedIn(true);
                }
            } catch (e) {
                console.log("Error fetching from storage", e);
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
                isLoggedIn,
                isReady,
                username,
                token,
                role,
                pairedWith,
                logIn,
                signUp,
                logOut,
                selectRole,
                pairWith,
                unpair,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
